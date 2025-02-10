"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { diagramRepository } from "@/lib/db/models/diagram";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

interface SaveDiagramDialogProps {
  content: string;
  projectId?: string;
  projectName?: string;
  onSaved: (content: string) => void;
}

export function SaveDiagramDialog({
  content,
  projectId,
  projectName,
  onSaved,
}: SaveDiagramDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: projectName || "",
    },
  });

  const handleUpdate = async () => {
    if (!projectId || !projectName) return;

    try {
      const result = await diagramRepository.update(projectId, {
        id: projectId,
        name: projectName,
        content,
        updatedAt: new Date(),
        createdAt: new Date(), // This will be ignored by the update
      });

      if (result._tag === "failure") {
        throw new Error(result.error.message);
      }

      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      onSaved(content);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Create new project
      const newId = crypto.randomUUID();
      const result = await diagramRepository.create({
        id: newId,
        name: values.name,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (result._tag === "failure") {
        throw new Error(result.error.message);
      }

      // Redirect to the project page
      router.push(`/${newId}`);
      setOpen(false);
      onSaved(content);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save project",
        variant: "destructive",
      });
    }
  };

  if (projectId) {
    return (
      <Button onClick={handleUpdate}>
        <SaveIcon className="h-4 w-4 mr-2" />
        Save
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full lg:w-auto">
          <SaveIcon className="h-4 w-4 mr-2" />
          Save
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Project</DialogTitle>
          <DialogDescription>
            Give your infrastructure diagram project a name.
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
                    <Input placeholder="My Infrastructure Project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Project</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
