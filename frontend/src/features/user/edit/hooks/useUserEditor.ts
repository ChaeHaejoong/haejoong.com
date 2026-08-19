import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMe } from "@/entities/user/model/useMe";
import { uploadImage } from "@/entities/image/api/uploadImage";
import { updateUser } from "@/entities/user/api/updateUser";
import { login } from "@/features/auth/login/api/login";
import { useModalStore } from "@/shared/store/useModalStore";
import { getImageUrl } from "@/shared/lib/getImageUrl";
import { parseApiError } from "@/shared/lib/parseApiError";
import { updateUserSchema } from "@haejoong.com/shared";
import { toast } from "@/shared/store/useToastStore";

export function useUserEditor() {
  const { user, isAdmin } = useMe();
  const queryClient = useQueryClient();

  const [avatar, setAvatar] = useState<string | null>(null);
  const [localAvatarFile, setLocalAvatarFile] = useState<File | null>(null);
  const [avatarNeedsReset, setAvatarNeedsReset] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setNewNickname(user.nickname);
      setAvatar(getImageUrl(user.avatarUrl) ?? null);
      setLocalAvatarFile(null);
      setAvatarNeedsReset(false);
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!user || !file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);
    setLocalAvatarFile(file);
    setAvatarNeedsReset(false);
  };

  const handleResetAvatar = () => {
    if (!user) return;
    setAvatar("/imgs/icon.png");
    setLocalAvatarFile(null);
    setAvatarNeedsReset(true);
  };

  const handleNicknameChange = (value: string) => {
    setNewNickname(value);
  };

  const handlePasswordConfirm = async (passwordInput: string) => {
    if (!user) return;

    try {
      setIsSaving(true);

      await login({ userId: user.userId, password: passwordInput.trim() });

      // 닉네임 클라이언트 검증
      const nicknameCheck = updateUserSchema.shape.nickname.safeParse(
        newNickname.trim(),
      );
      if (!nicknameCheck.success) {
        toast.error(
          nicknameCheck.error.issues[0]?.message ?? "닉네임을 확인해 주세요",
        );
        return;
      }

      // avatarImageId 결정
      let avatarImageId: string | null = user.avatarImageId;
      if (avatarNeedsReset) {
        avatarImageId = null;
      } else if (localAvatarFile) {
        const uploaded = await uploadImage(localAvatarFile);
        if (!uploaded?.id) throw new Error("이미지 업로드에 실패했어요");
        avatarImageId = uploaded.id;
      }

      await updateUser(user.id, {
        nickname: newNickname.trim(),
        avatarImageId,
      });

      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("프로필을 성공적으로 수정했어요");

      setLocalAvatarFile(null);
      setAvatarNeedsReset(false);
    } catch (error) {
      toast.error(parseApiError(error, "수정 중 오류가 발생했어요"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClick = () => {
    if (!user) return;

    const trimmed = newNickname.trim();
    if (!trimmed) {
      toast.error("닉네임을 입력해 주세요");
      return;
    }

    const isNicknameChanged = trimmed !== user.nickname;
    const isAvatarChanged = localAvatarFile !== null || avatarNeedsReset;

    if (!isNicknameChanged && !isAvatarChanged) {
      toast.info("변경된 항목이 없어요");
      return;
    }

    useModalStore.getState().openPrompt({
      title: "비밀번호 인증",
      message: "정보 수정을 위해 비밀번호를 입력해 주세요",
      inputType: "password",
      onConfirm: (input) => {
        if (!input) {
          toast.error("비밀번호가 필요해요");
          return;
        }
        void handlePasswordConfirm(input);
      },
    });
  };

  return {
    user,
    isAdmin,
    avatar,
    newNickname,
    setNewNickname: handleNicknameChange,
    isSaving,
    handleAvatarChange,
    handleNicknameSave: handleSaveClick,
    handleResetAvatar,
  };
}
