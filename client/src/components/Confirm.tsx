import React from "react";
import "./../styles/Confirm.scss";
function Confirm(something: any, accept: Function, cancel: Function) {
  return (
    <div className="Confirm">
      <div className="bg-dim" onClick={() => cancel()}></div>
      <div className="Confirm-message">
        {something.message}
        <div className="Confirm-btns">
          <button type="button" onClick={() => accept(something.id)}>
            확인
          </button>
          <button type="button" onClick={() => cancel()}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirm;
