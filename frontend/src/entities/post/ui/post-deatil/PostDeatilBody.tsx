import MarkdownRenderer from "@/shared/ui/markdown/MarkdownRenderer";

type BodyProps = {
  content: string;
};

export default function PostDetailBody({ content }: BodyProps) {
  return (
    <div className="mb-30">
      <MarkdownRenderer content={content} />
    </div>
  );
}
