import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/base.css";
import "./styles/highlight.css";
import "./styles/animation.css";
import { initAuth } from "./init/auth-init.ts";
import { createRouter } from "./router";

// auth 완료 후 router 생성 → createBrowserRouter가 이 시점에 처음 실행됨
// → 모든 로더 실행 시 accessToken이 이미 세팅되어 있음
initAuth().finally(() => {
  const router = createRouter();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App router={router} />
    </StrictMode>,
  );
});
