import MarkdownRenderer from "@/shared/ui/markdown/MarkdownRenderer";
import ModalOverlay from "@/shared/ui/overlay/ModalOverlay";

type PreviewModal = {
  content: string;
  onClose: () => void;
};

export default function PreviewModal({ content, onClose }: PreviewModal) {
  return (
    <ModalOverlay modalClose={onClose}>
      <div className="bg-bg rounded-2xl p-4 h-[80vh] w-4xl overflow-y-scroll no-scrollbar">
        <MarkdownRenderer content={content} />
      </div>
    </ModalOverlay>
  );
}
