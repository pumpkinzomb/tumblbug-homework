import update from "react-addons-update";
import axios from "axios";

interface Address {
  id: number;
  postnumber: number;
  name: string;
  address: string;
}
type AddressAction =
  | ReturnType<typeof getAddress>
  | ReturnType<typeof addAddress>
  | ReturnType<typeof delAddress>
  | ReturnType<typeof setDefaultAddress>;
type AddressState = {
  defaultAddress: number;
  addresses: Address[];
  totalCount: number;
  currentPage: number;
};

/**
 * Action 생성자
 */
const GET_ADDRESS = "address/GET_ADDRESS" as const;
const ADD_ADDRESS = "address/ADD_ADDRESS" as const;
const DEL_ADDRESS = "address/DEL_ADDRESS" as const;
const SET_DEFAULT_ADDRESS = "address/SET_DEFAULT_ADDRESS" as const;

/**
 * Action
 */
export const getAddressRequest = (count: number, currentPage: number) => {
  return (dispatch: any) => {
    // API REQUEST
    return axios
      .get(`/api/address/${count}/${currentPage}`)
      .then((response) => {
        const { totalCount, addresses, currentPage } = response.data;
        const defaultAddress = response.data.default;
        // console.log(response.data);
        dispatch(getAddress(addresses, totalCount, currentPage, defaultAddress));
      })
      .catch((error) => {
        throw error.response;
      });
  };
};
export const getAddress = (addresses: Address[], totalCount: number, currentPage: number, defaultAddress: number) => {
  return {
    type: GET_ADDRESS,
    addresses,
    totalCount,
    currentPage,
    defaultAddress,
  };
};
export const addAddressRequest = (address: Address, setDefault: boolean) => {
  return (dispatch: any) => {
    // API REQUEST
    return axios
      .post(`/api/address`, { newAddress: address, setDefault })
      .then((response) => {
        const { totalCount, addresses, defaultAddress } = response.data;
        dispatch(addAddress(addresses, totalCount, defaultAddress));
      })
      .catch((error) => {
        throw error.response;
      });
  };
};
export const addAddress = (addresses: Address, totalCount: number, defaultAddress: number) => ({
  type: ADD_ADDRESS,
  addresses,
  totalCount,
  defaultAddress,
});
export const delAddressRequest = (addressId: number) => {
  return (dispatch: any) => {
    // API REQUEST
    return axios
      .delete(`/api/address/${addressId}`)
      .then(() => {
        dispatch(delAddress(addressId));
      })
      .catch((error) => {
        throw error.response;
      });
  };
};
export const delAddress = (addressId: number) => ({ type: DEL_ADDRESS, addressId });
export const setDefaultAddressRequest = (addressId: number) => {
  return (dispatch: any) => {
    // API REQUEST
    return axios
      .put(`/api/address/default`, { id: addressId })
      .then((response) => {
        dispatch(setDefaultAddress(addressId));
      })
      .catch((error) => {
        throw error.response;
      });
  };
};
export const setDefaultAddress = (addressId: number) => ({
  type: SET_DEFAULT_ADDRESS,
  addressId,
});

/**
 * Reducer
 */
const initialState = {
  defaultAddress: -1,
  addresses: [],
  totalCount: 0,
  currentPage: 0,
};
/**
 * default 주소를 맨 앞으로 옮기게 해주는 함수
 */
function setDefaultToFirst(defaultId: number, addresses: Address[]) {
  const findDefault = addresses.findIndex((address) => address.id === defaultId);
  // console.log(defaultId, findDefault);
  if (findDefault > 0) {
    let firstOne = addresses.splice(findDefault, 1)[0];
    addresses = [firstOne, ...addresses];
    return addresses;
  } else {
    return addresses;
  }
}
function address(state: AddressState = initialState, action: AddressAction) {
  let sortAddresses;
  switch (action.type) {
    case GET_ADDRESS:
      sortAddresses = update(state.addresses, {
        $set: state.addresses.concat(action.addresses),
      });
      sortAddresses = setDefaultToFirst(action.defaultAddress, sortAddresses);
      return update(state, {
        defaultAddress: { $set: action.defaultAddress },
        addresses: { $set: sortAddresses },
        totalCount: { $set: action.totalCount },
      });
    case ADD_ADDRESS:
      sortAddresses = update(state.addresses, {
        $set: [action.addresses].concat(state.addresses),
      });
      console.log(sortAddresses);
      sortAddresses = setDefaultToFirst(action.defaultAddress, sortAddresses);
      return update(state, {
        addresses: { $set: sortAddresses },
        totalCount: { $set: action.totalCount },
        defaultAddress: { $set: action.defaultAddress },
      });
    case DEL_ADDRESS:
      let index = state.addresses.findIndex((item) => item.id === action.addressId);
      return update(state, {
        addresses: { $splice: [[index, 1]] },
      });
    case SET_DEFAULT_ADDRESS:
      sortAddresses = update(state.addresses, {
        $set: state.addresses,
      });
      sortAddresses = setDefaultToFirst(action.addressId, sortAddresses);
      return update(state, {
        defaultAddress: { $set: action.addressId },
        addresses: { $set: sortAddresses },
      });
    default:
      return state;
  }
}

export default address;
