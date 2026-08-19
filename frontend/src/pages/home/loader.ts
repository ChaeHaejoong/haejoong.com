import { fetchPosts } from "@/entities/post/api/fetchPosts";

export async function homePageLoader() {
  return fetchPosts();
}

export type HomeLoaderData = Awaited<ReturnType<typeof homePageLoader>>;
