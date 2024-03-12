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

  useEffect(() => {
    const fetchProductHistory = async () => {
      if (provider === undefined || product_tracker === undefined) return;
      try {
        const history = await loadProductHistoryBySerialNumber(
          serialNumber,
          provider,
          product_tracker
        );
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
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "rgb(33, 150, 243)", color: "black" }}
            contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
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
              {productHistory.initialProduct.manufacturer.toString()}
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "#f5f5f5", color: "black" }}
            date={formatDate(productHistory.updatedProducts[0].timestamp)}
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<LocalShippingIcon />}
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
              <label>Supplier Address: </label>
              {productHistory.updatedProducts[0].supplier.toString()}
            </p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      ) : productNotFound ? (
        <div style={{}}>
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
