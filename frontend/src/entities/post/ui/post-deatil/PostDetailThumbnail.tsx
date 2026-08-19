import { getImageUrl } from "@/shared/lib/getImageUrl";

export default function PostDetailThumbnail({
  thumbnail,
}: {
  thumbnail: string;
}) {
  return (
    <img
      src={getImageUrl(thumbnail)}
      className="object-contain w-full my-6 sm:my-10 rounded-lg"
    />
  );
}
