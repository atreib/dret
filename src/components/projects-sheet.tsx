"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

interface EditProjectNameDialogProps {
  projectId: string;
  currentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

function EditProjectNameDialog({
  projectId,
  currentName,
  open,
  onOpenChange,
  onSaved,
}: EditProjectNameDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentName,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await diagramRepository.update(projectId, {
        id: projectId,
        name: values.name,
        content: "", // We don't need to update the content
        updatedAt: new Date(),
        createdAt: new Date(), // This will be ignored by the update
      });

      if (result._tag === "failure") {
        throw new Error(result.error.message);
      }

      toast({
        title: "Success",
        description: "Project name updated successfully",
      });
      onOpenChange(false);
      onSaved();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update project name",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project Name</DialogTitle>
          <DialogDescription>
            Change the name of your infrastructure diagram project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteProjectDialogProps {
  projectId: string;
  projectName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

function DeleteProjectDialog({
  projectId,
  projectName,
  open,
  onOpenChange,
  onDeleted,
}: DeleteProjectDialogProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const result = await diagramRepository.delete(projectId);

      if (result._tag === "failure") {
        throw new Error(result.error.message);
      }

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      onOpenChange(false);
      onDeleted();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{projectName}&rdquo;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ProjectsSheetProps {
  children: React.ReactNode;
}

export function ProjectsSheet({ children }: ProjectsSheetProps) {
  const [projects, setProjects] = React.useState<
    Array<{
      id: string;
      name: string;
      updatedAt: Date;
    }>
  >([]);
  const [editingProject, setEditingProject] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deletingProject, setDeletingProject] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
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
      <SheetTrigger asChild onClick={loadProjects}>
        {children}
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
                <div key={project.id} className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 justify-start"
                    onClick={() => router.push(`/${project.id}`)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Last updated: {formatDate(project.updatedAt)}
                      </span>
                    </div>
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setEditingProject({
                          id: project.id,
                          name: project.name,
                        })
                      }
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit project name</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setDeletingProject({
                          id: project.id,
                          name: project.name,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete project</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
      {editingProject && (
        <EditProjectNameDialog
          projectId={editingProject.id}
          currentName={editingProject.name}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingProject(null);
          }}
          onSaved={loadProjects}
        />
      )}
      {deletingProject && (
        <DeleteProjectDialog
          projectId={deletingProject.id}
          projectName={deletingProject.name}
          open={true}
          onOpenChange={(open) => {
            if (!open) setDeletingProject(null);
          }}
          onDeleted={loadProjects}
        />
      )}
    </Sheet>
  );
}
