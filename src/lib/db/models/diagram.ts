"use client";

import { z } from "zod";
import { BaseRepository } from "../indexed-db";

const DiagramSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Diagram = z.infer<typeof DiagramSchema>;

class DiagramRepository extends BaseRepository<Diagram> {
  constructor() {
    super("diagrams", DiagramSchema);
  }
}

// Create a singleton instance
export const diagramRepository = new DiagramRepository();
