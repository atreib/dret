"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Folder } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { diagramRepository } from "@/lib/db/models/diagram";
import { useToast } from "@/hooks/use-toast";

export function ProjectsSheet() {
  const [projects, setProjects] = React.useState<
    Array<{
      id: string;
      name: string;
      updatedAt: Date;
    }>
  >([]);
  const router = useRouter();
  const { toast } = useToast();

  const loadProjects = React.useCallback(async () => {
    const result = await diagramRepository.findAll();
    if (result._tag === "success") {
      // Sort projects by updatedAt, most recent first
      const sortedProjects = result.value.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      );
      setProjects(sortedProjects);
    } else {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    }
  }, [toast]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" onClick={loadProjects}>
          <Folder className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open projects</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Projects</SheetTitle>
          <SheetDescription>
            List of all your infrastructure diagram projects
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No projects found. Create your first project by saving a
                diagram!
              </p>
            ) : (
              projects.map((project) => (
                <Button
                  key={project.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/${project.id}`)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{project.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Last updated: {formatDate(project.updatedAt)}
                    </span>
                  </div>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
