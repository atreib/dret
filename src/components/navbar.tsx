"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { ProjectsSheet } from "@/components/projects-sheet";
import { SettingsSheet } from "@/components/settings-sheet";
import Link from "next/link";
import { DocumentationSidebar } from "./documentation-sidebar";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-14 items-center justify-center px-12">
        <Link href="/" className="font-semibold">
          Cloud Text2Diagram
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <DocumentationSidebar />
            <ProjectsSheet />
            <SettingsSheet />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
