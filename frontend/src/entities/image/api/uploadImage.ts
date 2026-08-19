import type { UploadImageResponse } from "@haejoong.com/shared";
import { api } from "@/shared/api";
import { useModalStore } from "@/shared/store/useModalStore";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const { data } = await api.post<UploadImageResponse>(
      "/images/upload",
      formData,
    );
    return data;
  } catch (error) {
    useModalStore.getState().openModal({
      message: "이미지 전송에 실패했습니다",
    });
  }
}
