export const getImageUrl = (path: string | null | undefined) => {
  if (!path) return;

  const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");
  const assetBase = trimTrailingSlash(
    import.meta.env.VITE_ASSET_BASE_URL ?? import.meta.env.VITE_BASE_URL ?? "",
  );

  // blob/data URI는 그대로 반환
  if (path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }

  // 절대 URL 처리
  if (path.startsWith("http://") || path.startsWith("https://")) {
    if (!assetBase) {
      return path;
    }

    // 예전 호스트(localhost/ngrok)로 저장된 /uploads 경로는 현재 assetBase로 교체
    const match = path.match(/(\/uploads\/.+)/);
    if (match) return `${assetBase}${match[1]}`;

    return path;
  }

  // public 폴더 자원인 경우 그대로 반환
  if (path.startsWith("/imgs")) {
    return path;
  }

  // /uploads 또는 기타 상대경로는 assetBase가 있으면 절대화, 없으면 상대경로 유지
  if (!assetBase) {
    return path.startsWith("/") ? path : `/${path}`;
  }

  return `${assetBase}${path.startsWith("/") ? "" : "/"}${path}`;
};
