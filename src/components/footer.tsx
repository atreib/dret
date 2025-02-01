import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="flex h-14 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Built with Next.js, Shadcn/ui, and React Flow
        </p>
        <Separator orientation="vertical" className="mx-4 h-4" />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Cloud Text2Diagram
        </p>
      </div>
    </footer>
  );
}
