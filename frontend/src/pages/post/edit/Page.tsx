import ContentEditor from "@/features/post/edit/ui/ContentEditor";
import EditorNav from "@/features/post/edit/ui/EditorNav";
import MyImagesModal from "@/features/post/edit/ui/MyImagesModal";
import PreviewModal from "@/features/post/edit/ui/PreviewModal";
import TagSelector from "@/features/post/edit/ui/TagSelector";
import ThumbnailSelectorBar from "@/features/post/edit/ui/ThumbnailSelectorBar";
import TitleEditor from "@/features/post/edit/ui/TitleEditor";
import { usePostEditPage } from "./model/usePostEditPage";

// ref, 상태, 훅 오케스트레이션은 model/usePostEditPage로 위임하고
// Page는 렌더링 조합만 담당합니다.
export default function PostEditPage() {
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
  } = usePostEditPage();

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
