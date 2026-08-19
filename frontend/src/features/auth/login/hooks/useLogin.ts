// useLogin.ts
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { login } from "../api/login";
import { loginSchema } from "@haejoong.com/shared";
import { toast } from "@/shared/store/useToastStore";

type LoginFormState = {
  userId: string;
  password: string;
};

export default function useLogin(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<LoginFormState>({
    userId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 클라이언트 검증
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "입력 값을 확인해 주세요");
      return;
    }

    setLoading(true);
    try {
      await login(form);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("로그인 성공!");
      onSuccess?.();
    } catch {
      toast.error("아이디 또는 비밀번호가 올바르지 않아요");
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, onChange, onSubmit };
}
