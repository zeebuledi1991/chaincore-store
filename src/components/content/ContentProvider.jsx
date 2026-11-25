import { createContext, useContext, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { previewContent } from "@/lib/content-fns";
import { CONTENT_DEFAULTS } from "@/lib/content-defaults";

const ContentContext = createContext({});

export function ContentProvider({ content, children }) {
  const loadPreview = useServerFn(previewContent);
  const [preview, setPreview] = useState(null);

  // Administrators can look at unpublished drafts by adding ?preview=draft to the URL.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.location.search.includes("preview=draft")) return;
    let active = true;
    loadPreview()
      .then((data) => {
        if (active && data) setPreview(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [loadPreview]);

  const value = preview ? { ...(content || {}), ...preview } : content || {};
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

// Returns t(key): the published text when one is saved, otherwise the default copy.
// An explicitly blank or hidden element returns "" so it disappears from the page.
export function useContent() {
  const content = useContext(ContentContext);
  return (key) => {
    if (Object.prototype.hasOwnProperty.call(content, key)) {
      const value = content[key];
      if (value !== undefined && value !== null) return value;
    }
    return CONTENT_DEFAULTS[key] ?? "";
  };
}