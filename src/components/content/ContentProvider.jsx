import { createContext, useContext } from "react";
import { CONTENT_DEFAULTS } from "@/lib/content-defaults";

const ContentContext = createContext({});

export function ContentProvider({ content, children }) {
  return <ContentContext.Provider value={content || {}}>{children}</ContentContext.Provider>;
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