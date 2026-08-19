import { useModalStore } from "../../store/useModalStore";
import ModalOverlay from "../overlay/ModalOverlay";

export default function GlobalModal() {
  const {
    isOpen, type, title, message, inputMode, inputType,
    inputValue, placeholder, onConfirm, closeModal, setInputValue,
  } = useModalStore();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      type === "prompt" ? onConfirm(inputValue) : onConfirm();
    }
    closeModal();
  };

  return (
    <ModalOverlay modalClose={closeModal}>

      <div className="bg-bg rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-w-90 w-[calc(100%-2rem)] overflow-hidden animate-modal-in duration-300">
        
        <div className="px-6 pt-6">
          
          <h3 className="text-xl sm:text-2xl font-semibold text-title tracking-tight mb-2">
            {title}
          </h3>
          <p className="text-[15px] leading-relaxed text-body/80 mb-6 whitespace-pre-wrap">
            {message}
          </p>

          {type === "prompt" && (
            <div className="mb-2">
              {inputMode === "textarea" ? (
                <textarea
                  autoFocus
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={placeholder}
                  rows={4}
                  className="w-full resize-none rounded-xl bg-bg-secondary border-none px-4 py-3 focus:ring-2 focus:ring-primary/50 transition text-body placeholder:text-subtle/50 no-scrollbar"
                />
              ) : (
                <input
                  autoFocus
                  type={inputType ?? "text"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={placeholder}
                  className="w-full h-12 rounded-xl px-4 text-body mb-3 outline-none border-divider border focus:border-primary transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 pb-6">
          {(type === "confirm" || type === "prompt") && (
            <button
              onClick={closeModal}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-body hover:bg-bg-secondary transition-colors"
            >
              취소
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            확인
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}