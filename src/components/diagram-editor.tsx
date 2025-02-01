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
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import {
  parseInfrastructureText,
  generateInfrastructureText,
} from "@/lib/infrastructure-parser";
import { CloudMachineNode } from "./nodes/cloud-machine";
import { CloudDatabaseNode } from "./nodes/cloud-database";
import { CloudNetworkNode } from "./nodes/cloud-network";
import { CloudLoadBalancerNode } from "./nodes/cloud-load-balancer";
import { CloudStorageNode } from "./nodes/cloud-storage";
import { CloudQueueNode } from "./nodes/cloud-queue";
import { CloudCdnNode } from "./nodes/cloud-cdn";
import { CloudApiGatewayNode } from "./nodes/cloud-api-gateway";
import { CloudFirewallNode } from "./nodes/cloud-firewall";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const nodeTypes = {
  cloudMachine: CloudMachineNode,
  cloudDatabase: CloudDatabaseNode,
  cloudNetwork: CloudNetworkNode,
  cloudLoadBalancer: CloudLoadBalancerNode,
  cloudStorage: CloudStorageNode,
  cloudQueue: CloudQueueNode,
  cloudCdn: CloudCdnNode,
  cloudApiGateway: CloudApiGatewayNode,
  cloudFirewall: CloudFirewallNode,
};

const defaultInfrastructure = `# Example infrastructure
elements:
  app-lb:
    type: loadbalancer
    specs:
      protocol: http
      port: 80
      algorithm: round-robin
    connections:
      - to: web-server-1
        port: 80
      - to: web-server-2
        port: 80

  web-server-1:
    type: compute
    specs:
      cpu: 2
      memory: 4GB
    connections:
      - to: cache
        port: 6379
      - to: database
        port: 5432

  web-server-2:
    type: compute
    specs:
      cpu: 2
      memory: 4GB
    connections:
      - to: cache
        port: 6379
      - to: database
        port: 5432

  cache:
    type: database
    specs:
      engine: redis
      version: "7.0"
      storage: 1GB

  database:
    type: database
    specs:
      engine: postgresql
      version: "14"
      storage: 100GB

networks:
  main-vpc:
    specs:
      cidr: 10.0.0.0/16
    contains:
      - app-lb
      - web-server-1
      - web-server-2
      - cache
      - database`;

function DiagramEditorContent() {
  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);
  const [text, setText] = React.useState(defaultInfrastructure);
  const [selectedNodeType, setSelectedNodeType] = React.useState<string>("");
  const { toast } = useToast();
  const { theme } = useTheme();
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

  const handleTextChange = React.useCallback((value: string | undefined) => {
    setText(value || "");
  }, []);

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
          ...(type === "cloudLoadBalancer" && {
            protocol: "http",
            port: 80,
            algorithm: "round-robin",
          }),
          ...(type === "cloudStorage" && {
            storage: "100GB",
            type: "object-store",
          }),
          ...(type === "cloudQueue" && {
            type: "rabbitmq",
            retention: "24h",
            throughput: "1000msg/s",
          }),
          ...(type === "cloudCdn" && {
            origin: "example.com",
            caching: "default",
            locations: ["us", "eu", "asia"],
          }),
          ...(type === "cloudApiGateway" && {
            auth: ["jwt", "api-key"],
            rateLimit: "100/min",
            endpoints: ["/api/v1"],
          }),
          ...(type === "cloudFirewall" && {
            inbound: ["80/tcp", "443/tcp"],
            outbound: ["all"],
            default: "deny",
          }),
        },
      };

      setNodes((nds) => [...nds, newNode]);
      updateText();
      setSelectedNodeType(""); // Reset the select after adding a node
    },
    [nodes, reactFlowInstance, updateText]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-10rem)]">
      <div className="rounded-lg flex flex-col">
        <div className="border flex-1">
          <Editor
            height="100%"
            defaultLanguage="yaml"
            theme={theme === "dark" ? "vs-dark" : "light"}
            value={text}
            onChange={handleTextChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              wrappingIndent: "indent",
              automaticLayout: true,
            }}
          />
        </div>
        <div className="pt-2">
          <Button variant="default" onClick={updateDiagram} className="w-full">
            Update Diagram
          </Button>
        </div>
      </div>
      <div className="rounded-lg flex flex-col">
        <div className="flex-1 border">
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
            <div className="absolute top-2 right-2 z-10">
              <Select value={selectedNodeType} onValueChange={addNode}>
                <SelectTrigger>
                  <SelectValue placeholder="Add node" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cloudMachine">Machine</SelectItem>
                  <SelectItem value="cloudDatabase">Database</SelectItem>
                  <SelectItem value="cloudNetwork">Network</SelectItem>
                  <SelectItem value="cloudLoadBalancer">
                    Load Balancer
                  </SelectItem>
                  <SelectItem value="cloudStorage">Storage</SelectItem>
                  <SelectItem value="cloudQueue">Queue</SelectItem>
                  <SelectItem value="cloudCdn">CDN</SelectItem>
                  <SelectItem value="cloudApiGateway">API Gateway</SelectItem>
                  <SelectItem value="cloudFirewall">Firewall</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div className="pt-2">
          <Button variant="default" onClick={updateText} className="w-full">
            Update Text
          </Button>
        </div>
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
