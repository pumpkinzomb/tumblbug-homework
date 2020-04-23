import update from "react-addons-update";
import axios from "axios";

interface Address {
  id: number;
  postnumber: number;
  name: string;
  addresses: string;
}
type AddressAction = ReturnType<typeof getAddress> | ReturnType<typeof addAddress> | ReturnType<typeof delAddress>;
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
        console.log(response.data);
        dispatch(getAddress(addresses, totalCount, currentPage, defaultAddress));
      })
      .catch((error) => {
        throw error.response.data;
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
        throw error.response.data;
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
        throw error.response.data;
      });
  };
};
export const delAddress = (addressId: number) => ({ type: DEL_ADDRESS, addressId });

/**
 * Reducer
 */

const initialState = {
  defaultAddress: -1,
  addresses: [],
  totalCount: 0,
  currentPage: 0,
};
function address(state: AddressState = initialState, action: AddressAction) {
  switch (action.type) {
    case GET_ADDRESS:
      let sortAddresses = update(state.addresses, {
        $set: state.addresses.concat(action.addresses),
      });
      const findDefault = sortAddresses.findIndex((address) => address.id === action.defaultAddress);
      if (findDefault > 0) {
        let firstOne = sortAddresses.splice(findDefault, 1)[0];
        sortAddresses = [firstOne, ...sortAddresses];
      }
      return update(state, {
        defaultAddress: { $set: action.defaultAddress },
        addresses: { $set: sortAddresses },
        totalCount: { $set: action.totalCount },
      });
    case ADD_ADDRESS:
      return update(state, {
        addresses: { $set: action.address, ...state.addresses },
        totalCount: { $set: action.totalCount },
      });
    case DEL_ADDRESS:
      let index = state.addresses.findIndex((item) => item.id === action.addressId);
      return update(state, {
        addresses: { $splice: [[index, 1]] },
      });
    default:
      return state;
  }
}

export default address;
