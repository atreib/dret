"use client";

import * as React from "react";
import { Loader2, Settings } from "lucide-react";
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
    console.log("🎯 Starting infrastructure generation...");
    console.log("📝 Prompt:", prompt);

    if (!prompt.trim()) {
      console.log("❌ Empty prompt detected");
      toast({
        title: "Error",
        description: "Please enter a description of your infrastructure.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("🚀 Calling LLM service...");
      const yaml = await LLMService.generateInfrastructure(prompt);
      console.log("✅ LLM service returned successfully");
      console.log("📄 Generated YAML:", yaml);

      onInfrastructureGenerated(yaml);
      setOpen(false);
      toast({
        title: "Success",
        description: "Infrastructure generated successfully!",
      });
    } catch (error) {
      console.log("💥 Error occurred:", error);
      if (error instanceof LLMServiceError) {
        console.log("🔍 LLM Service Error:", {
          code: error.code,
          message: error.message,
          details: error.details,
        });

        if (error.code === LLMErrorCode.INVALID_API_KEY) {
          toast({
            title: "API Key Required",
            description: (
              <div className="flex flex-col gap-2">
                <p>{error.message}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOpen(false); // Close the generation dialog
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Open Settings
                </Button>
              </div>
            ),
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        console.log("🔍 Unknown Error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      console.log("🏁 Generation attempt completed");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Generate from Description</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Infrastructure</DialogTitle>
          <DialogDescription>
            Describe your infrastructure needs in natural language and
            we&apos;ll generate a diagram for you. Try to include details about
            components, their connections, and any specific requirements.
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
