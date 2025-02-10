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
import { Settings } from "lucide-react";
import { useState } from "react";

interface NetworkSpecsDialogProps {
  nodeId: string;
}

const formSchema = z.object({
  label: z.string().min(1, { message: "Label is required" }),
  cidr: z
    .string()
    .min(1, { message: "CIDR is required" })
    .regex(/^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/, {
      message: "Invalid CIDR format (e.g. 192.168.1.0/24)",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export function NetworkSpecsDialog({ nodeId }: NetworkSpecsDialogProps) {
  const { getNode, setNodes } = useReactFlow();
  const [open, setOpen] = useState(false);

  const node = getNode(nodeId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: node?.data.label || "",
      cidr: node?.data.cidr || "",
    },
  });

  const onSubmit = (values: FormValues) => {
    setNodes((nodes) =>
      nodes.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              label: values.label,
              cidr: values.cidr,
            },
          };
        }
        return n;
      })
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 z-50 pointer-events-auto"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Network</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Network Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cidr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CIDR</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="192.168.1.0/24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
