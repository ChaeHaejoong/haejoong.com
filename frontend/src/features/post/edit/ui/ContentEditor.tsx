import { forwardRef, type ChangeEvent } from "react";

type ContentEditorProps = {
  content: string;
  onContentChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};

const ContentEditor = forwardRef<HTMLTextAreaElement, ContentEditorProps>(
  ({ content, onContentChange }, ref) => {
    return (
      <textarea
        ref={ref}
        className="w-full h-120 resize-none overflow-y-auto p-2 border-none focus:outline-none text-body"
        value={content}
        onChange={onContentChange}
        placeholder="content"
      />
    );
  },
);

export default ContentEditor;
