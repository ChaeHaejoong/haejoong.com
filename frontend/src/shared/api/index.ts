import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

let refreshRequestPromise: Promise<string> | null = null;

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const getErrorMessage = (error: unknown): string => {
  if (!(error instanceof AxiosError)) {
    return "";
  }

  const data = error.response?.data as { message?: string } | undefined;
  return typeof data?.message === "string" ? data.message : "";
};

const isRetryableRefreshRaceError = (error: unknown): boolean => {
  if (!(error instanceof AxiosError) || error.response?.status !== 401) {
    return false;
  }

  return getErrorMessage(error).includes("이미 사용된 토큰");
};

const isTerminalRefreshError = (error: unknown): boolean => {
  if (!(error instanceof AxiosError) || error.response?.status !== 401) {
    return false;
  }

  const message = getErrorMessage(error);
  return (
    message.includes("만료") ||
    message.includes("유효하지 않은 세션") ||
    message.includes("유효하지 않은 토큰")
  );
};

export async function refreshAccessToken(): Promise<string> {
  if (refreshRequestPromise) {
    return refreshRequestPromise;
  }

  refreshRequestPromise = (async () => {
    try {
      const { data } = await api.post<{ accessToken: string }>("/auth/refresh");
      return data.accessToken;
    } catch (error) {
      if (isRetryableRefreshRaceError(error)) {
        await wait(250);
        const { data } = await api.post<{ accessToken: string }>(
          "/auth/refresh",
        );
        return data.accessToken;
      }

      throw error;
    } finally {
      refreshRequestPromise = null;
    }
  })();

  return refreshRequestPromise;
}

// --- 대기열 관리 변수 ---
let isRefreshing = false;
type RefreshSubscriber = {
  onSuccess: (token: string) => void;
  onError: (error: unknown) => void;
};

let refreshSubscribers: RefreshSubscriber[] = [];

// 갱신 성공 시 대기 중인 요청들에 새 토큰 전달
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(({ onSuccess }) => onSuccess(token));
  refreshSubscribers = [];
};

// 갱신 실패 시 대기 중인 모든 요청을 에러 처리
const onRefreshFailed = (error: unknown) => {
  refreshSubscribers.forEach(({ onError }) => onError(error));
  refreshSubscribers = [];
};

// --- 인터셉터 설정 ---

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러이고, 리프레시 요청이 아니며, 아직 재시도하지 않은 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      // 1. 이미 갱신 중인 경우: Promise를 생성하여 큐에 넣고 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push({
            onSuccess: (newToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            },
            onError: (refreshError) => {
              reject(refreshError);
            },
          });
        });
      }

      // 2. 갱신 시작: Lock을 걸고 진행
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        setAccessToken(newToken);

        // 대기열에 있던 요청들 깨우기
        onRefreshed(newToken);

        // 현재 실패했던 요청 재수행
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // terminal 401일 때만 토큰을 비우고, 경쟁 상태성 401은 즉시 로그아웃하지 않는다.
        onRefreshFailed(refreshError);

        if (isTerminalRefreshError(refreshError)) {
          setAccessToken(null);
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
