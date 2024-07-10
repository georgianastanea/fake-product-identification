import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadProductHistoryBySerialNumber } from "../store/interactions";
import { useSelector } from "react-redux";
import FactoryIcon from "@mui/icons-material/Factory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { MessageHeader, Message, Dimmer, Loader } from "semantic-ui-react";
import "./productPage.css";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

const ProductPage = () => {
  const { serialNumber } = useParams();
  const provider = useSelector((state) => state.provider.connection);
  const product_tracker = useSelector(
    (state) => state.product_tracker.contract
  );
  const [productHistory, setProductHistory] = useState({});
  const [productNotFound, setProductNotFound] = useState(false);
  const [isComplexProduct, setIsComplexProduct] = useState(false);
  const [containingProducts, setContainingProducts] = useState([]);

  useEffect(() => {
    const fetchProductHistory = async () => {
      if (provider === undefined || product_tracker === undefined) return;
      try {
        const history = await loadProductHistoryBySerialNumber(
          serialNumber,
          provider,
          product_tracker
        );
        if (
          history.initialProduct !== undefined &&
          history.initialProduct.containingProducts !== undefined
        ) {
          setIsComplexProduct(true);
          setContainingProducts(history.initialProduct.containingProducts);
        }
        setProductHistory(history);
        if (history.initialProduct === undefined) setProductNotFound(true);
      } catch (error) {
        console.error("Error fetching product history:", error);
      }
    };

    fetchProductHistory();
  }, [serialNumber, provider, product_tracker]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const formattedDay = day < 10 ? "0" + day : day;
    const formattedMonth = month < 10 ? "0" + month : month;
    const formattedHour = hour < 10 ? "0" + hour : hour;
    const formattedMinute = minute < 10 ? "0" + minute : minute;
    const formattedSecond = second < 10 ? "0" + second : second;

    return `${formattedDay}/${formattedMonth}/${year} ${formattedHour}:${formattedMinute}:${formattedSecond}`;
  };

  return (
    <div style={{ paddingTop: "40px" }}>
      {productHistory.initialProduct ? (
        <VerticalTimeline lineColor="#e7e7e7">
          {isComplexProduct &&
            containingProducts.length > 0 &&
            containingProducts.map((containingProduct, index) => (
              <VerticalTimelineElement
                key={index}
                className="vertical-timeline-element--work"
                contentStyle={{
                  background: index % 2 === 0 ? "rgb(33, 150, 243)" : "#f5f5f5",
                  color: "black",
                }}
                contentArrowStyle={{
                  borderRight:
                    index % 2 === 0
                      ? "7px solid  rgb(33, 150, 243)"
                      : "7px solid #f5f5f5",
                }}
                date={formatDate(containingProduct.timestamp)}
                iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                icon={<FactoryIcon />}
                position={index % 2 === 0 ? "left" : "right"}
              >
                <h3 className="vertical-timeline-element-title">
                  {containingProduct.productName}
                </h3>
                <p>
                  <label>Serial Number: </label>
                  {containingProduct.serialNumber.toString()}
                  <br />
                  <label>Source: </label>
                  {containingProduct.sourceAddress.toString()}
                  <br />
                  <label>Destination: </label>
                  {containingProduct.destinationAddress.toString()}
                  <br />
                  <label>Remarks: </label>
                  {containingProduct.remarks.toString()}
                  <br />
                  <label>Manufacturer Address: </label>
                  {containingProduct.manufacturer.toString()}
                </p>
              </VerticalTimelineElement>
            ))}
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{
              background:
                containingProducts.length % 2 === 0
                  ? "rgb(33, 150, 243)"
                  : "#f5f5f5",
              color: "black",
            }}
            contentArrowStyle={{
              borderRight:
                containingProducts.length % 2 === 0
                  ? "7px solid  rgb(33, 150, 243)"
                  : "7px solid #f5f5f5",
            }}
            date={formatDate(productHistory.initialProduct.timestamp)}
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<FactoryIcon />}
          >
            <h3 className="vertical-timeline-element-title">
              {productHistory.initialProduct.productName}
            </h3>
            <p>
              <label>Serial Number: </label>
              {productHistory.initialProduct.serialNumber.toString()}
              <br />
              <label>Source: </label>
              {productHistory.initialProduct.sourceAddress.toString()}
              <br />
              <label>Destination: </label>
              {productHistory.initialProduct.destinationAddress.toString()}
              <br />
              <label>Remarks: </label>
              {productHistory.initialProduct.remarks.toString()}
              <br />
              <label>Manufacturer Address: </label>
              {productHistory.initialProduct.manufacturer
                ? productHistory.initialProduct.manufacturer.toString()
                : "N/A"}
              <br />
              <label>Supplier Address: </label>
              {productHistory.initialProduct.supplier
                ? productHistory.initialProduct.supplier.toString()
                : "N/A"}
            </p>
          </VerticalTimelineElement>

          {productHistory.updatedProducts.length > 0 &&
            productHistory.updatedProducts.map((updatedProduct, index) => (
              <VerticalTimelineElement
                key={index}
                className="vertical-timeline-element--work"
                contentStyle={{
                  background:
                    containingProducts.length % 2 === 1
                      ? "rgb(33, 150, 243)"
                      : "#f5f5f5",
                  color: "black",
                }}
                contentArrowStyle={{
                  borderRight:
                    containingProducts.length % 2 === 1
                      ? "7px solid  rgb(33, 150, 243)"
                      : "7px solid #f5f5f5",
                }}
                date={formatDate(productHistory.updatedProducts[0].timestamp)}
                iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                icon={<LocalShippingIcon />}
                position={containingProducts.length % 2 === 1 ? "left" : "right"}
              >
                <h3 className="vertical-timeline-element-title">
                  {productHistory.updatedProducts[0].productName}
                </h3>
                <p>
                  <label>Serial Number: </label>
                  {productHistory.updatedProducts[0].serialNumber.toString()}
                  <br />
                  <label>Source: </label>
                  {productHistory.updatedProducts[0].sourceAddress.toString()}
                  <br />
                  <label>Destination: </label>
                  {productHistory.updatedProducts[0].destinationAddress.toString()}
                  <br />
                  <label>Remarks: </label>
                  {productHistory.updatedProducts[0].remarks.toString()}
                  <br />
                  <label>Manufacturer Address: </label>
                  {productHistory.updatedProducts[0].manufacturer.toString()}
                  <br />
                  <label>Supplier Address: </label>
                  {productHistory.updatedProducts[0].supplier.toString()}
                </p>
              </VerticalTimelineElement>
            ))}
        </VerticalTimeline>
      ) : productNotFound ? (
        <div>
          <Message negative>
            <MessageHeader>We're sorry!</MessageHeader>
            <p>Product with serial number {serialNumber} was not found.</p>
          </Message>
        </div>
      ) : (
        <Dimmer active>
          <Loader>Loading</Loader>
        </Dimmer>
      )}
    </div>
  );
};

export default ProductPage;
