import type { RefObject } from "react";
import { insertAroundSelection } from "../lib/insertAroundSelection";
import { uploadImage } from "@/entities/image/api/uploadImage";
import type React from "react";
import { getImageUrl } from "@/shared/lib/getImageUrl";

type TextareaRef = RefObject<HTMLTextAreaElement | null>;
type ImageInputRef = RefObject<HTMLInputElement | null>;

export function useMarkdownEditor(
  textareaRef: TextareaRef,
  imageInpuRef: ImageInputRef,
) {
  const getBodyEditor = () => textareaRef.current;

  const handleBold = () => {
    const el = getBodyEditor();
    if (!el) return;

    insertAroundSelection(el, "**", "**");
  };

  const handleItalic = () => {
    const el = getBodyEditor();
    if (!el) return;

    insertAroundSelection(el, "*", "*");
  };

  const handleHeading = () => {
    const el = getBodyEditor();
    if (!el) return;

    insertAroundSelection(el, "# ", "");
  };

  const handleList = () => {
    const el = getBodyEditor();
    if (!el) return;

    insertAroundSelection(el, "- ", "");
  };

  const handleQuote = () => {
    const el = getBodyEditor();
    if (!el) return;

    insertAroundSelection(el, "> ", "");
  };

  const handleCode = () => {
    const el = getBodyEditor();
    if (!el) return;

    insertAroundSelection(el, "`", "`");
  };

  const handleCodeBlock = () => {
    const el = getBodyEditor();
    if (!el) return;

    insertAroundSelection(el, "\n```typescript\n", "\n```\n");
  };

  const handleLink = () => {
    const el = getBodyEditor();
    if (!el) return;

    insertAroundSelection(el, "[", "](url)");
  };

  const handleDivider = () => {
    const el = getBodyEditor();
    if (!el) return;

    insertAroundSelection(el, "\n---\n", "");
  };

  const handleImageClick = () => {
    const el = getBodyEditor();
    if (!el) return;

    imageInpuRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = getBodyEditor();
    if (!el) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const data = await uploadImage(file);
    console.log(data);

    insertAroundSelection(
      el,
      `![${data?.filename}](${getImageUrl(data?.url)})`,
      "",
    );

    e.target.value = "";
  };

  return {
    handleBold,
    handleItalic,
    handleHeading,
    handleList,
    handleQuote,
    handleCode,
    handleCodeBlock,
    handleLink,
    handleImageClick,
    handleImageChange,
    handleDivider,
  };
}
