import React from "react";
import {
  Grid,
  Radio,
  Icon,
  Divider,
  Input,
  Button
} from "semantic-ui-react";
import { useState } from "react";
import { QrReader } from "react-qr-reader";
import QRCode from "qrcode.react";
import jsQR from 'jsqr';
import { useNavigate } from 'react-router-dom';

const CustomerPage = () => {
  const [qrValue, setQrValue] = useState();
  const [serialNumber, setSerialNumber] = useState("");
  const [selected, setSelected] = useState("environment");
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const navigate = useNavigate();

  const handleScan = async (scanData) => {
    setLoadingScan(true);
    console.log(`loaded data`, scanData);
    if (scanData && scanData !== "") {
      console.log(`loaded >>>`, scanData);
      const decodedData = JSON.parse(scanData);
      setSerialNumber(decodedData.serialNumber || "");
      setQrValue(scanData);
      setStartScan(!startScan);
      setLoadingScan(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleUploadQr = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imgDataUrl = e.target.result;
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          const decodedData = JSON.parse(code.data);
          setSerialNumber(decodedData.serialNumber || "");
          setQrValue(code.data);
        } else {
          console.log("No QR code found in the image.");
        }
      };
      img.src = imgDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleCheckProduct = () => {
    navigate(`/product/${serialNumber}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Grid columns={1} container stackable>
        <Grid.Row style={{ paddingTop: "40px" }}>
          <Grid.Column>
            <h2>Enter the product serial number</h2>
            <Input 
                type="number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}    
            />
          </Grid.Column>
        </Grid.Row>
        <Divider horizontal>Or</Divider>
        <Grid.Row>
          <Grid.Column>
            <Grid columns={1} container>
              <Grid.Column>
                <div className="file-input-container">
                  <label htmlFor="file-input" className="file-input-label">
                    Upload QR Code
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="file-input"
                    onChange={handleUploadQr}
                  />
                </div>

                <div style={{ height: "5px" }} />
                <div style={{ textAlign: "center" }}>
                  <Radio
                    toggle
                    onChange={() => {
                      setStartScan(!startScan);
                    }}
                    label={startScan ? "Turn off camera" : "Turn on camera"}
                    checked={startScan}
                  />
                </div>
                {qrValue && (
                  <QRCode
                    value={qrValue}
                    size={120}
                    style={{
                      margin: "auto",
                      display: "block",
                      paddingTop: "30px",
                    }}
                    id="qr-code"
                  />
                )}
                {startScan && (
                  <>
                    <div style={{ position: "relative", width: "100%", paddingLeft:'20%', paddingRight:'20%' }}>
                      <div style={{ position: "relative" }}>
                        <QrReader
                          constraints={{ facingMode: selected }}
                          delay={1000}
                          onError={handleError}
                          onResult={handleScan}
                          style={{ width: "100%", height: "auto" }}
                        />
                        <div className="qr-bounding-box"></div>
                      </div>
                    </div>
                    <Icon
                      name="exchange"
                      size="big"
                      className="exchange-icon"
                      onClick={() =>
                        setSelected(
                          selected === "environment" ? "user" : "environment"
                        )
                      }
                    />
                  </>
                )}
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                {serialNumber && (
                    <Button icon labelPosition='right' onClick={handleCheckProduct}>
                        Check Product History
                        <Icon name='right arrow' />
                    </Button>
                )}
            </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default CustomerPage;
