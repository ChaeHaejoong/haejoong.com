import { useMemo, useState } from "react";
import type { ImageSummaryDto } from "@haejoong.com/shared";
import ModalOverlay from "@/shared/ui/overlay/ModalOverlay";
import { getImageUrl } from "@/shared/lib/getImageUrl";

interface MyImagesModalProps {
  images: ImageSummaryDto[];
  selectedThumbnail: string;
  isLoadingImages?: boolean;
  mode?: "thumbnail" | "content";
  onSelectThumbnail: (url: string) => void;
  onInsertToContent?: (url: string, filename: string) => void;
  onClose: () => void;
}

export default function MyImagesModal({
  images,
  selectedThumbnail,
  isLoadingImages = false,
  mode = "thumbnail",
  onSelectThumbnail,
  onInsertToContent,
  onClose,
}: MyImagesModalProps) {
  const [search, setSearch] = useState("");

  const filteredImages = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return images;

    return images.filter((image) =>
      image.filename.toLowerCase().includes(keyword),
    );
  }, [images, search]);

  return (
    <ModalOverlay modalClose={onClose}>
      <div className="bg-bg rounded-2xl border border-divider w-[min(1100px,92vw)] h-[80vh] p-5 flex flex-col">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-title">
              내 이미지 보관함
            </h2>
            <p className="text-sm text-subtle mt-1">
              {mode === "content"
                ? "본문에 삽입할 이미지를 선택하세요."
                : "썸네일로 쓸 이미지를 선택하세요."}
            </p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="파일명으로 검색"
            className="h-10 w-64 max-w-full rounded-lg border border-divider bg-bg-primary px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {isLoadingImages ? (
            <div className="text-sm text-subtle py-16 text-center">
              이미지를 불러오는 중...
            </div>
          ) : !filteredImages.length ? (
            <div className="text-sm text-subtle py-16 text-center">
              검색 결과가 없어요.
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-3 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2">
              {filteredImages.map((image) => {
                const imageUrl = getImageUrl(image.url) ?? image.url;
                const isSelected = selectedThumbnail === image.url;

                return (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => {
                      if (mode === "content") {
                        onInsertToContent?.(image.url, image.filename);
                      } else {
                        onSelectThumbnail(image.url);
                      }
                      onClose();
                    }}
                    className={`group overflow-hidden rounded-xl border bg-bg-primary text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-divider hover:border-primary/50"
                    }`}
                    title={image.filename}
                  >
                    <div className="aspect-video bg-bg-subtle overflow-hidden">
                      <img
                        src={imageUrl}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="px-2 py-2 text-xs text-subtle truncate">
                      {image.filename}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
}
