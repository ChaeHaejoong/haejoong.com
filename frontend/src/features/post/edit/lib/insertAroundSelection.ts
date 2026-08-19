export function insertAroundSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;

  const selected = text.substring(start, end);

  const newText =
    text.substring(0, start) + before + selected + after + text.substring(end);

  // React controlled input은 textarea.value 직접 할당을 감지하지 못합니다.
  // 네이티브 setter + input 이벤트를 통해 React의 onChange를 트리거합니다.
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    "value",
  )?.set;
  nativeSetter?.call(textarea, newText);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));

  textarea.selectionStart = start + before.length;
  textarea.selectionEnd = end + before.length;

  textarea.focus();
}
