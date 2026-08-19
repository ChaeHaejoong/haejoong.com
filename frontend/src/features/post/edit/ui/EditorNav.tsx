import OrangeButton from "@/shared/ui/button/OrangeButton";
import {
  FaBold,
  FaItalic,
  FaHeading,
  FaLink,
  FaImage,
  FaImages,
  FaCode,
  FaFileCode,
  FaQuoteRight,
  FaListUl,
  FaSave,
  FaEye,
  FaPaperPlane,
} from "react-icons/fa";
import EditorNavButton from "./EditorNavButton";

type EditorNavProps = {
  onBold: () => void;
  onItalic: () => void;
  onHeading: () => void;
  onList: () => void;
  onQuote: () => void;
  onCode: () => void;
  onCodeBlock: () => void;
  onLink: () => void;
  onImage: () => void;
  onMyImages: () => void;
  onDivider: () => void;

  onPreviewClick: () => void;
  onDraftSave: () => void;
  submitPost: () => void;
  isSaving: boolean;
};

export default function EditorNav({
  onHeading,
  onBold,
  onItalic,
  onList,
  onQuote,
  onCode,
  onCodeBlock,
  onLink,
  onImage,
  onDraftSave,
  onPreviewClick,
  submitPost,
  isSaving,
  onMyImages,
}: EditorNavProps) {
  return (
    <div className="flex items-center justify-between border-b border-divider py-2">
      <div className="flex gap-2">
        <EditorNavButton onClick={onHeading}>
          <FaHeading />
        </EditorNavButton>

        <EditorNavButton onClick={onBold}>
          <FaBold />
        </EditorNavButton>

        <EditorNavButton onClick={onItalic}>
          <FaItalic />
        </EditorNavButton>

        <EditorNavButton onClick={onList}>
          <FaListUl />
        </EditorNavButton>

        <EditorNavButton onClick={onQuote}>
          <FaQuoteRight />
        </EditorNavButton>

        <EditorNavButton onClick={onCode}>
          <FaCode />
        </EditorNavButton>

        <EditorNavButton onClick={onCodeBlock}>
          <FaFileCode />
        </EditorNavButton>

        <EditorNavButton onClick={onLink}>
          <FaLink />
        </EditorNavButton>

        <EditorNavButton onClick={onImage}>
          <FaImage />
        </EditorNavButton>

        <EditorNavButton onClick={onMyImages}>
          <FaImages />
        </EditorNavButton>
      </div>

      <div className="flex gap-2">
        <OrangeButton onClick={onPreviewClick}>
          <span className="flex items-center gap-2">
            <FaEye className="icon-align" />
            미리보기
          </span>
        </OrangeButton>

        <OrangeButton onClick={onDraftSave} disabled={isSaving}>
          <span className="flex items-center gap-2">
            <FaSave className="icon-align" />
            {isSaving ? "저장 중..." : "임시저장"}
          </span>
        </OrangeButton>

        <OrangeButton onClick={submitPost} disabled={isSaving}>
          <span className="flex items-center gap-2">
            <FaPaperPlane className="icon-align" />
            {isSaving ? "게시 중..." : "작성완료"}
          </span>
        </OrangeButton>
      </div>
    </div>
  );
}
