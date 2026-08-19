import type { TagDto } from "@haejoong.com/shared";

interface TagFilterBarProps {
  tags: TagDto[];
  selectedTagId: string | null;
  onSelect: (tagId: string | null) => void;
}

export default function TagFilterBar({
  tags,
  selectedTagId,
  onSelect,
}: TagFilterBarProps) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 py-4">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
          !selectedTagId
            ? "bg-primary border-primary text-white shadow-sm"
            : "bg-transparent border-divider text-subtle hover:border-primary hover:text-primary"
        }`}
      >
        전체
      </button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onSelect(tag.id)}
          className={`shrink-0 px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
            selectedTagId === tag.id
              ? "bg-primary border-primary text-white shadow-sm"
              : "bg-transparent border-divider text-subtle hover:border-primary hover:text-primary"
          }`}
        >
          #{tag.name}
        </button>
      ))}
    </div>
  );
}
