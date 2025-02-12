"use client";

import * as React from "react";
import { BotIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { LLMService } from "@/lib/services/llm-service";
import { LLMServiceError, LLMErrorCode } from "@/lib/errors/llm-errors";
import { DatabaseError } from "@/lib/db/contract";

const EXAMPLE_PROMPTS = [
  {
    title: "Web App with Database",
    prompt:
      "I need a web application with a load balancer, two application servers, and a database for storing user data.",
  },
  {
    title: "Microservices Architecture",
    prompt:
      "I need a microservices setup with an API gateway, three backend services, each with its own database, and a message queue for communication.",
  },
  {
    title: "Content Delivery",
    prompt:
      "I need a content delivery system with a CDN, origin servers, and a storage backend for static assets.",
  },
];

interface GenerateInfrastructureDialogProps {
  onInfrastructureGenerated: (yaml: string) => void;
}

export function GenerateInfrastructureDialog({
  onInfrastructureGenerated,
}: GenerateInfrastructureDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description of your infrastructure.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const yaml = await LLMService.generateInfrastructure(prompt);
      onInfrastructureGenerated(yaml);
      setOpen(false);
      toast({
        title: "Success",
        description: "Infrastructure generated successfully!",
      });
    } catch (error) {
      console.error(error);
      if (error instanceof DatabaseError) {
        toast({
          title: "Missing configuration",
          description:
            "Before you proceed, go to Settings and finish the configuration",
        });
      } else {
        if (error instanceof LLMServiceError) {
          if (error.code === LLMErrorCode.INVALID_API_KEY) {
            toast({
              title: "API Key Required",
              description:
                "Before you proceed, go to Settings and add your API Key",
            });
          } else {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full lg:w-auto">
          <BotIcon className="mr-2 h-4 w-4" />
          Quickstart
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Infrastructure</DialogTitle>
          <DialogDescription>
            Describe your infrastructure needs in natural language and
            we&apos;ll generate a <span className="font-bold">new</span> diagram
            for you. Try to include details about components, their connections,
            and any specific requirements.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Example Prompts:</label>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((example) => (
                <Button
                  key={example.title}
                  variant="secondary"
                  size="sm"
                  onClick={() => setPrompt(example.prompt)}
                  className="text-xs"
                >
                  {example.title}
                </Button>
              ))}
            </div>
          </div>
          <Textarea
            placeholder="Describe your infrastructure needs. For example: I need a web application with a load balancer, two application servers, and a database for storing user data. Include any specific requirements about scaling, security, or performance."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-32"
          />
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Infrastructure...
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
