"use client";

import * as React from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  parseInfrastructureText,
  generateInfrastructureText,
} from "@/lib/infrastructure-parser";
import { CloudMachineNode } from "./nodes/cloud-machine";
import { CloudDatabaseNode } from "./nodes/cloud-database";
import { CloudNetworkNode } from "./nodes/cloud-network";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

const nodeTypes = {
  cloudMachine: CloudMachineNode,
  cloudDatabase: CloudDatabaseNode,
  cloudNetwork: CloudNetworkNode,
};

const defaultInfrastructure = `# Example infrastructure
machines:
  web-server:
    type: compute
    connections:
      - to: database
        port: 5432
    specs:
      cpu: 2
      memory: 4GB

databases:
  database:
    type: database
    specs:
      engine: postgresql
      version: "14"
      storage: 100GB

networks:
  main-vpc:
    type: network
    specs:
      cidr: 10.0.0.0/16
    contains:
      - web-server
      - database`;

function DiagramEditorContent() {
  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);
  const [text, setText] = React.useState(defaultInfrastructure);
  const { toast } = useToast();
  const reactFlowInstance = useReactFlow();

  // Load initial diagram
  React.useEffect(() => {
    try {
      const { nodes: initialNodes, edges: initialEdges } =
        parseInfrastructureText(defaultInfrastructure);
      setNodes(initialNodes);
      setEdges(initialEdges);
    } catch (err) {
      console.error("Failed to load initial diagram:", err);
    }
  }, []);

  const onNodesChange = React.useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        // First apply the changes
        const updatedNodes = applyNodeChanges(changes, nds);

        // Then ensure networks stay at the back
        return updatedNodes.map((node) => {
          if (node.type === "cloudNetwork") {
            return { ...node, zIndex: -1 };
          }
          return node;
        });
      });
    },
    [setNodes]
  );

  const onEdgesChange = React.useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect = React.useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const updateDiagram = React.useCallback(() => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some infrastructure text.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { nodes: newNodes, edges: newEdges } =
        parseInfrastructureText(text);
      setNodes(newNodes);
      setEdges(newEdges);
      toast({
        title: "Success",
        description: "Diagram updated successfully.",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to parse infrastructure text. Please check the syntax.",
        variant: "destructive",
      });
    }
  }, [text, toast]);

  const updateText = React.useCallback(() => {
    if (nodes.length === 0 && edges.length === 0) {
      setText("");
      return;
    }

    try {
      const newText = generateInfrastructureText(nodes, edges);
      setText(newText);
      toast({
        title: "Success",
        description: "Text updated successfully.",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to generate infrastructure text.",
        variant: "destructive",
      });
    }
  }, [nodes, edges, toast]);

  const handleTextChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    },
    []
  );

  const addNode = React.useCallback(
    (type: string) => {
      const nodeId = `${type}-${nodes.length + 1}`;
      const position = reactFlowInstance.project({
        x: Math.random() * 500,
        y: Math.random() * 500,
      });

      const newNode: Node = {
        id: nodeId,
        type: type,
        position,
        data: {
          label: nodeId,
          ...(type === "cloudMachine" && {
            cpu: 1,
            memory: "1GB",
          }),
          ...(type === "cloudDatabase" && {
            engine: "postgresql",
            version: "14",
            storage: "10GB",
          }),
          ...(type === "cloudNetwork" && {
            cidr: "10.0.0.0/16",
          }),
        },
      };

      setNodes((nds) => [...nds, newNode]);
      updateText();
    },
    [nodes, reactFlowInstance, updateText]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-10rem)]">
      <div className="flex flex-col gap-4">
        <Textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter your infrastructure description here..."
          className="flex-1 font-mono"
        />
        <Button onClick={updateDiagram}>Update Diagram</Button>
      </div>
      <div className="border rounded-lg flex flex-col">
        <div className="border-b p-2 flex items-center gap-2">
          <Select onValueChange={addNode}>
            <SelectTrigger className="w-[180px]">
              <Plus className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Add node" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cloudMachine">Machine</SelectItem>
              <SelectItem value="cloudDatabase">Database</SelectItem>
              <SelectItem value="cloudNetwork">Network</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={updateText}>
            Update Text
          </Button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodesDelete={updateText}
          onEdgesDelete={updateText}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export function DiagramEditor() {
  return (
    <ReactFlowProvider>
      <DiagramEditorContent />
    </ReactFlowProvider>
  );
}
