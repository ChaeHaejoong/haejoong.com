import ContentEditor from "@/features/post/edit/ui/ContentEditor";
import EditorNav from "@/features/post/edit/ui/EditorNav";
import MyImagesModal from "@/features/post/edit/ui/MyImagesModal";
import PreviewModal from "@/features/post/edit/ui/PreviewModal";
import TagSelector from "@/features/post/edit/ui/TagSelector";
import ThumbnailSelectorBar from "@/features/post/edit/ui/ThumbnailSelectorBar";
import TitleEditor from "@/features/post/edit/ui/TitleEditor";
import { usePostUpdatePage } from "./model/usePostUpdatePage";
import { useLocation, Navigate } from "react-router-dom";
import type { PostResponseDto } from "@haejoong.com/shared";

export default function PostUpdatePage() {
  const location = useLocation();
  const post = location.state as PostResponseDto | null;

  if (!post) {
    return <Navigate to="/admin" replace />;
  }

  return <PostUpdateEditor post={post} />;
}

function PostUpdateEditor({ post }: { post: PostResponseDto }) {
  const {
    textareaRef,
    imageInputRef,
    thumbnailInputRef,
    isMyImagesModalOpen,
    myImagesModalMode,
    openMyImagesModal,
    openMyImagesModalForContent,
    closeMyImagesModal,
    handleInsertImageToContent,
    myImages,
    isLoadingImages,
    title,
    content,
    thumbnail,
    selectedTagIds,
    handleTagToggle,
    isSaving,
    onTitleChange,
    onContentChange,
    onThumbnailChange,
    onThumbnailSelect,
    isPreviewOpen,
    openPreview,
    closePreview,
    draftPost,
    submitPost,
    handleBold,
    handleCode,
    handleCodeBlock,
    handleDivider,
    handleHeading,
    handleItalic,
    handleLink,
    handleList,
    handleQuote,
    handleImageClick,
    handleImageChange,
  } = usePostUpdatePage(post);

  return (
    <>
      {isPreviewOpen && (
        <PreviewModal content={content} onClose={closePreview} />
      )}

      {isMyImagesModalOpen && (
        <MyImagesModal
          images={myImages}
          selectedThumbnail={thumbnail}
          isLoadingImages={isLoadingImages}
          mode={myImagesModalMode}
          onSelectThumbnail={onThumbnailSelect}
          onInsertToContent={handleInsertImageToContent}
          onClose={closeMyImagesModal}
        />
      )}

      <TitleEditor title={title} onTitleChange={onTitleChange} />

      <ThumbnailSelectorBar
        thumbnail={thumbnail}
        onUploadClick={() => thumbnailInputRef.current?.click()}
        onOpenImageModal={openMyImagesModal}
      />

      <TagSelector selectedTagIds={selectedTagIds} onToggle={handleTagToggle} />

      <ContentEditor
        ref={textareaRef}
        content={content}
        onContentChange={onContentChange}
      />

      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageChange}
        hidden
      />

      <input
        type="file"
        accept="image/*"
        ref={thumbnailInputRef}
        onChange={onThumbnailChange}
        hidden
      />

      <EditorNav
        onBold={handleBold}
        onItalic={handleItalic}
        onHeading={handleHeading}
        onCode={handleCode}
        onCodeBlock={handleCodeBlock}
        onList={handleList}
        onQuote={handleQuote}
        onDivider={handleDivider}
        onLink={handleLink}
        onPreviewClick={openPreview}
        onImage={handleImageClick}
        onMyImages={openMyImagesModalForContent}
        onDraftSave={draftPost}
        submitPost={submitPost}
        isSaving={isSaving}
      />
    </>
  );
}
