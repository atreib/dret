"use client";

import { z } from "zod";
import { IndexedDBRepository } from "../indexed-db";

const DiagramSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type Diagram = z.infer<typeof DiagramSchema>;

// Create a repository instance
export const diagramRepository = new IndexedDBRepository<Diagram>({
  storeName: "diagrams",
  schema: DiagramSchema,
  version: 1,
});

// Example usage:
/*
// Create a new diagram
const createResult = await diagramRepository.create({
  id: crypto.randomUUID(),
  name: 'My Diagram',
  content: '...',
  createdAt: new Date(),
  updatedAt: new Date(),
});

if (createResult._tag === 'success') {
  console.log('Diagram created:', createResult.value);
} else {
  console.error('Failed to create diagram:', createResult.error);
}

// Find all diagrams
const findAllResult = await diagramRepository.findAll();
if (findAllResult._tag === 'success') {
  console.log('All diagrams:', findAllResult.value);
}

// Find by ID
const findByIdResult = await diagramRepository.findById('some-id');
if (findByIdResult._tag === 'success' && findByIdResult.value) {
  console.log('Found diagram:', findByIdResult.value);
}

// Update a diagram
const updateResult = await diagramRepository.update('some-id', {
  ...existingDiagram,
  name: 'Updated Name',
  updatedAt: new Date(),
});

// Delete a diagram
const deleteResult = await diagramRepository.delete('some-id');
*/
