import { Link } from "react-router-dom";
import { useMe } from "../../model/useMe";
import { getImageUrl } from "@/shared/lib/getImageUrl";

export default function MyPageButton() {
  const { avatar, user } = useMe();
  return (
    <Link to="/me">
      <img
        src={getImageUrl(avatar)}
        alt={user?.nickname ?? "프로필"}
        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-divider"
      />
    </Link>
  );
}
