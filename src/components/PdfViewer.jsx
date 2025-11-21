import { useEffect, useRef } from "react";

export default function PdfViewer() {
  const iframeRef = useRef(null);

  const detected = useRef({
    operations: null,
    financials: null,
  });

  const FALLBACK = {
    operations: 3,
    financials: 4,
  };

  const fileUrl = "/Report.pdf";

  const waitForViewerReady = async (iframe, timeout = 7000) => {
    if (!iframe) return null;
    const start = Date.now();

    return new Promise((resolve, reject) => {
      const tick = () => {
        try {
          const doc = iframe.contentWindow?.document;
          if (!doc) {
            if (Date.now() - start > timeout) return reject();
            return setTimeout(tick, 120);
          }

          const viewer = doc.querySelector("#viewer");
          const viewerContainer = doc.querySelector("#viewerContainer");

          if (viewer && viewerContainer)
            return resolve({ doc, viewer, viewerContainer });
        } catch {}

        if (Date.now() - start > timeout) return reject();
        setTimeout(tick, 120);
      };
      tick();
    });
  };

  const getPageTop = (doc, pageNum) => {
    const page = doc.querySelector(`.page[data-page-number="${pageNum}"]`);
    return page ? page.offsetTop : 0;
  };

  const detectSections = async (iframe) => {
    try {
      const v = await waitForViewerReady(iframe, 8000);
      if (!v) return;

      const { doc } = v;
      const spans = doc.querySelectorAll(".textLayer span");

      spans.forEach((span) => {
        const txt = (span.textContent || "").toLowerCase();
        const pageEl = span.closest(".page");
        if (!pageEl) return;

        const pnum = parseInt(pageEl.dataset.pageNumber, 10);

        if (
          (txt.includes("management review") ||
            txt.includes("management's review")) &&
          !detected.current.operations
        ) {
          detected.current.operations = pnum;
        }

        if (
          txt.includes("summary financial") ||
          txt.includes("financial guidance") ||
          txt.includes("revenue")
        ) {
          if (!detected.current.financials) detected.current.financials = pnum;
        }
      });

      if (!detected.current.operations)
        detected.current.operations = FALLBACK.operations;

      if (!detected.current.financials)
        detected.current.financials = FALLBACK.financials;
    } catch {
      detected.current.operations = FALLBACK.operations;
      detected.current.financials = FALLBACK.financials;
    }
  };

  const createHighlight = (doc, viewer, top, height = 140) => {
    const el = doc.createElement("div");
    el.className = "custom-highlight";
    el.style.cssText = `
      position:absolute;
      left:20px;
      right:20px;
      top:${top}px;
      height:${height}px;
      background:rgba(255,230,0,.45);
      border-radius:6px;
      pointer-events:none;
      z-index:9999;
      transition:opacity 300ms ease;
    `;
    viewer.appendChild(el);

    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 400);
    }, 2500);
  };

  const extractPageText = (iframe, doc, viewerContainer, pageNum) => {
    const top = getPageTop(doc, pageNum);
    let collected = "";

    const spans = doc.querySelectorAll(".textLayer span");
    const iframeRect = iframe.getBoundingClientRect();

    spans.forEach((span) => {
      const rect = span.getBoundingClientRect();
      const spanTop = rect.top - iframeRect.top + viewerContainer.scrollTop;

      if (spanTop >= top && spanTop <= top + 1000) {
        collected += (span.textContent || "") + " ";
      }
    });

    return collected.trim();
  };

  const onPdfSearch = async (e) => {
    const q = (e.detail?.text || "").toLowerCase().trim();
    if (!q) return;

    const iframe = iframeRef.current;
    let v;
    try {
      v = await waitForViewerReady(iframe);
    } catch {
      return;
    }

    const { doc, viewer, viewerContainer } = v;
    const iframeRect = iframe.getBoundingClientRect();

    doc.querySelectorAll(".search-highlight").forEach((n) => n.remove());

    let firstTop = null;

    doc.querySelectorAll(".textLayer span").forEach((span) => {
      const txt = span.textContent.toLowerCase();
      if (txt.includes(q)) {
        const rect = span.getBoundingClientRect();

        const top = rect.top - iframeRect.top + viewerContainer.scrollTop;

        const hl = doc.createElement("div");
        hl.className = "search-highlight";
        hl.style.cssText = `
          position:absolute;
          left:${rect.left - iframeRect.left}px;
          top:${top}px;
          width:${rect.width}px;
          height:${rect.height}px;
          background:rgba(255,255,0,0.55);
          pointer-events:none;
          z-index:9999;
        `;
        viewer.appendChild(hl);

        if (firstTop === null) firstTop = top;
      }
    });

    if (firstTop !== null)
      viewerContainer.scrollTo({ top: firstTop - 80, behavior: "smooth" });
  };

  const onExtractSection = async (e) => {
    const key = e.detail?.target;
    if (!key) return;

    const iframe = iframeRef.current;
    let v;
    try {
      v = await waitForViewerReady(iframe);
    } catch {
      return;
    }

    const { doc, viewerContainer } = v;

    const pageNum = detected.current[key];
    if (!pageNum) return;

    const extracted = extractPageText(iframe, doc, viewerContainer, pageNum);

    window.dispatchEvent(
      new CustomEvent("section-text", { detail: { text: extracted } })
    );
  };

  const onHighlight = async (e) => {
    const key = e.detail?.target;
    if (!key) return;

    const iframe = iframeRef.current;

    let v;
    try {
      v = await waitForViewerReady(iframe);
    } catch {
      return;
    }

    const { doc, viewer, viewerContainer } = v;

    const pageNum = detected.current[key];
    if (!pageNum) return;

    const topY = getPageTop(doc, pageNum);
    viewerContainer.scrollTo({ top: topY, behavior: "smooth" });

    createHighlight(doc, viewer, topY + 8);
  };

  useEffect(() => {
    const iframe = iframeRef.current;

    const timer = setTimeout(() => detectSections(iframe), 1500);

    window.addEventListener("pdf-search", onPdfSearch);
    window.addEventListener("extract-section", onExtractSection);
    window.addEventListener("highlight", onHighlight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pdf-search", onPdfSearch);
      window.removeEventListener("extract-section", onExtractSection);
      window.removeEventListener("highlight", onHighlight);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={`/web/viewer.html?file=${encodeURIComponent(fileUrl)}`}
      className="w-full h-full border-none"
    />
  );
}
