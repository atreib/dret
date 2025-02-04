"use client";

import { useReactFlow } from "reactflow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Settings, TrashIcon } from "lucide-react";
import { useState } from "react";

interface NodeSpecsDialogProps {
  nodeId: string;
}

// Simple schema for an array of specs
const formSchema = z.object({
  specs: z.array(
    z.object({
      key: z.string().min(1, { message: "Required" }),
      value: z.string().min(1, { message: "Required" }),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

export function NodeSpecsDialog({ nodeId }: NodeSpecsDialogProps) {
  const { getNode, setNodes } = useReactFlow();
  const [open, setOpen] = useState(false);

  const node = getNode(nodeId);

  // Transform node data into array of key-value pairs
  const getInitialValues = () => {
    if (!node) return { specs: [] };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label: _, ...specs } = node.data;
    return {
      specs: Object.entries(specs).map(([key, value]) => ({
        key,
        value: String(value),
      })),
    };
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialValues(),
  });

  const onSubmit = (values: FormValues) => {
    // Get the original keys from node data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label: _, ...originalSpecs } = node?.data || {};
    const originalKeys = new Set(Object.keys(originalSpecs));

    // Get the new keys from form values
    const newKeys = new Set(values.specs.map((spec) => spec.key));

    // Find keys that were removed
    const removedKeys = [...originalKeys].filter((key) => !newKeys.has(key));

    // Transform array back into record
    const newSpecs = values.specs.reduce(
      (acc, { key, value }) => ({ ...acc, [key]: value }),
      {}
    );

    setNodes((nodes) =>
      nodes.map((n) => {
        if (n.id === nodeId) {
          // Start with current data
          const newData = { ...n.data };

          // Remove deleted keys
          removedKeys.forEach((key) => {
            delete newData[key];
          });

          // Add/update new values
          return {
            ...n,
            data: {
              ...newData,
              ...newSpecs,
            },
          };
        }
        return n;
      })
    );
    setOpen(false);
  };

  const addSpec = () => {
    const currentSpecs = form.getValues("specs");
    form.setValue("specs", [...currentSpecs, { key: "", value: "" }], {
      shouldDirty: true,
    });
  };

  const removeSpec = (index: number) => {
    const currentSpecs = form.getValues("specs");
    const newSpecs = currentSpecs.filter((_, i) => i !== index);
    form.setValue("specs", newSpecs, {
      shouldDirty: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Node Specifications</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {form.watch("specs").map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="grid flex-1 gap-2">
                  <FormField
                    control={form.control}
                    name={`specs.${index}.key`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Key</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`specs.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Value</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="mt-6"
                  onClick={() => removeSpec(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSpec}>
              Add Specification
            </Button>
            <div className="flex justify-end gap-2">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
