import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DocumentLayout from "./layouts/DocumentLayout";
import GlobalErrorPage from "@/app/ui/error/GlobalErrorPage";
import RootLayout from "./layouts/RootLayout";
import Loading from "./ui/loading/Loading";
import HomePage from "@/pages/home/Page";
import RegitsterPage from "@/pages/user/register/Page";
import PostEditPage from "@/pages/post/edit/Page";
import PostUpdatePage from "@/pages/post/update/Page";
import PostDetailPage from "@/pages/post/detail/Page";
import PostCommentsPage from "@/pages/post/comments/Page";
import CopyrightPage from "@/pages/copyright/Page";
import MyPage from "@/pages/user/my-page/MyPage";
import NotFoundPage from "./ui/error/NotFoundPage";
import { postDetailPageLoader } from "@/pages/post/detail/loader";
import { homePageLoader } from "@/pages/home/loader";
import AdminPage from "@/pages/admin/Page";
import { adminPageLoader } from "@/pages/admin/loader";
import { myPageLoader } from "@/pages/user/my-page/loader";

export function createRouter() {
  return createBrowserRouter([
    {
      element: <RootLayout />,
      errorElement: <GlobalErrorPage />,
      hydrateFallbackElement: <Loading />,
      children: [
        { path: "*", element: <NotFoundPage /> },
        {
          element: <AppLayout />,
          children: [
            { path: "/posts/new", element: <PostEditPage /> },
            { path: "/posts/:id/edit", element: <PostUpdatePage /> },
            {
              path: "/posts/:id/comments",
              element: <PostCommentsPage />,
              loader: postDetailPageLoader,
            },
          ],
        },
        {
          element: <DocumentLayout />,
          children: [
            { path: "/", element: <HomePage />, loader: homePageLoader },

            {
              path: "/admin",
              element: <AdminPage />,
              loader: adminPageLoader,
            },

            { path: "/register", element: <RegitsterPage /> },

            {
              path: "/posts/:id",
              element: <PostDetailPage />,
              loader: postDetailPageLoader,
            },

            { path: "/me", element: <MyPage />, loader: myPageLoader },

            { path: "/copyright", element: <CopyrightPage /> },
          ],
        },
      ],
    },
  ]);
}
