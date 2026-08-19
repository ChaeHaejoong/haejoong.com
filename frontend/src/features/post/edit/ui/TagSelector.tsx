import { useTags } from "@/entities/tag/model/useTags";

interface TagSelectorProps {
  selectedTagIds: string[];
  onToggle: (tagId: string) => void;
}

export default function TagSelector({
  selectedTagIds,
  onToggle,
}: TagSelectorProps) {
  const { data: tags = [], isLoading } = useTags();

  if (isLoading) return null;
  if (!tags.length) return null;

  return (
    <section className="my-6 rounded-2xl border border-divider p-4 w-200">
      <h2 className="text-sm font-semibold text-title mb-3">태그 선택</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggle(tag.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                isSelected
                  ? "bg-primary text-white"
                  : "bg-bg-subtle text-subtle hover:bg-bg-primary"
              }`}
            >
              #{tag.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}
