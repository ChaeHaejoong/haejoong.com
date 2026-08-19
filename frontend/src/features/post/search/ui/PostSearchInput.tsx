import { FiSearch } from "react-icons/fi";

interface PostSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PostSearchInput({
  value,
  onChange,
}: PostSearchInputProps) {
  return (
    <div className="relative w-full my-4 md:my-7">
      <FiSearch
        className="absolute left-3 top-1/2 -translate-y-3/5 text-muted"
        size={18}
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="보고싶은 게시물의 키워드를 검색하세요"
        className="
          w-full
          pl-10
          pr-4
          py-2.5
          border
          border-divider
          rounded-lg
          text-body
          placeholder:text-subtle
          focus:outline-none
          focus:ring-1
          focus:ring-primary
          focus:border-primary
        "
      />
    </div>
  );
}
