import React from "react";
import "./../styles/Toast.scss";
function Toast(message: string) {
  return <div className="Toast">{message}</div>;
}

export default Toast;
