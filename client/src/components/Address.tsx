import React from "react";
import address from "../modules/address";
interface Address {
  id: number;
  postnumber: number;
  name: string;
  address: string;
}
function handleToggleControl() {}
function handleSetDefault() {}
function handleDeleteAddress() {}
const controlMenu = (addressId: number) => {
  return (
    <ul>
      <li>
        <button type="button" onClick={handleSetDefault}>
          기본 배송지 설정
        </button>
      </li>
      <li>
        <button type="button" onClick={handleDeleteAddress}>
          삭제
        </button>
      </li>
    </ul>
  );
};
const addressList = (address: Address) => {
  return (
    <li>
      <span>[{address.postnumber}]</span>
      <span>{address.address}</span>
      <button type="button" onClick={handleToggleControl}></button>
    </li>
  );
};
const Address = () => {
  return (
    <section className="Address">
      <h1>등록된 배송지</h1>
      <ul>
        <li>
          <button type="button"></button>
        </li>
      </ul>
      <div className="add-address-btn">
        <button type="button">+ 추가</button>
      </div>
    </section>
  );
};

export default Address;
