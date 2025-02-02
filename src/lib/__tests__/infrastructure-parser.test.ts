import { describe, expect, it } from "vitest";
import {
  parseInfrastructureText,
  generateInfrastructureText,
} from "../infrastructure-parser";
import { Node, Edge } from "reactflow";

describe("Infrastructure Parser", () => {
  describe("parseInfrastructureText", () => {
    it("should parse basic elements correctly", () => {
      const input = `
elements:
  web:
    type: compute
    specs:
      size: t2.micro
    metadata:
      position:
        x: 100
        y: 200
  db:
    type: database
    specs:
      engine: postgres
    metadata:
      position:
        x: 300
        y: 200
`;

      const { nodes, edges } = parseInfrastructureText(input);

      expect(nodes).toHaveLength(2);
      expect(edges).toHaveLength(0);

      const webNode = nodes.find((n) => n.id === "web");
      const dbNode = nodes.find((n) => n.id === "db");

      expect(webNode).toBeDefined();
      expect(webNode?.type).toBe("cloudMachine");
      expect(webNode?.position).toEqual({ x: 100, y: 200 });
      expect(webNode?.data.size).toBe("t2.micro");

      expect(dbNode).toBeDefined();
      expect(dbNode?.type).toBe("cloudDatabase");
      expect(dbNode?.position).toEqual({ x: 300, y: 200 });
      expect(dbNode?.data.engine).toBe("postgres");
    });

    it("should parse connections correctly", () => {
      const input = `
elements:
  web:
    type: compute
    connections:
      - to: db
        port: 5432
  db:
    type: database
`;

      const { nodes, edges } = parseInfrastructureText(input);

      expect(nodes).toHaveLength(2);
      expect(edges).toHaveLength(1);

      const edge = edges[0];
      expect(edge.source).toBe("web");
      expect(edge.target).toBe("db");
      expect(edge.label).toBe("Port 5432");
    });

    it("should parse networks with contained elements", () => {
      const input = `
elements:
  web:
    type: compute
  db:
    type: database
networks:
  vpc:
    specs:
      cidr: 10.0.0.0/16
    contains:
      - web
      - db
    metadata:
      position:
        x: 0
        y: 0
      size:
        width: 400
        height: 300
`;

      const { nodes } = parseInfrastructureText(input);

      expect(nodes).toHaveLength(3); // 2 elements + 1 network

      const networkNode = nodes.find((n) => n.id === "vpc");
      expect(networkNode).toBeDefined();
      expect(networkNode?.type).toBe("cloudNetwork");
      expect(networkNode?.style).toEqual({
        width: 400,
        height: 300,
        zIndex: -1,
      });
      expect(networkNode?.data.cidr).toBe("10.0.0.0/16");
    });
  });

  describe("generateInfrastructureText", () => {
    it("should generate YAML for basic elements", () => {
      const nodes: Node[] = [
        {
          id: "web",
          type: "cloudMachine",
          position: { x: 100, y: 200 },
          data: { label: "web", size: "t2.micro" },
        },
        {
          id: "db",
          type: "cloudDatabase",
          position: { x: 300, y: 200 },
          data: { label: "db", engine: "postgres" },
        },
      ];
      const edges: Edge[] = [];

      const yaml = generateInfrastructureText(nodes, edges);
      const parsed = parseInfrastructureText(yaml);

      expect(parsed.nodes).toHaveLength(2);
      expect(parsed.edges).toHaveLength(0);

      const webNode = parsed.nodes.find((n) => n.id === "web");
      const dbNode = parsed.nodes.find((n) => n.id === "db");

      expect(webNode?.data.size).toBe("t2.micro");
      expect(dbNode?.data.engine).toBe("postgres");
    });

    it("should generate YAML with connections", () => {
      const nodes: Node[] = [
        {
          id: "web",
          type: "cloudMachine",
          position: { x: 100, y: 200 },
          data: { label: "web" },
        },
        {
          id: "db",
          type: "cloudDatabase",
          position: { x: 300, y: 200 },
          data: { label: "db" },
        },
      ];
      const edges: Edge[] = [
        {
          id: "e1",
          source: "web",
          target: "db",
          label: "Port 5432",
        },
      ];

      const yaml = generateInfrastructureText(nodes, edges);
      const parsed = parseInfrastructureText(yaml);

      expect(parsed.edges).toHaveLength(1);
      expect(parsed.edges[0].label).toBe("Port 5432");
    });

    it("should generate YAML with networks", () => {
      const nodes: Node[] = [
        {
          id: "web",
          type: "cloudMachine",
          position: { x: 50, y: 50 },
          data: { label: "web" },
        },
        {
          id: "vpc",
          type: "cloudNetwork",
          position: { x: 0, y: 0 },
          style: { width: 400, height: 300, zIndex: -1 },
          data: { label: "vpc", cidr: "10.0.0.0/16" },
        },
      ];
      const edges: Edge[] = [];

      const yaml = generateInfrastructureText(nodes, edges);
      const parsed = parseInfrastructureText(yaml);

      const networkNode = parsed.nodes.find((n) => n.id === "vpc");
      expect(networkNode).toBeDefined();
      expect(networkNode?.style).toMatchObject({
        width: 400,
        height: 300,
      });
      expect(networkNode?.data.cidr).toBe("10.0.0.0/16");
    });
  });
});
