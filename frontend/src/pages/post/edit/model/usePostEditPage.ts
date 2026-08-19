import { useMarkdownEditor } from "@/features/post/edit/hooks/useMarkdownActions";
import usePostEditor from "@/features/post/edit/hooks/usePostState";
import { insertAroundSelection } from "@/features/post/edit/lib/insertAroundSelection";
import { useMyImages } from "@/entities/image/model/useMyImages";
import { getImageUrl } from "@/shared/lib/getImageUrl";
import { useRef, useState } from "react";

// PostEditPage의 ref, 모달 상태, 세 훅 오케스트레이션을 model로 분리합니다.
// Page 컴포넌트는 렌더링 조합만 담당합니다.
export function usePostEditPage() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [isMyImagesModalOpen, setIsMyImagesModalOpen] = useState(false);
  const [myImagesModalMode, setMyImagesModalMode] = useState<
    "thumbnail" | "content"
  >("thumbnail");

  const { data: myImages = [], isLoading: isLoadingImages } = useMyImages();

  const postEditor = usePostEditor();

  const markdownEditor = useMarkdownEditor(textareaRef, imageInputRef);

  const openMyImagesModal = () => {
    setMyImagesModalMode("thumbnail");
    setIsMyImagesModalOpen(true);
  };

  const openMyImagesModalForContent = () => {
    setMyImagesModalMode("content");
    setIsMyImagesModalOpen(true);
  };

  const handleInsertImageToContent = (url: string, filename: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const imageUrl = getImageUrl(url) ?? url;
    insertAroundSelection(el, `![${filename}](${imageUrl})`, "");
  };

  return {
    textareaRef,
    imageInputRef,
    thumbnailInputRef,
    isMyImagesModalOpen,
    myImagesModalMode,
    openMyImagesModal,
    openMyImagesModalForContent,
    closeMyImagesModal: () => setIsMyImagesModalOpen(false),
    handleInsertImageToContent,
    myImages,
    isLoadingImages,
    ...postEditor,
    ...markdownEditor,
  };
}
