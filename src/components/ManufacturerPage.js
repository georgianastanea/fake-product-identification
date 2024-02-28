import React from "react";
import { Grid, Segment, Form, FormField, Button } from "semantic-ui-react";
import QRCode from 'react-qr-code';
import { useState } from "react";
import { submitProduct } from "../store/interactions";
import { useSelector, useDispatch } from 'react-redux';
import Alert from './Alert';

const ManufacturerPage = () => {

    const [qrValue, setQrValue] = useState();
    const [serialNumber, setSerialNumber] = useState(0);
    const [productName, setProductName] = useState(0);
    const [sourceAddress, setSourceAddress] = useState(0);
    const [destinationAddress, setDestinationAddress] = useState(0);
    const [remarks, setRemarks] = useState(0);

    const account = useSelector((state) => state.provider.account);
    const product_tracker = useSelector((state) => state.product_tracker.contract);
    const dispatch = useDispatch();
    const provider = useSelector((state) => state.provider.connection);

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
        setSerialNumber(0);
        setProductName(0);
        setSourceAddress(0);
        setDestinationAddress(0);
        setRemarks(0);
    };

    const handleGenerateQR = () => {
        const qrValue = `Serial Number: ${serialNumber}, Product Name: ${productName}, Source Address: ${sourceAddress}, Destination Address: ${destinationAddress}, Remarks: ${remarks}`;
        setQrValue(qrValue);
        console.log(JSON.stringify(qrValue));
    };
    
    return (
        <div>
        <h3 style={{ padding:'20px' }}>Manufacturer Page</h3>
        <Grid columns={2} container divided stackable>
          <Grid.Row>
            <Grid.Column>
              <Form>
                <FormField>
                  <label>Serial Number</label>
                  <input type="number" onChange={(e) => setSerialNumber(e.target.value)}/>
                </FormField>
                <FormField>
                  <label>Product Name</label>
                  <input onChange={(e) => setProductName(e.target.value)}/>
                </FormField>
                <FormField>
                  <label>Source Address</label>
                  <input onChange={(e) => setSourceAddress(e.target.value)}/>
                </FormField>
                <FormField>
                  <label>Destination Address</label>
                  <input onChange={(e) => setDestinationAddress(e.target.value)}/>
                </FormField>
                <FormField>
                  <label>Remarks about the product</label>
                  <input onChange={(e) => setRemarks(e.target.value)}/>
                </FormField>
                <Button 
                    type='submit'
                    onClick={handleAddProduct}
                    style={{ margin: 'auto', display: 'block' }}
                >
                    Add Product
                </Button>
              </Form>
            </Grid.Column>
            <Grid.Column>
            <Grid columns={1} container >
                <Grid.Column>
                    <Button style={{ margin: 'auto', display: 'block' }} onClick={handleGenerateQR}>Generate QR Code</Button>
                    {qrValue && 
                        <QRCode 
                        value={qrValue} 
                        size={200}
                        style={{ margin: 'auto', display: 'block', paddingTop:'30px' }}
                    />}
                </Grid.Column>
            </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        </div>
    );
};

export default ManufacturerPage;