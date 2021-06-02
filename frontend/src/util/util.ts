export function uid () {
  // https://gist.github.com/solenoid/1372386
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
};

export function setCaretToEnd (element: HTMLElement) {
  console.log(element);
  // manually sets cursor to end of block content
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
  element.focus();
};

export function getCaretCoordinates () {
  let x, y;
  const selection = window.getSelection();
  if (selection && selection.rangeCount !== 0) {
    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(false);
    const rect = range.getClientRects()[0];
    if (rect) {
      x = rect.left;
      y = rect.top;
    }
  }
  return { x, y };
};

export const getSelection = (element: Element) => {
  let selectionStart, selectionEnd;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const range = window.getSelection()?.getRangeAt(0);
    if (!range) return;
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(element);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    selectionStart = preSelectionRange.toString().length;
    selectionEnd = selectionStart + range.toString().length;
  }
  return { selectionStart, selectionEnd };
}