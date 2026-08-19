import { getImageUrl } from "@/shared/lib/getImageUrl";

interface ThumbnailSelectorBarProps {
  thumbnail: string;
  onUploadClick: () => void;
  onOpenImageModal: () => void;
}

export default function ThumbnailSelectorBar({
  thumbnail,
  onUploadClick,
  onOpenImageModal,
}: ThumbnailSelectorBarProps) {
  return (
    <section className="my-6 rounded-2xl border border-divider p-4 w-200">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-title">썸네일 선택</h2>
          <p className="text-xs text-subtle mt-1">
            이미지가 많다면 이미지 보관함 모달에서 찾아 선택해 주세요.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onUploadClick}
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm cursor-pointer hover:opacity-90"
          >
            이미지 업로드
          </button>

          <button
            type="button"
            onClick={onOpenImageModal}
            className="px-4 py-2 rounded-xl border border-divider text-sm cursor-pointer hover:bg-bg-primary"
          >
            내 이미지 보관함
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-divider bg-bg-primary p-3">
        <p className="text-xs text-subtle mb-2">현재 선택된 썸네일</p>
        <div className="aspect-video overflow-hidden rounded-lg bg-bg-subtle">
          {thumbnail ? (
            <img
              src={getImageUrl(thumbnail) ?? thumbnail}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-subtle">
              아직 선택된 썸네일이 없어요
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
