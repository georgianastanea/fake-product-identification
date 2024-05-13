import PRODUCT_TRACKER_ABI from "../abis/ProductTracker.json";
import { ethers } from "ethers";
import axios from "axios";

const apiKey = process.env.REACT_APP_IPFS_API_KEY;
const apiSecretKey = process.env.REACT_APP_IPFS_API_SECRET;

export const loadProvider = (dispatch) => {
  const connection = new ethers.providers.Web3Provider(window.ethereum);
  dispatch({ type: "PROVIDER_LOADED", connection });
  return connection;
};

export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork();
  dispatch({ type: "NETWORK_LOADED", chainId });
  return chainId;
};

export const loadAccount = async (provider, dispatch) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = ethers.utils.getAddress(accounts[0]);
  dispatch({
    type: "ACCOUNT_LOADED",
    account,
  });
  return account;
};

const pinJSONToIPFS = async (jsonData) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  try {
    const response = await axios.post(url, jsonData, {
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecretKey,
        "Content-Type": "application/json",
      },
    });
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error pinning JSON to IPFS: ", error);
    throw error;
  }
};

async function fetchJSONDataFromIPFS(cid) {
  const url = `https://gateway.pinata.cloud/ipfs/${cid}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch JSON data:", error);
  }
}

export const loadProductTracker = (provider, address, dispatch) => {
  const product_tracker = new ethers.Contract(
    address,
    PRODUCT_TRACKER_ABI,
    provider
  );
  dispatch({
    type: "PRODUCT_TRACKER_LOADED",
    product_tracker,
  });
  return product_tracker;
};

export const submitProduct = async (
  serialNumber,
  name,
  sourceAddress,
  destinationAddress,
  remarks,
  provider,
  product_tracker,
  dispatch
) => {
  let transaction;
  dispatch({ type: "NEW_PRODUCT_LOADED" });

  try {
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    const block = await provider.getBlock("latest");

    const jsonProduct = {
      serialNumber: serialNumber,
      timestamp: block.timestamp,
      productName: name,
      sourceAddress: sourceAddress,
      destinationAddress: destinationAddress,
      remarks: remarks,
      manufacturer: signerAddress,
      supplier: "0x0000000000000000000000000000000000000000",
    };

    const cid = await pinJSONToIPFS(jsonProduct);

    transaction = await product_tracker
      .connect(signer)
      .addProduct(serialNumber, cid);
    await transaction.wait();
  } catch (error) {
    console.log("Error submitting product", error);
    dispatch({ type: "NEW_PRODUCT_FAIL" });
  }
};

export const updateProduct = async (
  serialNumber,
  productName,
  sourceAddress,
  destinationAddress,
  remarks,
  provider,
  product_tracker,
  dispatch
) => {
  let transaction;
  dispatch({ type: "UPDATE_PRODUCT_LOADED" });

  try {
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    const block = await provider.getBlock("latest");

    const oldCid = await product_tracker.getProduct(Number(serialNumber));
    const oldProduct = await fetchJSONDataFromIPFS(oldCid);

    const jsonProduct = {
      serialNumber: serialNumber,
      timestamp: block.timestamp,
      productName: productName,
      sourceAddress: sourceAddress,
      destinationAddress: destinationAddress,
      remarks: remarks,
      manufacturer: oldProduct.manufacturer,
      supplier: signerAddress,
    };

    const newCid = await pinJSONToIPFS(jsonProduct);

    transaction = await product_tracker
      .connect(signer)
      .updateProduct(Number(serialNumber), newCid);
    await transaction.wait();
  } catch (error) {
    console.log("Error updating product", error);
    dispatch({ type: "UPDATE_PRODUCT_FAIL" });
  }
};

export const submitComplexProduct = async (
  serialNumber,
  name,
  sourceAddress,
  destinationAddress,
  remarks,
  containingProducts,
  provider,
  product_tracker,
  dispatch
) => {
  let transaction, complexProductTransaction;
  dispatch({ type: "NEW_PRODUCT_LOADED" });

  try {
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    const block = await provider.getBlock("latest");

    const containingProductsCids = await Promise.all(
      containingProducts.map(async (product) => {
        const cid = await product_tracker.getProduct(product.serialNumber);
        return cid;
      })
    );

    const containingProductsData = await Promise.all(
      containingProductsCids.map(async (cid) => {
        const data = await fetchJSONDataFromIPFS(cid);
        return data;
      })
    );

    const jsonProduct = {
      serialNumber: serialNumber,
      timestamp: block.timestamp,
      productName: name,
      sourceAddress: sourceAddress,
      destinationAddress: destinationAddress,
      remarks: remarks,
      manufacturer: signerAddress,
      supplier: signerAddress,
      containingProducts: containingProductsData,
    };

    const cid = await pinJSONToIPFS(jsonProduct);

    complexProductTransaction = await product_tracker
      .connect(signer)
      .addComplexProduct(serialNumber, containingProducts.map((product) => product.serialNumber));
    await complexProductTransaction.wait();

    transaction = await product_tracker
      .connect(signer)
      .addProduct(serialNumber, cid);
    await transaction.wait();
  } catch (error) {
    console.log("Error submitting product", error);
    dispatch({ type: "NEW_PRODUCT_FAIL" });
  }
};

export const loadAllProducts = async (provider, product_tracker, dispatch) => {
  const block = await provider.getBlockNumber();
  const addedProductsStream = await product_tracker.queryFilter(
    "ProductTracker__AddProduct",
    0,
    block
  );
  const addedProducts = addedProductsStream.map((event) => event.args);

  const updatedProductsStream = await product_tracker.queryFilter(
    "ProductTracker__UpdateProduct",
    0,
    block
  );
  const updatedProducts = updatedProductsStream.map((event) => event.args);

  // array of products that were added but not updated
  const products = addedProducts.filter((product) => {
    const updatedProduct = updatedProducts.find(
      (updatedProduct) =>
        updatedProduct.serialNumber.toString() ===
        product.serialNumber.toString()
    );
    return !updatedProduct;
  });
  // array of all products
  updatedProducts.forEach((updatedProduct) => {
    products.push(updatedProduct);
  });
  dispatch({ type: "ALL_PRODUCTS", products });
};

export const loadProductHistoryBySerialNumber = async (
  serialNumber,
  provider,
  product_tracker
) => {
  const block = await provider.getBlockNumber();
  const addedProductsStream = await product_tracker.queryFilter(
    "ProductTracker__AddProduct",
    0,
    block
  );
  const initialCid = addedProductsStream.find(
    (event) => event.args.serialNumber.toString() === serialNumber.toString()
  );
  if (!initialCid) return { initialProduct: undefined, updatedProducts: [] };

  const initialProduct = await fetchJSONDataFromIPFS(initialCid.args.cid);

  const updatedProductsStream = await product_tracker.queryFilter(
    "ProductTracker__UpdateProduct",
    0,
    block
  );
  const updatedCids = updatedProductsStream.filter(
    (event) => event.args.serialNumber.toString() === serialNumber.toString()
  );
  const updatedProducts = await Promise.all(
    updatedCids.map((event) => fetchJSONDataFromIPFS(event.args.cid))
  );

  return { initialProduct, updatedProducts };
};

export const subscribeToEvent = async (product_tracker, dispatch) => {
  product_tracker.on(
    "ProductTracker__AddProduct",
    (serialNumber, cid, timestamp, event) => {
      const productOrder = event.args;
      console.log(productOrder);
      dispatch({ type: "NEW_PRODUCT_SUCCESS", productOrder, event });
    }
  );
  product_tracker.on(
    "ProductTracker__UpdateProduct",
    (serialNumber, cid, timestamp, event) => {
      const updateOrder = event.args;
      dispatch({ type: "UPDATE_PRODUCT_SUCCESS", updateOrder, event });
    }
  );
};
