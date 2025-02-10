"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { ProjectsSheet } from "@/components/projects-sheet";
import { SettingsSheet } from "@/components/settings-sheet";
import Link from "next/link";
import Image from "next/image";
import { DocumentationSidebar } from "./documentation-sidebar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileText, Folder, MenuIcon, Settings } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-14 items-center px-12 justify-between">
        <Link href="/" className="font-semibold">
          <Image
            src="/logo.png"
            alt="Cloudret"
            width={120}
            height={56}
            className={cn(theme === "dark" && "invert")}
            suppressHydrationWarning
          />
        </Link>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <nav className="hidden md:flex items-center space-x-2">
            <DocumentationSidebar>
              <Button variant="ghost" size="icon">
                <FileText className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Open documentation</span>
              </Button>
            </DocumentationSidebar>
            <ProjectsSheet>
              <Button variant="ghost" size="icon">
                <Folder className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Open projects</span>
              </Button>
            </ProjectsSheet>
            <SettingsSheet>
              <Button variant="ghost" size="icon">
                <Settings className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Open settings</span>
              </Button>
            </SettingsSheet>
            <ModeToggle />
          </nav>
          <nav className="flex md:hidden items-center space-x-2">
            <ModeToggle />
            <Popover>
              <PopoverTrigger>
                <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <DocumentationSidebar>
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-start"
                    >
                      <FileText className="h-[1.2rem] w-[1.2rem] mr-2" />
                      Documentation
                    </Button>
                  </DocumentationSidebar>
                </div>
                <div className="flex items-center gap-2">
                  <ProjectsSheet>
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-start"
                    >
                      <Folder className="h-[1.2rem] w-[1.2rem] mr-2" />
                      Projects
                    </Button>
                  </ProjectsSheet>
                </div>
                <div className="flex items-center gap-2">
                  <SettingsSheet>
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-start"
                    >
                      <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
                      Settings
                    </Button>
                  </SettingsSheet>
                </div>
              </PopoverContent>
            </Popover>
          </nav>
        </div>
      </div>
    </header>
  );
}
