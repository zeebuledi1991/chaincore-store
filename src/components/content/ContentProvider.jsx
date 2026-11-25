import { createContext, useContext } from "react";
import { CONTENT_DEFAULTS } from "@/lib/content-defaults";

const ContentContext = createContext({});

export function ContentProvider({ content, children }) {
  return <ContentContext.Provider value={content || {}}>{children}</ContentContext.Provider>;
}

// Returns t(key): the admin-edited text when one is saved, otherwise the default copy.
export function useContent() {
  const content = useContext(ContentContext);
  return (key) => {
    const value = content[key];
    if (value !== undefined && value !== null && value !== "") return value;
    return CONTENT_DEFAULTS[key] ?? "";
  };
}