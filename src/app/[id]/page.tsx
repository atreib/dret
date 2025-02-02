import { DiagramEditor } from "@/components/diagram-editor";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectPage({ params }: Props) {
  const projectId = (await params).id;

  return <DiagramEditor projectId={projectId} />;
}
