const supportsClipboard = !!navigator && !!navigator.clipboard;

/** Copy text to clipboard with fallback support if navigator.clipboard API not supported */
export function copyToClipboard(text: string) {
  supportsClipboard ? navigator.clipboard.writeText(text) : copyToClipboardFallback(text);
}

/** Fallback function to copy to clipboard */
function copyToClipboardFallback(text: string) {
  let dummyTextarea = document.createElement('textarea');
  document.body.appendChild(dummyTextarea);
  dummyTextarea.value = text;
  dummyTextarea.select();
  document.execCommand('copy');
  document.body.removeChild(dummyTextarea);
}
