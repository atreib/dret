import { useState, useCallback, useTransition, useMemo } from "react";
import { Node, Edge } from "reactflow";
import { debounce } from "lodash";
import {
  parseInfrastructureText,
  generateInfrastructureText,
} from "@/lib/infrastructure-parser";
import { useToast } from "@/hooks/use-toast";

interface SyncState {
  activeEditor: "monaco" | "flow" | null;
  isPending: boolean;
  debouncedMonacoUpdate: (value: string) => void;
  debouncedFlowUpdate: (nodes: Node[], edges: Edge[]) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setText: (text: string) => void;
  nodes: Node[];
  edges: Edge[];
  text: string;
}

export function useSyncState(): SyncState {
  // State management
  const [activeEditor, setActiveEditor] = useState<"monaco" | "flow" | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const [nodes, setNodesState] = useState<Node[]>([]);
  const [edges, setEdgesState] = useState<Edge[]>([]);
  const [text, setTextState] = useState<string>("");
  const { toast } = useToast();

  // Memoized state setters with active editor tracking
  const setText = useCallback((newText: string) => {
    setActiveEditor("monaco");
    setTextState(newText);
  }, []);

  const setNodes = useCallback<React.Dispatch<React.SetStateAction<Node[]>>>(
    (action) => {
      setActiveEditor("flow");
      setNodesState(action);
    },
    []
  );

  const setEdges = useCallback<React.Dispatch<React.SetStateAction<Edge[]>>>(
    (action) => {
      setActiveEditor("flow");
      setEdgesState(action);
    },
    []
  );

  // Debounced updates with error handling
  const debouncedMonacoUpdate = useMemo(
    () =>
      debounce((value: string) => {
        if (activeEditor === "flow") return;

        startTransition(() => {
          try {
            const { nodes: newNodes, edges: newEdges } =
              parseInfrastructureText(value);
            setNodesState(
              newNodes.map((node) => ({
                ...node,
                draggable: node.type !== "cloudNetwork",
                selectable: node.type !== "cloudNetwork",
              }))
            );
            setEdgesState(newEdges);
          } catch (err) {
            console.error("Failed to parse infrastructure:", err);
            toast({
              title: "Error",
              description:
                "Failed to update diagram. Please check your YAML syntax.",
              variant: "destructive",
            });
          }
        });
      }, 1000),
    [activeEditor, toast]
  );

  const debouncedFlowUpdate = useMemo(
    () =>
      debounce((updatedNodes: Node[], updatedEdges: Edge[]) => {
        if (activeEditor === "monaco") return;

        startTransition(() => {
          try {
            const newText = generateInfrastructureText(
              updatedNodes,
              updatedEdges
            );
            setTextState(newText);
          } catch (err) {
            console.error("Failed to generate infrastructure text:", err);
            toast({
              title: "Error",
              description:
                "Failed to update YAML. Please check the diagram structure.",
              variant: "destructive",
            });
          }
        });
      }, 1000),
    [activeEditor, toast]
  );

  return {
    activeEditor,
    isPending,
    debouncedMonacoUpdate,
    debouncedFlowUpdate,
    setNodes,
    setEdges,
    setText,
    nodes,
    edges,
    text,
  };
}
