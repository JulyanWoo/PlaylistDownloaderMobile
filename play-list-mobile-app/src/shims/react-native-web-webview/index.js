import React from "react";

// eslint-disable-next-line react/display-name
const WebView = React.forwardRef(({ source, style, allow, sandbox }, ref) => {
  const src = source && source.uri ? source.uri : "";
  return (
    <iframe ref={ref} src={src} style={style} allow={allow} sandbox={sandbox} />
  );
});

export default WebView;
