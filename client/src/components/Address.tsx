import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../modules";
import { getAddressRequest, addAddressRequest, delAddressRequest, setDefaultAddressRequest } from "../modules/address";
import { CSSTransition } from "react-transition-group";
import "./../styles/Address.scss";
import "./../styles/animation.scss";
import Confirm from "./Confirm";
import Toast from "./Toast";

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
  const [currentPage, setCurrent] = useState(1);
  const [openControlMenu, setControlMenu] = useState(-1);
  const [openAddAddress, setAddAddress] = useState(false);
  const [confirmMessage, setConfirm] = useState({ id: -1, message: "" });
  const [toastMessage, setToast] = useState({ show: false, message: "" });
  /** 라이프사이클 관련 */
  useEffect(() => {
    function getAddressList() {
      dispatch(getAddressRequest(count, currentPage));
    }
    getAddressList();
  }, [dispatch, currentPage]);
  /**
   * address의 추가, 삭제, 기본주소 설정 관련 메소드
   */
  function handleAddAddressSubmit() {
    const name = nameRef.current;
    const postnumber = postnumberRef.current;
    const address = addressRef.current;
    const setDefault = setdefaultRef.current;
    if (!name?.value || !postnumber?.value || !address?.value) {
      let check;
      if (!name?.value) {
        check = name;
        name?.parentElement?.classList.add("error");
      }
      if (!postnumber?.value) {
        check = !check ? postnumber : check;
        postnumber?.parentElement?.classList.add("error");
      }
      if (!address?.value) {
        check = !check ? address : check;
        address?.parentElement?.classList.add("error");
      }
      check?.focus();
      return;
    }

    const newAddress = {
      id: -1,
      postnumber: Number(postnumber?.value),
      name: String(name?.value),
      address: String(address?.value),
    };
    dispatch(addAddressRequest(newAddress, Boolean(setDefault?.checked)));
    closeNewAddress();
  }
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
  function handleSetDefault(id: number) {
    dispatch(setDefaultAddressRequest(id));
    closeControlMenu();
    handleToast(true, "기본 배송지가 변경되었습니다.");
    setTimeout(() => {
      handleToast(false, "기본 배송지가 변경되었습니다.");
    }, 1500);
  }
  function handleDeleteAddress(id: number) {
    setConfirm({ id, message: "삭제하시겠습니까?" });
    closeControlMenu();
    document.body.style.overflow = "hidden";
  }
  /**
   * 주소목록 더 불러오기 관련 메소드
   */
  function handleMoreAddress() {
    setCurrent(currentPage + 1);
  }
  /**
   * 컨펌 메세지 메소드
   */
  function confirmAccept(id: number) {
    dispatch(delAddressRequest(id));
    confirmCancel();
  }
  function confirmCancel() {
    setConfirm({ id: -1, message: "" });
    document.body.style.overflow = "auto";
  }
  /**
   * new address의 팝업창 관련 메소드
   */
  function handleOpenAddAddress() {
    setAddAddress(true);
    document.body.style.overflow = "hidden";
  }
  function closeNewAddress() {
    setAddAddress(false);
    document.body.style.overflow = "auto";
  }

  /**
   * 토스트 메세지
   */
  function handleToast(show: boolean, message: string) {
    setToast({
      show,
      message,
    });
  }

  /** 컨트롤 메뉴 함수컴포넌트 */
  const controlMenu = (addressId: number) => {
    return (
      <div className="address-control-menu">
        <div className="bg-dim" onClick={closeControlMenu}></div>
        <ul>
          <li>
            <button type="button" onClick={() => handleSetDefault(addressId)}>
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
  /** 주소목록 함수컴포넌트 */
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
  /** 새로운 주소등록 함수컴포넌트 */
  const nameRef = useRef<HTMLInputElement>(null);
  const postnumberRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const setdefaultRef = useRef<HTMLInputElement>(null);
  const addAddressSection = () => {
    return (
      <section className="add-new-address">
        <div className="bg-dim" onClick={closeNewAddress}></div>
        <div className="form-wrapper">
          <h1>배송지 추가</h1>
          <form onSubmit={handleAddAddressSubmit}>
            <div className="form-field-1">
              <div>
                <input
                  type="text"
                  placeholder="받는 사람"
                  ref={nameRef}
                  onChange={() => nameRef.current?.parentElement?.classList.remove("error")}
                ></input>
                <span>받는 분 이름을 입력해주세요.</span>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="우편번호"
                  ref={postnumberRef}
                  onChange={(event) => {
                    console.log(event.target.value);
                    event.target.value = event.target.value.replace(/[^0-9]/, "");
                    postnumberRef.current?.parentElement?.classList.remove("error");
                  }}
                ></input>
                <span>우편번호를 입력해주세요.</span>
              </div>
            </div>
            <div className="form-field-2">
              <input
                type="text"
                placeholder="주소"
                ref={addressRef}
                onChange={() => addressRef.current?.parentElement?.classList.remove("error")}
                maxLength={25}
              ></input>
              <span>주소를 입력해 주세요.</span>
            </div>
            <div className="form-field-3">
              <input type="checkbox" id="default_checkBox" ref={setdefaultRef} />
              <label htmlFor="default_checkBox">
                <span className="material-icons">check</span>
                기본 배송지로 등록
              </label>
            </div>
            <div className="submit-btn">
              <button type="button" onClick={handleAddAddressSubmit}>
                등록 완료
              </button>
            </div>
          </form>
          <div className="add-new-close-btn">
            <button type="button" onClick={closeNewAddress}>
              <span className="material-icons">close</span>
            </button>
          </div>
        </div>
      </section>
    );
  };
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
            <button type="button" onClick={handleOpenAddAddress}>
              + 추가
            </button>
          </div>
        </div>
        <div className="address-description">
          <p>배송지를 삭제하면 예약된 후원의 배송지 정보도 삭제되나요?</p>
          <p>
            현재 후원하신 프로젝트에 등록된 배송지가 삭제되거나 변경되지 않습니다. 이를 변경하시려면 후원현황에서
            변경해주세요. <button type="button">내 후원현황 바로가기</button>
          </p>
        </div>
      </div>
      {openAddAddress ? addAddressSection() : ""}
      {confirmMessage.message ? Confirm(confirmMessage, confirmAccept, confirmCancel) : ""}
      <CSSTransition in={toastMessage.show} timeout={1500} classNames="toast" unmountOnExit>
        {Toast(toastMessage.message)}
      </CSSTransition>
    </section>
  );
};
export default Address;
