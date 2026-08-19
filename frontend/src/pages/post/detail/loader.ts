import { fetchPostById } from "@/entities/post/api/fetchPostById";
import { queryClient } from "@/app/queryClient";
import type { PostResponseDto } from "@haejoong.com/shared";
import type { LoaderFunctionArgs } from "react-router-dom";

export async function postDetailPageLoader({
  params,
}: LoaderFunctionArgs): Promise<PostResponseDto> {
  const post = await fetchPostById(params.id!);
  queryClient.setQueryData(["post", params.id!], post);
  return post;
}
