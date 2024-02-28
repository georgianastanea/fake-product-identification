import PRODUCT_TRACKER_ABI from '../abis/ProductTracker.json';
import { ethers } from 'ethers';

export const loadProvider = (dispatch) => {
    const connection = new ethers.providers.Web3Provider(window.ethereum);
    dispatch({ type: "PROVIDER_LOADED", connection});
    return connection;
};

export const loadNetwork = async (provider, dispatch) => {
    const { chainId } = await provider.getNetwork();
    dispatch({ type: "NETWORK_LOADED", chainId});
    return chainId;
};

export const loadAccount = async(provider, dispatch) => {
    const accounts = await window.ethereum.request({
        method:"eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    dispatch({
        type:"ACCOUNT_LOADED", account
    });
    // let balance = await provider.getBalance(account);   
    // balance = ethers.utils.formatEther(balance);
    // dispatch({
    //     type:"ETHER_BALANCE_LOADED", balance
    // });
    return account;
};

export const loadProductTracker = (provider, address, dispatch) => {
    const product_tracker = new ethers.Contract(address, PRODUCT_TRACKER_ABI, provider);
    dispatch({ 
        type: "PRODUCT_TRACKER_LOADED", 
        product_tracker
    });
    return product_tracker;
}

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
    dispatch ({ type: "NEW_PRODUCT_LOADED" });

    try {
        const signer = provider.getSigner();
        transaction = await product_tracker.connect(signer).addProduct(
            Number(serialNumber),
            name,
            sourceAddress,
            destinationAddress,
            remarks
        );
        await transaction.wait();
    } catch (error) {
        console.log('Error submitting product', error);
        dispatch({ type: "NEW_PRODUCT_FAIL" });
    }
};

export const loadAllProducts = async (provider, product_tracker, dispatch) => {
    const block = await provider.getBlockNumber();
    const productsStream = await product_tracker.queryFilter(
        "ProductTracker__AddProduct",
        0,
        block
    );
    const products = productsStream.map((event) => event.args);
    dispatch({ type: "ALL_PRODUCTS", products });
};

export const subscribeToEvent = async(product_tracker, dispatch) => {
    product_tracker.on(
        "ProductTracker__AddProduct",
        (
            productId,
            timestamp,
            serialNumber,
            name,
            source,
            destination,
            remarks,
            manufacturer,
            supplier,
            event
        ) => {
            const productOrder = event.args;
            dispatch({ type: "NEW_PRODUCT_SUCCESS", productOrder, event });
        }
    );
};
