import update from "react-addons-update";
import axios from "axios";

interface Address {
  id: number;
  postnumber: number;
  name: string;
  address: string;
}
type AddressAction = ReturnType<typeof getAddress> | ReturnType<typeof addAddress> | ReturnType<typeof delAddress>;
type AddressState = {
  default: string;
  address: Address[];
  totalCount: number;
  currentPage: number;
};

/**
 * Action 생성자
 */
const GET_ADDRESS = "address/GET_ADDRESS" as const;
const ADD_ADDRESS = "address/ADD_ADDRESS" as const;
const DEL_ADDRESS = "address/DEL_ADDRESS" as const;

/**
 * Action
 */
export const getAddressRequest = (count: number, page: number) => {
  return (dispatch: any) => {
    // API REQUEST
    return axios
      .post(`/api/address`, { count, page })
      .then((response) => {
        const { totalCount, address, currentPage } = response.data;
        dispatch(getAddress(address, totalCount, currentPage));
      })
      .catch((error) => {
        throw error.response.data.code;
      });
  };
};
export const getAddress = (address: Address[], totalCount: number, currentPage: number) => {
  return {
    type: GET_ADDRESS,
    address,
    totalCount,
    currentPage,
  };
};
export const addAddressRequest = (address: Address) => {
  return (dispatch: any) => {
    // API REQUEST
    return axios
      .post(`/api/address`, { address })
      .then((response) => {
        const { totalCount, address, currentPage } = response.data;
        dispatch(addAddress(totalCount, address, currentPage));
      })
      .catch((error) => {
        throw error.response.data.code;
      });
  };
};
export const addAddress = (address: Address, totalCount: number, currentPage: number) => ({
  type: ADD_ADDRESS,
  address,
  totalCount,
  currentPage,
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
        throw error.response.data.code;
      });
  };
};
export const delAddress = (addressId: number) => ({ type: DEL_ADDRESS, addressId });

/**
 * Reducer
 */

const initialState = {
  default: "",
  address: [],
  totalCount: 0,
  currentPage: 0,
};
function address(state: AddressState = initialState, action: AddressAction) {
  switch (action.type) {
    case GET_ADDRESS:
      return update(state, {
        address: { $set: state.address.concat(action.address) },
        totalCount: { $set: action.totalCount },
      });
    case ADD_ADDRESS:
      return update(state, {
        address: { $set: action.address, ...state.address },
        totalCount: { $set: action.totalCount },
      });
    case DEL_ADDRESS:
      let index = state.address.findIndex((item) => item.id === action.addressId);
      return update(state, {
        address: { $splice: [[index, 1]] },
      });
    default:
      return state;
  }
}

export default address;
