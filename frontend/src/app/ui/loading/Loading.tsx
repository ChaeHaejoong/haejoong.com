import { useLoadingText } from "@/shared/hooks/useLoadingText";
import Overlay from "@/shared/ui/overlay/Overlay";

export default function Loading() {
  const text = useLoadingText();
  return (
    <Overlay>
      <div className="flex flex-col place-items-center select-none">
        <img
          src="/imgs/icon.png"
          className="animate-spin [animation-duration:5s] w-25 mb-5"
        />
        <p className="text-xl text-white">{text}</p>
      </div>
    </Overlay>
  );
}
