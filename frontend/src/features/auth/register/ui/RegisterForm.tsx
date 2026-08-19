import Loading from "@/app/ui/loading/Loading";
import { useRegisterForm } from "../hooks/useRegisterForm";

export default function RegisterForm() {
  const { values, errors, loading, handleChange, handleSubmit } =
    useRegisterForm();

  return (
    <>
      {loading && <Loading />}

      <form
        className="w-full flex flex-col gap-4 my-10"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-semibold text-title mb-2">회원가입</h1>
        <p className="text-sm text-text-secondary mb-4">
          계정을 만들면 댓글을 남길 수 있어요.
        </p>

        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={values.nickname}
          onChange={handleChange}
          className="w-full border border-divider rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <input
          type="text"
          name="userId"
          placeholder="아이디"
          value={values.userId}
          onChange={handleChange}
          className="w-full border border-divider rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={values.password}
          onChange={handleChange}
          className="w-full border border-divider rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <input
          type="password"
          name="passwordConfirm"
          placeholder="비밀번호 확인"
          value={values.passwordConfirm}
          onChange={handleChange}
          className="w-full border border-divider rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {errors?.map((err, i) => (
          <p key={i} className="text-red-500 text-sm">
            {err}
          </p>
        ))}

        <button
          type="submit"
          className="w-full bg-primary text-white rounded-lg py-2 font-medium hover:opacity-90 transition mt-2 disabled:opacity-50"
        >
          회원가입
        </button>
      </form>
    </>
  );
}
