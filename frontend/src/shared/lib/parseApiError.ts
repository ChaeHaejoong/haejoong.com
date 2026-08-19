import { isAxiosError } from "axios";

/**
 * Axios 에러 또는 일반 Error에서 사용자에게 보여줄 메시지를 추출합니다.
 * NestJS ZodValidationPipe는 400 에러 시 { errors: [{ message }] } 형태로 반환합니다.
 */
export function parseApiError(err: unknown, fallback: string): string {
  if (!isAxiosError(err)) {
    return err instanceof Error ? err.message : fallback;
  }

  const data = err.response?.data as
    | { errors?: { message: string }[]; message?: string }
    | undefined;

  if (data?.errors && data.errors.length > 0) {
    return data.errors.map((e) => e.message).join("\n");
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  return fallback;
}
