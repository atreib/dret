import { Node, Edge } from "reactflow";
import yaml from "yaml";

// Extend the Node type to include resizable property
type ExtendedNode = Node & {
  resizable?: boolean;
};

interface InfrastructureNode {
  type: string;
  connections?: Array<{
    to: string;
    port?: number;
  }>;
  specs?: Record<string, unknown>;
}

interface Infrastructure {
  machines?: Record<string, InfrastructureNode>;
  databases?: Record<string, InfrastructureNode>;
  networks?: Record<string, InfrastructureNode & { contains?: string[] }>;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

function calculateNodePositions(
  machines: Record<string, InfrastructureNode> = {},
  databases: Record<string, InfrastructureNode> = {},
  networks: Record<string, InfrastructureNode & { contains?: string[] }> = {}
): NodePosition[] {
  const positions: NodePosition[] = [];
  const SPACING = 200;
  const NETWORK_PADDING = 50;
  let currentY = 0;

  // First, position machines and databases that are not in any network
  const standaloneNodes = new Set<string>();
  const networkNodes = new Set<string>();

  // Collect nodes that are in networks
  Object.values(networks).forEach((network) => {
    network.contains?.forEach((id) => networkNodes.add(id));
  });

  // Position standalone machines
  Object.keys(machines).forEach((id) => {
    if (!networkNodes.has(id)) {
      standaloneNodes.add(id);
      positions.push({ id, x: 0, y: currentY });
      currentY += SPACING;
    }
  });

  // Position standalone databases
  Object.keys(databases).forEach((id) => {
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
    infrastructure.machines,
    infrastructure.databases,
    infrastructure.networks
  );

  // Helper function to get position for a node
  const getPosition = (id: string): NodePosition => {
    return positions.find((p) => p.id === id) || { id, x: 0, y: 0 };
  };

  // Add machines (zIndex: 2)
  Object.entries(infrastructure.machines || {}).forEach(([id, machine]) => {
    const pos = getPosition(id);
    nodes.push({
      id,
      type: "cloudMachine",
      position: { x: pos.x, y: pos.y },
      data: {
        label: id,
        ...machine.specs,
      },
      zIndex: 2,
    });

    // Add connections
    machine.connections?.forEach((connection) => {
      edges.push({
        id: `e${nodeId++}`,
        source: id,
        target: connection.to,
        label: connection.port ? `Port ${connection.port}` : undefined,
      });
    });
  });

  // Add databases (zIndex: 2)
  Object.entries(infrastructure.databases || {}).forEach(([id, database]) => {
    const pos = getPosition(id);
    nodes.push({
      id,
      type: "cloudDatabase",
      position: { x: pos.x, y: pos.y },
      data: {
        label: id,
        ...database.specs,
      },
      zIndex: 2,
    });
  });

  // Add networks (zIndex: -1 to always be at the back)
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
    machines: {},
    databases: {},
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label, ...specs } = data;

    if (type === "cloudMachine") {
      infrastructure.machines![id] = {
        type: "compute",
        specs,
      };
    } else if (type === "cloudDatabase") {
      infrastructure.databases![id] = {
        type: "database",
        specs,
      };
    } else if (type === "cloudNetwork") {
      infrastructure.networks![id] = {
        type: "network",
        specs,
        contains: getContainedNodes(node),
      };
    }
  });

  // Add connections
  edges.forEach((edge) => {
    const { source, target } = edge;
    const edgeLabel = typeof edge.label === "string" ? edge.label : undefined;

    // Only process regular connections (not containment)
    const sourceNode = infrastructure.machines?.[source];
    if (sourceNode) {
      if (!sourceNode.connections) sourceNode.connections = [];
      sourceNode.connections.push({
        to: target,
        port: edgeLabel ? parseInt(edgeLabel.replace("Port ", "")) : undefined,
      });
    }
  });

  // Clean up empty sections
  if (Object.keys(infrastructure.machines!).length === 0)
    delete infrastructure.machines;
  if (Object.keys(infrastructure.databases!).length === 0)
    delete infrastructure.databases;
  if (Object.keys(infrastructure.networks!).length === 0)
    delete infrastructure.networks;

  return yaml.stringify(infrastructure);
}
