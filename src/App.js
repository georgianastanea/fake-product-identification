import { Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import config from "./config.json";
import {
  loadProvider,
  loadNetwork,
  loadProductTracker,
  loadAccount,
  loadAllProducts,
  subscribeToEvent,
} from "./store/interactions";
import Layout from "./components/Layout";
import Home from "./components/Home";
import ManufacturerPage from "./components/ManufacturerPage";
import SupplierPage from "./components/SupplierPage";
import CustomerPage from "./components/CustomerPage";
import Alert from "./components/Alert";

function App() {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    const provider = loadProvider(dispatch);
    const chainId = await loadNetwork(provider, dispatch);

    window.ethereum.on("accountsChanged", () => {
      loadAccount(provider, dispatch);
    });
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    const product_tracker_config = config[chainId].ProductTracker;
    const product_tracker = loadProductTracker(
      provider,
      product_tracker_config.address,
      dispatch
    );
    loadAllProducts(provider, product_tracker, dispatch);
    subscribeToEvent(product_tracker, dispatch);
  };

  useEffect(() => {
    loadBlockchainData();
  });

  return (
    <div>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manufacturer" element={<ManufacturerPage />} />
          <Route path="/supplier" element={<SupplierPage />} />
          <Route path="/customer" element={<CustomerPage />} />
        </Routes>
      </Layout>
      <Alert />/
    </div>
  );
}

export default App;
