import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { myEventsSelector } from "../store/selectors";
import config from "../config.json";
import { MessageHeader, MessageContent, Message, Icon } from "semantic-ui-react";
import "./alert.css";

const Alert = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [componentKey, setComponentKey] = useState(0);

  const event = useSelector(myEventsSelector);
  const overlayRef = useRef(null);
  const isPending = useSelector((state) => state.product_tracker.transaction.isPending);
  const isError = useSelector((state) => state.product_tracker.transaction.isError);
  const isSuccessful = useSelector((state) => state.product_tracker.transaction.isSuccessful);

  const chainId = useSelector((state) => state.provider.chainId);
  const dispatch = useDispatch();
  const account = useSelector((state) => state.provider.account);

  const handleDismiss = () => {
    setIsVisible(false);
    overlayRef.current.className = "overlay--remove";
    setComponentKey((prevKey) => prevKey + 1); 
  };

  useEffect(() => {
    if (isPending && overlayRef.current) {
      setIsVisible(true);
      overlayRef.current.className = "overlay";
    }
  }, [isPending]);

  return (
    console.log(sessionStorage.getItem("sender")),
    console.log(account),
    <div key={componentKey}>
      {isVisible && <div className="alertOverlay" ref={overlayRef}></div>}
      <div className="alertBox">
        {isVisible &&
          (isPending ? (
            <Message icon floating className="message">
              <Icon name="circle notched" loading />
              <MessageContent>
                <MessageHeader>Pending...</MessageHeader>
                Your transaction is being processed.
              </MessageContent>
            </Message>
          ) : isError ? (
            <Message negative floating onClick={handleDismiss} className="message">
              <Icon name="close" onClick={handleDismiss} />
              <MessageHeader>Transaction Failed</MessageHeader>
            </Message>
          ) : isSuccessful && event[0] && sessionStorage.getItem("sender") === account ? (
            <Message positive floating onClick={handleDismiss} className="message">
              <Icon name="close" onClick={handleDismiss} />
              <MessageHeader>Your transaction was successful!</MessageHeader>
              <a
                href={
                  config[chainId]
                    ? `${config[chainId].explorerURL}tx/${event[0].transactionHash}`
                    : `#`
                }
                target="_blank"
                rel="noreferrer"
              >
                {event[0].transactionHash.slice(0, 6) + "..." + event[0].transactionHash.slice(60, 66)}
              </a>
            </Message>
          ) : (
            <div></div>
          ))}
      </div>
    </div>
  );
};

export default Alert;
