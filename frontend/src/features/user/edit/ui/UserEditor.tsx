import { useRef } from "react";
import { useUserEditor } from "../hooks/useUserEditor";
import OrangeButton from "@/shared/ui/button/OrangeButton";
import { getImageUrl } from "@/shared/lib/getImageUrl";

export default function UserEditor() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const {
    avatar,
    newNickname,
    setNewNickname,
    isSaving,
    handleAvatarChange,
    handleNicknameSave,
    handleResetAvatar,
  } = useUserEditor();

  return (
    <div className="grid gap-8">
      <div className="flex flex-col items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />

        <button
          type="button"
          onClick={handleAvatarClick}
          className="group relative overflow-hidden rounded-full"
          aria-label="아바타 이미지 변경"
        >
          <img
            src={getImageUrl(avatar) ?? "/imgs/icon.png"}
            alt="아바타"
            className="h-28 w-28 rounded-full border border-divider object-cover md:h-32 md:w-32"
          />
        </button>

        <p className="mt-4 text-center text-sm font-medium text-body">
          프로필 이미지
        </p>
        <button
          type="button"
          onClick={handleResetAvatar}
          className="mt-1 text-xs text-subtle transition-colors hover:text-title"
        >
          기본 이미지로 변경
        </button>
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <div className="space-y-2.5">
          <label className="text-xs font-semibold tracking-wide text-subtle">
            닉네임
          </label>

          <input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            placeholder="새 닉네임 입력"
            className="mt-2 w-full border-b border-divider bg-transparent py-2.5 text-title outline-none transition-colors focus:border-primary"
          />

          <p className="text-xs text-subtle">
            다른 사용자에게 표시될 이름이에요
          </p>
        </div>

        <div className="flex justify-end">
          <OrangeButton
            onClick={handleNicknameSave}
            disabled={isSaving}
            className="h-11 px-5"
          >
            {isSaving ? "저장 중..." : "저장"}
          </OrangeButton>
        </div>
      </div>
    </div>
  );
}
