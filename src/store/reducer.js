import { identity } from "lodash";

export const provider = (state = {}, action) => {
  switch (action.type) {
    case "PROVIDER_LOADED":
      return {
        ...state,
        connection: action.connection,
      };
    case "NETWORK_LOADED":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "ACCOUNT_LOADED":
      return {
        ...state,
        account: action.account,
      };
    case "ETHER_BALANCE_LOADED":
      return {
        ...state,
        balance: action.balance,
      };
    default:
      return state;
  }
};

const DEFAULT_PRODUCT_STATE = {
  loaded: false,
  contract: {},
  transaction: {
    isSuccessful: false,
  },
  allProducts: {
    loaded: false,
    data: [],
  },
  events: [],
};

export const product_tracker = (state = DEFAULT_PRODUCT_STATE, action) => {
  let index, data;
  switch (action.type) {
    case "PRODUCT_TRACKER_LOADED":
      return {
        ...state,
        loaded: true,
        contract: action.product_tracker,
      };
    case "NEW_PRODUCT_LOADED":
      return {
        ...state,
        transaction: {
          isPending: true,
          isSuccessful: false,
        },
      };
    case "NEW_PRODUCT_SUCCESS":
      index = state.allProducts.data.findIndex(
        (order) =>
          order.serialNumber.toString() ===
          action.productOrder.serialNumber.toString()
      );
      if (index === -1) {
        data = [...state.allProducts.data, action.productOrder];
      } else {
        data = state.allProducts.data;
      }
      return {
        ...state,
        allProducts: {
          ...state.allProducts,
          data,
        },
        transaction: {
          isPending: false,
          isSuccessful: true,
        },
        events: [action.event, ...state.events],
      };
    case "NEW_PRODUCT_FAIL":
      return {
        ...state,
        transaction: {
          isPending: false,
          isSuccessful: false,
          isError: true,
        },
      };
    case "ALL_PRODUCTS":
      return {
        ...state,
        allProducts: {
          loaded: true,
          data: action.products,
        },
      };
    case "UPDATE_PRODUCT_LOADED":
      return {
        ...state,
        transaction: {
          isPending: true,
          isSuccessful: false,
        },
      };
    case "UPDATE_PRODUCT_SUCCESS":
      const productIndex = state.allProducts.data.findIndex(
        (product) =>
          product.serialNumber.toString() ===
          action.updateOrder.serialNumber.toString()
      );

      if (productIndex !== -1) {
        const updatedProducts = [...state.allProducts.data];
        updatedProducts[productIndex] = action.updateOrder;

        return {
          ...state,
          allProducts: {
            ...state.allProducts,
            data: updatedProducts,
          },
          transaction: {
            isPending: false,
            isSuccessful: true,
          },
          events: [action.event, ...state.events],
        };
      } else {
        return {
          ...state,
          transaction: {
            productNotFound: true,
          },
        };
      }
    case "UPDATE_PRODUCT_FAIL":
      return {
        ...state,
        transaction: {
          isPending: false,
          isSuccessful: false,
          isError: true,
        },
      };
    default:
      return state;
  }
};
