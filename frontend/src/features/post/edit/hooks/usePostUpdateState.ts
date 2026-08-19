import { uploadImage } from "@/entities/image/api/uploadImage";
import { useModalStore } from "@/shared/store/useModalStore";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { updatePost } from "../api/updatePost";
import { createPostSchema } from "@haejoong.com/shared";
import { parseApiError } from "@/shared/lib/parseApiError";
import { toast } from "@/shared/store/useToastStore";

interface InitialPostValues {
  postId: string;
  title: string;
  content: string;
  thumbnail: string;
  tagIds: string[];
}

export default function usePostUpdateEditor({
  postId,
  title: initialTitle,
  content: initialContent,
  thumbnail: initialThumbnail,
  tagIds: initialTagIds,
}: InitialPostValues) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [thumbnail, setThumbnail] = useState(initialThumbnail);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTagIds);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const openModal = useModalStore((state) => state.openModal);

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await uploadImage(file);
    if (!data?.url) return;

    const markdown = `\n![](${data.url})\n`;
    setContent((prev) => prev + markdown);
  };

  const onThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await uploadImage(file);
    if (!data?.url) return;

    setThumbnail(data.url);
  };

  const onThumbnailSelect = (url: string) => {
    setThumbnail(url);
  };

  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);

  const validatePost = () => {
    const result = createPostSchema.safeParse({
      title: title.trim(),
      content: content.trim(),
      thumbnail: thumbnail.trim(),
    });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "입력 값을 확인해 주세요");
      return false;
    }
    return true;
  };

  const handleSave = async (published: boolean) => {
    if (isSaving || !validatePost()) return;

    try {
      setIsSaving(true);

      await updatePost(postId, {
        title: title.trim(),
        content: content.trim(),
        thumbnail: thumbnail.trim(),
        published,
        tagIds: selectedTagIds,
      });

      if (published) {
        openModal({
          title: "수정 완료",
          message:
            "게시글이 수정되었습니다.\n확인을 누르면 어드민으로 돌아갑니다.",
          onConfirm: () => navigate("/admin"),
        });
        return;
      }

      toast.success("임시저장이 완료되었어요");
      navigate("/admin");
    } catch (error) {
      toast.error(
        parseApiError(
          error,
          published ? "게시글 수정에 실패했어요" : "임시저장에 실패했어요",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const draftPost = async () => {
    await handleSave(false);
  };

  const submitPost = async () => {
    await handleSave(true);
  };

  return {
    title,
    content,
    thumbnail,
    selectedTagIds,
    handleTagToggle,
    isSaving,
    onTitleChange,
    onContentChange,
    onImageChange,
    onThumbnailChange,
    onThumbnailSelect,
    isPreviewOpen,
    openPreview,
    closePreview,
    draftPost,
    submitPost,
  };
}
