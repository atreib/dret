"use client";

import { DiagramEditor } from "@/components/diagram-editor";
import { DocumentationSidebar } from "@/components/documentation-sidebar";

export default function HomePage() {
  return (
    <div className="container py-8">
      <DiagramEditor />
      <DocumentationSidebar />
    </div>
  );
}
