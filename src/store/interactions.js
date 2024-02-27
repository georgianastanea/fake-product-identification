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
    let balance = await provider.getBalance(account);   
    balance = ethers.utils.formatEther(balance);
    dispatch({
        type:"ETHER_BALANCE_LOADED", balance
    });
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
