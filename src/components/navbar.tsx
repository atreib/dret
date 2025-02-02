"use client";

import { FileText } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import { ProjectsSheet } from "@/components/projects-sheet";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-14 items-center justify-center px-12">
        <Link href="/">Cloud Text2Diagram</Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <FileText className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Open documentation</span>
              </Button>
            </SheetTrigger>
            <ProjectsSheet />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
