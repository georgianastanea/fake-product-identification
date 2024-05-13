import React from "react";
import { Grid, Form, FormField, Button } from "semantic-ui-react";
import QRCode from "qrcode.react";
import { useState, useEffect, useRef } from "react";
import { submitProduct } from "../store/interactions";
import { useSelector, useDispatch } from "react-redux";
import { MessageHeader, Message } from "semantic-ui-react";

const ManufacturerPage = () => {
  const [qrValue, setQrValue] = useState();
  const [serialNumber, setSerialNumber] = useState("");
  const [productName, setProductName] = useState("");
  const [sourceAddress, setSourceAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [remarks, setRemarks] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const account = useSelector((state) => state.provider.account);
  const product_tracker = useSelector(
    (state) => state.product_tracker.contract
  );
  const dispatch = useDispatch();
  const provider = useSelector((state) => state.provider.connection);

  useEffect(() => {
    setSerialNumber("");
    setProductName("");
    setSourceAddress("");
    setDestinationAddress("");
    setRemarks("");
  }, [refreshKey]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    submitProduct(
      serialNumber,
      productName,
      sourceAddress,
      destinationAddress,
      remarks,
      provider,
      product_tracker,
      dispatch
    );
    handleGenerateQR();
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleGenerateQR = () => {
    const qrObject = {
      serialNumber: serialNumber,
      productName: productName,
      sourceAddress: sourceAddress,
      destinationAddress: destinationAddress,
      remarks: remarks,
    };

    const qrValue = JSON.stringify(qrObject);
    setQrValue(qrValue);
  };

  const downloadCode = () => {
    const canvas = document.getElementById("qr-code");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qr_code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div>
      {account ? (
        <div>
          <h3 style={{ padding: "20px" }}>Manufacturer Page</h3>
          <Grid columns={2} container divided stackable>
            <Grid.Row>
              <Grid.Column>
                <Form>
                  <FormField>
                    <label>Serial Number</label>
                    <input
                      type="number"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                    />
                  </FormField>
                  <FormField>
                    <label>Product Name</label>
                    <input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </FormField>
                  <FormField>
                    <label>Source Address</label>
                    <input
                      value={sourceAddress}
                      onChange={(e) => setSourceAddress(e.target.value)}
                    />
                  </FormField>
                  <FormField>
                    <label>Destination Address</label>
                    <input
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                    />
                  </FormField>
                  <FormField>
                    <label>Remarks about the product</label>
                    <input
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </FormField>
                  <Button
                    color="blue"
                    type="submit"
                    onClick={handleAddProduct}
                    style={{ margin: "auto", display: "block" }}
                  >
                    Add Product
                  </Button>
                </Form>
              </Grid.Column>
              <Grid.Column>
                <Grid columns={1} container>
                  <Grid.Column>
                    <Button
                      color="blue"
                      style={{ margin: "auto", display: "block" }}
                      onClick={handleGenerateQR}
                    >
                      Generate QR Code
                    </Button>
                    {qrValue && (
                      <QRCode
                        value={qrValue}
                        size={200}
                        style={{
                          margin: "auto",
                          display: "block",
                          paddingTop: "30px",
                        }}
                        id="qr-code"
                      />
                    )}
                    {qrValue && (
                      <a
                        style={{
                          margin: "auto",
                          display: "block",
                          textAlign: "center",
                          cursor: "pointer",
                          paddingTop: "20px",
                        }}
                        onClick={() => downloadCode()}
                      >
                        Download QR Code
                      </a>
                    )}
                  </Grid.Column>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      ) : (
        <Message info style={{ marginTop:'50px'}}>
          <MessageHeader>Are you a manufacturer?</MessageHeader>
          <p>Please connect to your wallet first.</p>
        </Message>
      )}
    </div>
  );
};

export default ManufacturerPage;
