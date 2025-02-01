interface CodeProps {
  children: string;
}

export function Code({ children }: CodeProps) {
  return (
    <pre className="p-4 rounded-lg bg-muted font-mono text-sm overflow-auto">
      <code>{children}</code>
    </pre>
  );
}
