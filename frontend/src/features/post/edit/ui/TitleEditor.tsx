import type { ChangeEvent } from "react";

type TitleEditorProps = {
  title: string;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function TitleEditor({
  title,
  onTitleChange,
}: TitleEditorProps) {
  return (
    <input
      className="w-full p-2 h-15 mt-5 text-3xl border-b border-divider focus:outline-none text-title"
      value={title}
      onChange={onTitleChange}
      placeholder="title"
    ></input>
  );
}
