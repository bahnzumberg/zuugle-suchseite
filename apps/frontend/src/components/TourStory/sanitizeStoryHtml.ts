/**
 * Browser-based sanitization for WordPress Gutenberg HTML.
 * Strips script tags, unsafe protocols (javascript:), inline event handlers,
 * and restricts tags/attributes to safe presentation elements.
 */
export function sanitizeStoryHtml(rawHtml: string): string {
  if (typeof window === "undefined") return rawHtml;

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, "text/html");

  const allowedTags = new Set([
    "P",
    "H2",
    "H3",
    "H4",
    "FIGURE",
    "IMG",
    "FIGCAPTION",
    "BLOCKQUOTE",
    "A",
    "STRONG",
    "EM",
    "B",
    "I",
    "BR",
    "UL",
    "OL",
    "LI",
    "SPAN",
  ]);

  const allowedAttrs: Record<string, Set<string>> = {
    A: new Set(["href", "target", "rel", "title"]),
    IMG: new Set([
      "src",
      "alt",
      "title",
      "loading",
      "width",
      "height",
      "class",
    ]),
    FIGURE: new Set(["class"]),
    FIGCAPTION: new Set(["class"]),
    BLOCKQUOTE: new Set(["class"]),
    P: new Set(["class"]),
    SPAN: new Set(["class"]),
  };

  function sanitizeNode(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toUpperCase();

      if (!allowedTags.has(tag)) {
        // Replace disallowed tag with its inner text/children
        const parent = el.parentNode;
        if (parent) {
          while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
          }
          parent.removeChild(el);
        }
        return;
      }

      // Filter attributes
      const allowed = allowedAttrs[tag] || new Set();
      const attrs = Array.from(el.attributes);
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        if (name.startsWith("on") || !allowed.has(name)) {
          el.removeAttribute(attr.name);
        } else if (
          (name === "href" || name === "src") &&
          attr.value.trim().toLowerCase().startsWith("javascript:")
        ) {
          el.removeAttribute(attr.name);
        }
      }

      if (tag === "A") {
        el.setAttribute("rel", "noopener noreferrer");
        el.setAttribute("target", "_blank");
      }
      if (tag === "IMG") {
        el.setAttribute("loading", "lazy");
      }
    }

    const children = Array.from(node.childNodes);
    for (const child of children) {
      sanitizeNode(child);
    }
  }

  Array.from(doc.body.childNodes).forEach(sanitizeNode);
  return doc.body.innerHTML;
}
