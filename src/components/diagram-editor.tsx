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
import Editor, { type OnMount } from "@monaco-editor/react";
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
import { GenerateInfrastructureDialog } from "./generate-infrastructure-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, LayoutDashboard, PaintbrushIcon, TextIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SaveDiagramDialog } from "./save-diagram-dialog";
import { diagramRepository } from "@/lib/db/models/diagram";
import { NetworkConnectionEdge } from "./edges/network-connection";

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

const edgeTypes = {
  networkConnection: NetworkConnectionEdge,
};

const defaultInfrastructure = `elements:
  cdn:
    type: cdn
    specs:
      origin: web-app
      caching: aggressive
      locations:
        - us
        - eu
        - asia
    metadata:
      position:
        x: 390
        y: -35
    connections:
      - to: web-app
        protocols:
          http: 80
          https: 443
  web-app:
    type: loadbalancer
    specs:
      protocol: http
      port: 80
      algorithm: round-robin
    metadata:
      position:
        x: 400
        y: 250
    connections:
      - to: app-server-1
        protocols:
          http: 8080
      - to: app-server-2
        protocols:
          http: 8080
  app-server-1:
    type: compute
    specs:
      cpu: 4
      memory: 8GB
    metadata:
      position:
        x: 160
        y: 416
    connections:
      - to: api-gateway
        protocols:
          https: 443
      - to: cache
        protocols:
          tcp: 6379
  app-server-2:
    type: compute
    specs:
      cpu: 4
      memory: 8GB
    metadata:
      position:
        x: 606
        y: 412
    connections:
      - to: api-gateway
        protocols:
          https: 443
      - to: cache
        protocols:
          tcp: 6379
  cache:
    type: database
    specs:
      engine: redis
      version: "7.0"
      storage: 2GB
    metadata:
      position:
        x: 400
        y: 550
  api-gateway:
    type: apigateway
    specs:
      auth:
        - jwt
        - api-key
      rateLimit: 1000/min
      endpoints:
        - /api/v1
        - /api/v2
    metadata:
      position:
        x: 400
        y: 846
    connections:
      - to: auth-service
        protocols:
          http: 8081
      - to: main-db
        protocols:
          postgresql: 5432
      - to: event-collector
        protocols:
          http: 8082
  auth-service:
    type: compute
    specs:
      cpu: 2
      memory: 4GB
    metadata:
      position:
        x: 230
        y: 1018
    connections:
      - to: users-db
        protocols:
          postgresql: 5432
  main-db:
    type: database
    specs:
      engine: postgresql
      version: "15"
      storage: 100GB
    metadata:
      position:
        x: 556
        y: 1196
  users-db:
    type: database
    specs:
      engine: postgresql
      version: "15"
      storage: 50GB
    metadata:
      position:
        x: 244
        y: 1188
  event-collector:
    type: queue
    specs:
      type: kafka
      retention: 7d
      throughput: 10000msg/s
    metadata:
      position:
        x: 1048
        y: 1046
    connections:
      - to: analytics-processor
        protocols:
          kafka: 9092
  analytics-processor:
    type: compute
    specs:
      cpu: 8
      memory: 16GB
    metadata:
      position:
        x: 1058
        y: 1252
    connections:
      - to: analytics-store
        protocols:
          postgresql: 5432
      - to: data-lake
        protocols:
          http: 443
  analytics-store:
    type: database
    specs:
      engine: postgresql
      version: "15"
      storage: 500GB
    metadata:
      position:
        x: 942
        y: 1432
  data-lake:
    type: storage
    specs:
      type: object-store
      storage: 10TB
    metadata:
      position:
        x: 1274
        y: 1458
networks:
  app-network:
    specs:
      cidr: 10.0.0.0/16
    contains:
      - web-app
      - app-server-1
      - app-server-2
      - cache
    metadata:
      position:
        x: 112
        y: 173
      size:
        width: 728
        height: 559
  service-network:
    specs:
      cidr: 10.1.0.0/16
    contains:
      - api-gateway
      - auth-service
      - main-db
      - users-db
    metadata:
      position:
        x: 172
        y: 778
      size:
        width: 678
        height: 574
  data-network:
    specs:
      cidr: 10.2.0.0/16
    contains:
      - event-collector
      - analytics-processor
      - analytics-store
      - data-lake
    metadata:
      position:
        x: 882
        y: 990
      size:
        width: 632
        height: 616`;

interface DiagramEditorProps {
  projectId?: string;
}

function DiagramEditorContent({ projectId }: DiagramEditorProps) {
  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);
  const [text, setText] = React.useState("");
  const [projectName, setProjectName] = React.useState<string>("");
  const [selectedNodeType, setSelectedNodeType] = React.useState<string>("");
  const [view, setView] = React.useState<"split" | "diagram" | "editor">(
    "split"
  );
  const { toast } = useToast();
  const { theme } = useTheme();
  const reactFlowInstance = useReactFlow();
  const editorRef = React.useRef<Parameters<OnMount>[0] | null>(null);

  // Load project data if projectId is provided
  React.useEffect(() => {
    async function loadProject() {
      if (!projectId) {
        // Check if we want to start with an empty diagram
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get("empty") === "true") {
          setText("");
          setNodes([]);
          setEdges([]);
        }

        return;
      }

      const result = await diagramRepository.findById(projectId);
      if (result._tag === "success" && result.value) {
        setProjectName(result.value.name);

        if (result.value?.content) {
          setText(result.value.content);
          try {
            const { nodes: initialNodes, edges: initialEdges } =
              parseInfrastructureText(result.value.content);
            setNodes(
              initialNodes.map((node) => ({
                ...node,
                draggable: node.type !== "cloudNetwork",
                selectable: node.type !== "cloudNetwork",
              }))
            );
            setEdges(initialEdges);
          } catch (err) {
            console.error("Failed to parse project content:", err);
            toast({
              title: "Error",
              description: "Failed to load project content",
              variant: "destructive",
            });
          }
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to load project",
          variant: "destructive",
        });
      }
    }

    loadProject();
  }, [projectId, toast]);

  // Load initial diagram for new projects
  React.useEffect(() => {
    if (!projectId) {
      // Check if we want to start with an empty diagram
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("empty") === "true") {
        setText("");
        setNodes([]);
        setEdges([]);
        return;
      }

      try {
        const { nodes: initialNodes, edges: initialEdges } =
          parseInfrastructureText(defaultInfrastructure);
        setText(defaultInfrastructure);
        setNodes(
          initialNodes.map((node) => ({
            ...node,
            draggable: node.type !== "cloudNetwork",
            selectable: node.type !== "cloudNetwork",
          }))
        );
        setEdges(initialEdges);
      } catch (err) {
        console.error("Failed to load initial diagram:", err);
      }
    }
  }, [projectId]);

  const onNodesChange = React.useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const updatedNodes = applyNodeChanges(changes, nds);
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
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "networkConnection",
            data: {
              protocols: {
                tcp: 0, // Default protocol and port
              },
            },
          },
          eds
        )
      );
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
      setNodes(
        newNodes.map((node) => ({
          ...node,
          draggable: node.type !== "cloudNetwork",
          selectable: node.type !== "cloudNetwork",
        }))
      );
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
        draggable: type !== "cloudNetwork",
        selectable: type !== "cloudNetwork",
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

  const handleEditorDidMount: OnMount = React.useCallback((editor) => {
    editorRef.current = editor;
  }, []);

  const handleCopy = React.useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.getValue();
      navigator.clipboard
        .writeText(content)
        .then(() => {
          toast({
            title: "Copied",
            description: "Content copied to clipboard",
          });
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
          toast({
            title: "Error",
            description: "Failed to copy to clipboard",
            variant: "destructive",
          });
        });
    }
  }, [toast]);

  return (
    <div className="flex flex-col gap-4">
      {projectName ? (
        <div className="text-sm text-muted-foreground">
          Working on &quot;{projectName}&quot;
        </div>
      ) : null}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex w-full justify-start items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = "/?empty=true";
            }}
          >
            New
          </Button>
          <GenerateInfrastructureDialog
            onInfrastructureGenerated={(yaml) => {
              setText(yaml);
              try {
                const { nodes: newNodes, edges: newEdges } =
                  parseInfrastructureText(yaml);
                setNodes(
                  newNodes.map((node) => ({
                    ...node,
                    draggable: node.type !== "cloudNetwork",
                    selectable: node.type !== "cloudNetwork",
                  }))
                );
                setEdges(newEdges);
                toast({
                  title: "Success",
                  description: "Infrastructure generated successfully!",
                });
              } catch (err) {
                console.error("Failed to parse generated infrastructure:", err);
                toast({
                  title: "Error",
                  description: "Failed to parse generated infrastructure",
                  variant: "destructive",
                });
              }
            }}
          />
          <SaveDiagramDialog
            content={text}
            projectId={projectId}
            projectName={projectName}
            onSaved={updateText}
          />
        </div>
        <div className="flex w-full justify-start lg:justify-end items-center gap-2">
          <Button
            variant={view === "split" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("split")}
            title="Split View"
          >
            <LayoutDashboard className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "diagram" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("diagram")}
            title="Diagram View"
          >
            <PaintbrushIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "editor" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("editor")}
            title="Editor View"
          >
            <TextIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "grid gap-4 flex-1",
          view === "split" && "grid-cols-1 lg:grid-cols-2",
          view === "diagram" && "grid-cols-1",
          view === "editor" && "grid-cols-1"
        )}
      >
        {(view === "split" || view === "editor") && (
          <div className="rounded-lg flex flex-col min-h-[500px]">
            <div className="border flex-1 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-6 z-10"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy to clipboard</span>
              </Button>
              <Editor
                height="100%"
                defaultLanguage="yaml"
                theme={theme === "dark" ? "vs-dark" : "light"}
                value={text}
                onChange={handleTextChange}
                onMount={handleEditorDidMount}
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
              <Button
                variant="default"
                onClick={updateDiagram}
                className="w-full"
              >
                Update Diagram
              </Button>
            </div>
          </div>
        )}
        {(view === "split" || view === "diagram") && (
          <div className="rounded-lg flex flex-col">
            <div className="flex-1 border min-h-[500px]">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
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
                      <SelectItem value="cloudApiGateway">
                        API Gateway
                      </SelectItem>
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
        )}
      </div>
    </div>
  );
}

export function DiagramEditor({ projectId }: DiagramEditorProps) {
  return (
    <main className="pt-6 pb-12">
      <ReactFlowProvider>
        <DiagramEditorContent projectId={projectId} />
      </ReactFlowProvider>
    </main>
  );
}
