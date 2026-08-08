(() => {
  const AUTHOR = 'اسماعیل فرحمند';
  const SITE = 'https://esmaeilfarahmandp-sys.github.io/';
  const COPYRIGHT = `شاعر: ${AUTHOR}\nمنبع: ${SITE}\n© ${AUTHOR} — بازنشر با حفظ نام شاعر.`;

  document.addEventListener('copy', (event) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const anchor = selection.anchorNode?.parentElement;
    const focus = selection.focusNode?.parentElement;
    const poem = anchor?.closest('.poem,[data-work="poem"]') || focus?.closest('.poem,[data-work="poem"]');
    if (!poem) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const attribution = selectedText.includes(AUTHOR)
      ? selectedText
      : `${selectedText}\n\n— ${COPYRIGHT}`;

    event.preventDefault();
    event.clipboardData.setData('text/plain', attribution);
  });
})();
