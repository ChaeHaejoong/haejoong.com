import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  type: "alert" | "confirm" | "prompt";
  title: string;
  message: string;
  inputMode: "input" | "textarea";
  inputType: React.HTMLInputTypeAttribute;
  inputValue: string;
  placeholder?: string;
  onConfirm?: (value?: string) => void;

  openModal: (args: {
    title?: string;
    message: string;
    onConfirm?: () => void;
  }) => void;

  openPrompt: (args: {
    title?: string;
    message: string;
    inputMode?: "input" | "textarea";
    inputType?: React.HTMLInputTypeAttribute;
    initialValue?: string;
    placeholder?: string;
    onConfirm: (value: string | undefined) => void;
  }) => void;

  closeModal: () => void;
  setInputValue: (value: string) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  type: "alert",
  title: "",
  message: "",
  inputMode: "input",
  inputType: "text",
  inputValue: "",
  placeholder: "",
  onConfirm: undefined,

  openModal: ({ title, message, onConfirm }) =>
    set({
      isOpen: true,
      type: onConfirm ? "confirm" : "alert",
      title: title ?? "알림",
      message,
      onConfirm,
      inputValue: "",
    }),

  openPrompt: ({
    title,
    message,
    inputMode,
    placeholder,
    inputType,
    initialValue,
    onConfirm,
  }) =>
    set({
      isOpen: true,
      type: "prompt",
      title: title ?? "입력",
      message,
      inputMode: inputMode ?? "input",
      inputType,
      placeholder,
      onConfirm,
      inputValue: initialValue ?? "",
    }),

  closeModal: () => set({ isOpen: false, inputValue: "" }),
  setInputValue: (value) => set({ inputValue: value }),
}));
