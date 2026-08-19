import { FaXmark } from "react-icons/fa6";
import useCloseOnEsc from "../../hooks/useCloseOnEsc";
import Overlay from "./Overlay";

type ModalOverlayProps = {
  children: React.ReactNode;
  modalClose: () => void;
};

export default function ModalOverlay({
  children,
  modalClose,
}: ModalOverlayProps) {
  useCloseOnEsc(modalClose);

  return (
    <Overlay onClick={modalClose}>
      <button className="absolute top-4 right-4 text-white text-2xl cursor-pointer">
        <FaXmark />
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex justify-center items-center w-full px-4 py-[5%]"
      >
        {children}
      </div>
    </Overlay>
  );
}
