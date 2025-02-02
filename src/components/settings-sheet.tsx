"use client";

import * as React from "react";
import { Settings, Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  CloudProviderEnum,
  LLMModelEnum,
  settingsRepository,
  UserSettings,
} from "@/lib/db/models/settings";

const SETTINGS_ID = "user-settings";

const formSchema = z.object({
  llmModel: z.enum([
    LLMModelEnum.GPT_4,
    LLMModelEnum.GPT_3_5_TURBO,
    LLMModelEnum.CLAUDE_3_OPUS,
    LLMModelEnum.CLAUDE_3_SONNET,
  ]),
  apiKey: z.string().min(1, "API Key is required"),
  cloudProvider: z.enum([
    CloudProviderEnum.AWS,
    CloudProviderEnum.GCP,
    CloudProviderEnum.AZURE,
  ]),
});

export function SettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [showApiKey, setShowApiKey] = React.useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      llmModel: LLMModelEnum.GPT_4,
      apiKey: "",
      cloudProvider: CloudProviderEnum.AWS,
    },
  });

  // Load settings when sheet opens
  React.useEffect(() => {
    if (!open) return;

    async function loadSettings() {
      setIsInitialLoading(true);
      try {
        const result = await settingsRepository.findById(SETTINGS_ID);
        if (result._tag === "success" && result.value) {
          form.reset({
            llmModel: result.value.llmModel,
            apiKey: result.value.apiKey,
            cloudProvider: result.value.cloudProvider,
          });
        } else if (result._tag === "failure") {
          throw new Error(result.error.message);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setIsInitialLoading(false);
      }
    }

    loadSettings();
  }, [open, form, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const settings: UserSettings = {
        id: SETTINGS_ID,
        ...values,
        updatedAt: new Date(),
      };

      const result = await settingsRepository.findById(SETTINGS_ID);

      if (result._tag === "success" && result.value) {
        // Update existing settings
        await settingsRepository.update(SETTINGS_ID, settings);
      } else {
        // Create new settings
        await settingsRepository.create(settings);
      }

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Configure your preferences for the infrastructure diagram tool
          </SheetDescription>
        </SheetHeader>
        {isInitialLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 pt-6"
            >
              <FormField
                control={form.control}
                name="llmModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LLM Model</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={LLMModelEnum.GPT_4}>
                          GPT-4
                        </SelectItem>
                        <SelectItem value={LLMModelEnum.GPT_3_5_TURBO}>
                          GPT-3.5 Turbo
                        </SelectItem>
                        <SelectItem value={LLMModelEnum.CLAUDE_3_OPUS}>
                          Claude 3 Opus
                        </SelectItem>
                        <SelectItem value={LLMModelEnum.CLAUDE_3_SONNET}>
                          Claude 3 Sonnet
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select which LLM model to use for processing your
                      infrastructure text
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showApiKey ? "text" : "password"}
                          placeholder="Enter your API key"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowApiKey(!showApiKey)}
                        disabled={isLoading}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showApiKey ? "Hide API key" : "Show API key"}
                        </span>
                      </Button>
                    </div>
                    <FormDescription>
                      Your API key for the selected LLM model
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cloudProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cloud Provider</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a cloud provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={CloudProviderEnum.AWS}>
                          AWS
                        </SelectItem>
                        <SelectItem value={CloudProviderEnum.GCP}>
                          Google Cloud
                        </SelectItem>
                        <SelectItem value={CloudProviderEnum.AZURE}>
                          Azure
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Your preferred cloud provider for infrastructure diagrams
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}
