import React from "react";
import { Grid, Form, FormField, Button, Radio, Icon } from "semantic-ui-react";
import QRCode from "qrcode.react";
import { useState, useEffect, useRef } from "react";
import { submitProduct } from "../store/interactions";
import { useSelector, useDispatch } from "react-redux";
import { QrReader } from "react-qr-reader";
import './scannerStyles.css';

const SupplierPage = () => {
  const [qrValue, setQrValue] = useState();
  const [serialNumber, setSerialNumber] = useState("");
  const [productName, setProductName] = useState("");
  const [sourceAddress, setSourceAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [remarks, setRemarks] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState("environment");
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [data, setData] = useState("");

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
    const qrValue = `Serial Number: ${serialNumber}, Product Name: ${productName}, Source Address: ${sourceAddress}, Destination Address: ${destinationAddress}, Remarks: ${remarks}`;
    setQrValue(qrValue);
    console.log(JSON.stringify(qrValue));
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

  const handleScan = async (scanData) => {
    setLoadingScan(true);
    console.log(`loaded data data`, scanData);
    if (scanData && scanData !== "") {
      console.log(`loaded >>>`, scanData);
      setData(scanData);
      setStartScan(false);
      setLoadingScan(false);
  };
}

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <h3 style={{ padding: "20px" }}>Supplier Page</h3>
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
                Update Product
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
                <div style={{ height: "7px" }} />
                <Button
                  color="blue"
                  style={{
                    margin: "auto",
                    display: "block",
                    paddingLeft: "27.8px",
                    paddingRight: "27.8px",
                  }}
                  //   onClick={}
                >
                  Upload QR Code
                </Button>
                <div style={{ height: "5px" }} />
                <div style={{ textAlign: "center" }}>
                  <Radio
                    toggle
                    onChange={() => {
                      setStartScan(!startScan);
                    }}
                    label={startScan ? "Turn off camera" : "Turn on camera"}
                  />
                </div>
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
                <div style={{ height: "5px" }} />
                {startScan && (
                  <>
                    <div style={{ position: "relative", width: "100%" }}>
                      <div style={{ position: "relative" }}>
                        <QrReader
                          constraints={{ facingMode: selected }}
                          delay={1000}
                          onError={handleError}
                          onResult={handleScan}
                          style={{ width: "100%", height: "auto"}}
                        />
                        <div
                          className="qr-bounding-box"
                        ></div>
                      </div>
                    </div>
                    <Icon
                      name="exchange"
                      size="big"
                      className="exchange-icon"
                      onClick={() =>
                        setSelected(selected === "environment" ? "user" : "environment")
                      }
                    />
                  </>
                )}
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default SupplierPage;
