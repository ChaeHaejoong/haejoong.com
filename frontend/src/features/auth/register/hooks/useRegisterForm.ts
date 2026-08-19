import { useState } from "react";
import { register } from "../api/register";
import { useNavigate } from "react-router-dom";
import { registerSchema } from "@haejoong.com/shared";
import { parseApiError } from "@/shared/lib/parseApiError";
import { useModalStore } from "@/shared/store/useModalStore";
import { useLoginModalStore } from "@/features/auth/login/store/useLoginModalStore";

export interface RegisterFormValues {
  nickname: string;
  userId: string;
  password: string;
  passwordConfirm: string;
}

export function useRegisterForm() {
  const [errors, setErrors] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<RegisterFormValues>({
    nickname: "",
    userId: "",
    password: "",
    passwordConfirm: "",
  });
  const navigate = useNavigate();
  const openModal = useModalStore((state) => state.openModal);
  const openLoginModal = useLoginModalStore((state) => state.open);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);

    if (values.password !== values.passwordConfirm) {
      setErrors(["비밀번호가 일치하지 않아요"]);
      return;
    }

    // 클라이언트 검증
    const result = registerSchema.safeParse({
      nickname: values.nickname,
      userId: values.userId,
      password: values.password,
    });
    if (!result.success) {
      setErrors(result.error.issues.map((e) => e.message));
      return;
    }

    setLoading(true);
    try {
      await register({
        nickname: values.nickname,
        userId: values.userId,
        password: values.password,
      });
      navigate("/");
      openModal({
        title: "회원가입 성공!",
        message: "바로 로그인할까요?",
        onConfirm: () => openLoginModal(),
      });
    } catch (err) {
      setErrors([parseApiError(err, "회원가입에 실패했어요")]);
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
  };
}
