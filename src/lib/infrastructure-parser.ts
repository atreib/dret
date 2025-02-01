import { Node, Edge } from "reactflow";
import yaml from "yaml";

// Extend the Node type to include resizable property
type ExtendedNode = Node & {
  resizable?: boolean;
};

interface InfrastructureElement {
  type: string;
  specs?: Record<string, unknown>;
  connections?: Array<{
    to: string;
    port?: number;
  }>;
}

interface InfrastructureNetwork {
  specs?: Record<string, unknown>;
  contains?: string[];
}

interface Infrastructure {
  elements: Record<string, InfrastructureElement>;
  networks: Record<string, InfrastructureNetwork>;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

function calculateNodePositions(
  elements: Record<string, InfrastructureElement> = {},
  networks: Record<string, InfrastructureNetwork> = {}
): NodePosition[] {
  const positions: NodePosition[] = [];
  const SPACING = 200;
  const NETWORK_PADDING = 50;
  let currentY = 0;

  // First, position elements that are not in any network
  const standaloneNodes = new Set<string>();
  const networkNodes = new Set<string>();

  // Collect nodes that are in networks
  Object.values(networks).forEach((network) => {
    network.contains?.forEach((id) => networkNodes.add(id));
  });

  // Position standalone elements
  Object.keys(elements).forEach((id) => {
    if (!networkNodes.has(id)) {
      standaloneNodes.add(id);
      positions.push({ id, x: 0, y: currentY });
      currentY += SPACING;
    }
  });

  // Position networks and their contained nodes
  Object.entries(networks).forEach(([networkId, network]) => {
    const containedNodes = network.contains || [];
    if (containedNodes.length === 0) {
      positions.push({ id: networkId, x: 0, y: currentY });
      currentY += SPACING;
      return;
    }

    // Calculate network dimensions based on contained nodes
    const networkY = currentY;
    const networkHeight = Math.max(2, containedNodes.length) * SPACING;
    const networkWidth = SPACING + NETWORK_PADDING * 2;

    // Position contained nodes inside the network
    containedNodes.forEach((nodeId, index) => {
      positions.push({
        id: nodeId,
        x: NETWORK_PADDING,
        y: networkY + NETWORK_PADDING + index * SPACING,
      });
    });

    // Position the network itself
    positions.push({
      id: networkId,
      x: 0,
      y: networkY,
      width: networkWidth,
      height: networkHeight + NETWORK_PADDING * 2,
    });

    currentY += networkHeight + SPACING;
  });

  return positions;
}

export function parseInfrastructureText(text: string): {
  nodes: ExtendedNode[];
  edges: Edge[];
} {
  const infrastructure: Infrastructure = yaml.parse(text);
  const nodes: ExtendedNode[] = [];
  const edges: Edge[] = [];
  let nodeId = 1;

  // Calculate positions for all nodes
  const positions = calculateNodePositions(
    infrastructure.elements,
    infrastructure.networks
  );

  // Helper function to get position for a node
  const getPosition = (id: string): NodePosition => {
    return positions.find((p) => p.id === id) || { id, x: 0, y: 0 };
  };

  // Add all elements
  Object.entries(infrastructure.elements || {}).forEach(([id, element]) => {
    const pos = getPosition(id);
    const nodeTypeMap = {
      compute: "cloudMachine",
      database: "cloudDatabase",
      loadbalancer: "cloudLoadBalancer",
    } as const;
    const nodeType = nodeTypeMap[element.type as keyof typeof nodeTypeMap];

    if (!nodeType) return; // Skip unknown types

    nodes.push({
      id,
      type: nodeType,
      position: { x: pos.x, y: pos.y },
      data: {
        label: id,
        ...element.specs,
      },
      zIndex: 2,
    });

    // Add connections
    element.connections?.forEach((connection) => {
      edges.push({
        id: `e${nodeId++}`,
        source: id,
        target: connection.to,
        label: connection.port ? `Port ${connection.port}` : undefined,
      });
    });
  });

  // Add networks
  Object.entries(infrastructure.networks || {}).forEach(([id, network]) => {
    const pos = getPosition(id);
    nodes.push({
      id,
      type: "cloudNetwork",
      position: { x: pos.x, y: pos.y },
      style: {
        ...(pos.width && pos.height
          ? { width: pos.width, height: pos.height }
          : {}),
        zIndex: -1,
      },
      data: {
        label: id,
        ...network.specs,
      },
      zIndex: -1,
      draggable: true,
      resizable: true,
    });
  });

  return { nodes, edges };
}

export function generateInfrastructureText(
  nodes: Node[],
  edges: Edge[]
): string {
  const infrastructure: Infrastructure = {
    elements: {},
    networks: {},
  };

  // Helper function to get contained nodes for a network
  const getContainedNodes = (networkNode: Node): string[] => {
    const style = networkNode.style as
      | { width?: number; height?: number }
      | undefined;
    const networkBounds = {
      left: networkNode.position.x,
      right: networkNode.position.x + (style?.width || 0),
      top: networkNode.position.y,
      bottom: networkNode.position.y + (style?.height || 0),
    };

    return nodes
      .filter((node) => node.type !== "cloudNetwork")
      .filter((node) => {
        const x = node.position.x;
        const y = node.position.y;
        return (
          x >= networkBounds.left &&
          x <= networkBounds.right &&
          y >= networkBounds.top &&
          y <= networkBounds.bottom
        );
      })
      .map((node) => node.id);
  };

  // Group nodes by type
  nodes.forEach((node) => {
    const { id, type, data } = node;
    if (!type) return; // Skip nodes without a type

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label, ...specs } = data;

    if (type === "cloudNetwork") {
      infrastructure.networks[id] = {
        specs,
        contains: getContainedNodes(node),
      };
    } else {
      const elementTypeMap = {
        cloudMachine: "compute",
        cloudDatabase: "database",
        cloudLoadBalancer: "loadbalancer",
      } as const;
      type NodeType = keyof typeof elementTypeMap;

      if (type in elementTypeMap) {
        const elementType = elementTypeMap[type as NodeType];
        infrastructure.elements[id] = {
          type: elementType,
          specs,
        };
      }
    }
  });

  // Add connections
  edges.forEach((edge) => {
    const { source, target } = edge;
    const edgeLabel = typeof edge.label === "string" ? edge.label : undefined;
    const sourceElement = infrastructure.elements[source];

    // Skip if source doesn't exist or is a network (networks don't have connections)
    if (!sourceElement) return;

    // Initialize connections array if it doesn't exist
    if (!sourceElement.connections) sourceElement.connections = [];

    // Add the connection with appropriate port
    sourceElement.connections.push({
      to: target,
      ...(edgeLabel && {
        port: parseInt(edgeLabel.replace("Port ", "")),
      }),
    });
  });

  return yaml.stringify(infrastructure);
}
