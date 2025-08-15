import React from "react";
import { cn } from "@/utils/cn";

const TextArea = React.forwardRef(({ 
  className, 
  error,
  rows = 4,
  ...props 
}, ref) => {
  return (
    <textarea
      rows={rows}
      className={cn(
        "w-full px-3 py-2 bg-white border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 resize-vertical",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50",
        error ? "border-error focus:ring-error/50 focus:border-error" : "border-gray-200 hover:border-gray-300",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

TextArea.displayName = "TextArea";

export default TextArea;