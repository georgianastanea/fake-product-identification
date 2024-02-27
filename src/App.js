import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import config from './config.json';
import { loadProvider, loadNetwork, loadProductTracker, loadAccount } from './store/interactions';
import Layout from './components/Layout';

function App() {

  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    const provider = loadProvider(dispatch);
    const chainId = await loadNetwork(provider, dispatch);

    // window.ethereum.on('accountsChanged', () => {
    //   loadAccount(provider, dispatch);
    // });
    // window.ethereum.on("chainChanged", () => {
    //   window.location.reload();
    // });
    
    const product_tracker_config = config[chainId].ProductTracker;
    const product_tracker = loadProductTracker(provider, product_tracker_config.address, dispatch);
    //loadAllData(provider, medical, dispatch);
    //subscribeToEvent(medical, dispatch);
  };

  useEffect(() => {
    loadBlockchainData()
  });

  return (
    <Layout>

    </Layout>
  );
}

export default App;
