"use client";

import * as React from "react";
import { useReactFlow } from "reactflow";
import { useForm, useFieldArray } from "react-hook-form";
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
import { PlusIcon, TrashIcon } from "lucide-react";

const protocolSchema = z.object({
  protocols: z.array(
    z.object({
      name: z.string().min(1, "Protocol name is required"),
      port: z.coerce
        .number()
        .min(0, "Port must be >= 0")
        .max(65535, "Port must be <= 65535"),
    })
  ),
});

type ProtocolFormValues = z.infer<typeof protocolSchema>;

interface EdgeProtocolsDialogProps {
  edgeId: string;
  children: React.ReactNode;
}

export function EdgeProtocolsDialog({
  edgeId,
  children,
}: EdgeProtocolsDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { getEdge, setEdges } = useReactFlow();

  const edge = getEdge(edgeId);
  const protocols = edge?.data?.protocols || {};

  const form = useForm<ProtocolFormValues>({
    resolver: zodResolver(protocolSchema),
    defaultValues: {
      protocols: Object.entries(protocols).map(([name, port]) => ({
        name,
        port: Number(port),
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "protocols",
    control: form.control,
  });

  const onSubmit = (values: ProtocolFormValues) => {
    setEdges((edges) =>
      edges.map((e) => {
        if (e.id === edgeId) {
          const protocols = values.protocols.reduce(
            (acc, { name, port }) => ({
              ...acc,
              [name]: port,
            }),
            {} as Record<string, number>
          );
          return {
            ...e,
            data: {
              ...e.data,
              protocols,
            },
          };
        }
        return e;
      })
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Connection Protocols</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              {fields.map((field, index: number) => (
                <div key={field.id} className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`protocols.${index}.name`}
                    render={({ field: formField }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Protocol</FormLabel>
                        <FormControl>
                          <Input placeholder="tcp" {...formField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`protocols.${index}.port`}
                    render={({ field: formField }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Port</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="80"
                            {...formField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => append({ name: "", port: 0 })}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Protocol
            </Button>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
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
