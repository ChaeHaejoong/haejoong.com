import { useMarkdownEditor } from "@/features/post/edit/hooks/useMarkdownActions";
import usePostUpdateEditor from "@/features/post/edit/hooks/usePostUpdateState";
import { insertAroundSelection } from "@/features/post/edit/lib/insertAroundSelection";
import { useMyImages } from "@/entities/image/model/useMyImages";
import { getImageUrl } from "@/shared/lib/getImageUrl";
import { useRef, useState } from "react";
import type { PostResponseDto } from "@haejoong.com/shared";

export function usePostUpdatePage(post: PostResponseDto) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [isMyImagesModalOpen, setIsMyImagesModalOpen] = useState(false);
  const [myImagesModalMode, setMyImagesModalMode] = useState<
    "thumbnail" | "content"
  >("thumbnail");

  const { data: myImages = [], isLoading: isLoadingImages } = useMyImages();

  const postEditor = usePostUpdateEditor({
    postId: post.id,
    title: post.title,
    content: post.content,
    thumbnail: post.thumbnail,
    tagIds: post.tags?.map((t) => t.id) ?? [],
  });

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
