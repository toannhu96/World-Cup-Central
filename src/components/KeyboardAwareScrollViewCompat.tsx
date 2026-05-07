import React from "react";
import { Box } from "zmp-ui";

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function KeyboardAwareScrollViewCompat({
  children,
  className = "",
  style = {},
}: Props) {
  // In a web/ZMP environment, we can just use a div with overflow-auto.
  // The browser/Zalo webview handles the keyboard appearance by resizing the viewport.
  return (
    <div 
      className={`overflow-y-auto w-full h-full ${className}`}
      style={{
        flex: 1,
        ...style
      }}
    >
      {children}
    </div>
  );
}
