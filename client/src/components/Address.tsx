import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../modules";
import { getAddressRequest, addAddressRequest, delAddressRequest } from "../modules/address";
import "./../styles/Address.scss";

interface Address {
  id: number;
  postnumber: number;
  name: string;
  address: string;
}
const Address = () => {
  const dispatch = useDispatch();
  const storeAddress = useSelector((state: RootState) => state.address);
  /**
   * count 값은 5개로 고정시킴
   */
  const count = 5;
  const [currentPage, setCurrent] = useState(0);
  const [openControlMenu, setControlMenu] = useState(-1);
  function handleToggleControl(id: number) {
    if (openControlMenu !== id) {
      setControlMenu(id);
    } else {
      closeControlMenu();
    }
  }
  function closeControlMenu() {
    setControlMenu(-1);
  }
  function handleGetAddresses(count: number, currentPage: number) {
    dispatch(getAddressRequest(count, currentPage));
  }
  function handleMoreAddress() {
    setCurrent(currentPage + 1);
    dispatch(getAddressRequest(count, currentPage + 1));
  }
  function handleSetDefault() {}
  function handleDeleteAddress(id: number) {
    dispatch(delAddressRequest(id));
  }
  const controlMenu = (addressId: number) => {
    return (
      <div className="address-control-menu">
        <div className="bg-dim" onClick={closeControlMenu}></div>
        <ul>
          <li>
            <button type="button" onClick={handleSetDefault}>
              기본 배송지 설정
            </button>
          </li>
          <li>
            <button type="button" onClick={() => handleDeleteAddress(addressId)}>
              삭제
            </button>
          </li>
        </ul>
      </div>
    );
  };
  const addressList = (addresses: Address[]) => {
    return addresses.map((address, index) => {
      return (
        <li key={index}>
          <div className="address-info">
            <div className="info-postnumber">
              <span>[{address.postnumber}]</span>
              {defaultAddress === address.id ? <span className="default-mark">기본</span> : ""}
            </div>
            <div className="info-address">
              <span>{address.address}</span>
            </div>
          </div>
          <div className="control-menu-btn">
            <button type="button" onClick={() => handleToggleControl(address.id)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            {openControlMenu === address.id ? controlMenu(address.id) : ""}
          </div>
        </li>
      );
    });
  };
  useEffect(() => {
    setCurrent(currentPage + 1);
    dispatch(getAddressRequest(count, currentPage + 1));
  }, []);
  const addresses: Address[] = storeAddress.addresses;
  const addressesLength: number = storeAddress.totalCount;
  const defaultAddress: number = storeAddress.defaultAddress;
  return (
    <section className="Address" id="Address">
      <h1>등록된 배송지</h1>
      <div className="address-wrapper">
        <div className="address-list-wrapper">
          {addresses && addresses.length > 0 ? (
            <ul className="address-list">
              {addressList(addresses)}
              {addressesLength > currentPage * count ? (
                <li className="address-more-btn">
                  <button type="button" onClick={handleMoreAddress}>
                    더보기
                  </button>
                </li>
              ) : (
                ""
              )}
            </ul>
          ) : (
            <div className="no-address">
              <div className="no-address-icon">
                <span></span>
                <span></span>
              </div>
              <p>등록된 배송지가 없습니다.</p>
            </div>
          )}
          <div className="add-address-btn">
            <button type="button">+ 추가</button>
          </div>
        </div>
        <div className="address-description">
          <p>배송지를 삭제하면 예약된 후원의 배송지 정보도 삭제되나요?</p>
          <p>
            현재 후원하신 프로젝트에 등록된 배송지가 삭제되거나 변경되지 않습니다. 이를 변경하시려면 후원현황에서
            변경해주세요. <a href="#">내 후원현황 바로가기</a>
          </p>
        </div>
      </div>
    </section>
  );
};
export default Address;
