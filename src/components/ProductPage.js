import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadProductHistoryBySerialNumber } from "../store/interactions";
import { useSelector } from "react-redux";
import FactoryIcon from '@mui/icons-material/Factory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import './productPage.css';

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
        console.log("Product history:", history);
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
      {productHistory.initialProduct && (
        <VerticalTimeline lineColor="#e7e7e7">
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "rgb(33, 150, 243)", color: "black" }}
            contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
            date={formatDate(productHistory.initialProduct.args.timestamp)}
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<FactoryIcon />}
          >
            <h3 className="vertical-timeline-element-title">
              {productHistory.initialProduct.args.name}
            </h3>
            <p>
              <label>Serial Number: </label>
              {productHistory.initialProduct.args.serialNumber.toString()}
              <br />
              <label>Source: </label>
              {productHistory.initialProduct.args.source.toString()}
              <br />
              <label>Destination: </label>
              {productHistory.initialProduct.args.destination.toString()}
              <br />
              <label>Remarks: </label>
              {productHistory.initialProduct.args.remarks.toString()}
              <br />
              <label>Manufacturer Address: </label>
              {productHistory.initialProduct.args.manufacturer.toString()}
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "#f5f5f5", color: "black" }}
            date={formatDate(productHistory.updatedProducts[0].args.timestamp)}
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<LocalShippingIcon />}
          >
            <h3 className="vertical-timeline-element-title">
              {productHistory.updatedProducts[0].args.name}
            </h3>
            <p>
              <label>Serial Number: </label>
              {productHistory.updatedProducts[0].args.serialNumber.toString()}
              <br />
              <label>Source: </label>
              {productHistory.updatedProducts[0].args.source.toString()}
              <br />
              <label>Destination: </label>
              {productHistory.updatedProducts[0].args.destination.toString()}
              <br />
              <label>Remarks: </label>
              {productHistory.updatedProducts[0].args.remarks.toString()}
              <br />
              <label>Supplier Address: </label>
              {productHistory.updatedProducts[0].args.supplier.toString()}
            </p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      )}
    </div>
  );
};

export default ProductPage;
