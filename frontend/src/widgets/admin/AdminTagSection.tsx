import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useTagManagement } from "@/features/tag/manage/hooks/useTagManagement";

export default function AdminTagSection() {
  const [input, setInput] = useState("");
  const { tags, isLoading, createTag, deleteTag, isCreating, isDeleting } =
    useTagManagement();

  const handleCreate = () => {
    const name = input.trim();
    if (!name) return;
    createTag(name, { onSuccess: () => setInput("") });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreate();
  };

  return (
    <section className="rounded-2xl border border-divider p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-title">태그 관리</h2>
        </div>
        <div className="rounded-lg border border-divider bg-bg px-3 py-1.5 text-xs text-subtle">
          {tags.length}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="새 태그 이름"
          maxLength={30}
          className="flex-1 rounded-xl border border-divider bg-bg px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={handleCreate}
          disabled={isCreating || !input.trim()}
          className="px-4 py-2 rounded-xl bg-primary text-white text-sm cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          추가
        </button>
      </div>

      {isLoading ? (
        <div className="py-6 text-center text-sm text-subtle">불러오는 중</div>
      ) : tags.length === 0 ? (
        <div className="py-6 text-center text-sm text-subtle">
          등록된 태그가 없습니다.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-1.5 rounded-full border border-divider px-3 py-1 text-sm"
            >
              <span className="text-title">#{tag.name}</span>
              <button
                onClick={() => deleteTag(tag.id)}
                disabled={isDeleting}
                className="text-subtle hover:text-red-500 transition-colors cursor-pointer"
                aria-label={`${tag.name} 태그 삭제`}
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
