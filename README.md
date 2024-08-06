# Supply Chain Management Using Distributed Ledgers

## Overview

This project uses blockchain technology to create a transparent, secure, and immutable supply chain management system. By addressing the issue of counterfeit goods, it ensures the authenticity and traceability of products, enabling manufacturers, suppliers, and customers to track the entire supply chain history of a product. The complete documentation is available at the project's root.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [System Design](#system-design)
4. [Usage](#usage)
5. [Access the Project](#access-the-project)
6. [Testing and Demonstration](#testing-and-demonstration)


## Features

- **Manufacturers**:
  - Register products.
  - Generate and download QR codes.
  - Verify transactions on the blockchain.

- **Suppliers**:
  - Scan and upload QR codes.
  - Update product details.
  - Register product bundles.

- **Customers**:
  - Search products by serial number.
  - Scan and upload QR codes.
  - View detailed product history.

## Technologies Used

- **Blockchain (Ethereum)**: Utilized for its decentralized and immutable ledger to validate and store transaction data.
- **IPFS (InterPlanetary File System)**: Employed for distributed and scalable file storage, ensuring data availability and integrity.
- **Smart Contracts**: Written in Solidity to automate the registration and verification processes within the supply chain.
- **Web3.js**: Used to interact with the Ethereum blockchain from the web application.
- **QR Code Generation**: Facilitates easy product tracking and data retrieval through scannable codes.

## System Design

The system is composed of three main components:

1. **Web Application**: 
   - Provides the user interface for manufacturers, suppliers, and customers to interact with the system.
   - Built using React.js.

2. **Ethereum Blockchain**: 
   - Hosts smart contracts for transaction validation and product registration.
   - Ensures data immutability and security.

3. **IPFS**:
   - Stores detailed product information in a distributed manner.
   - Enhances data availability and scalability.

## Usage

### For Manufacturers

1. Connect to Ethereum using Metamask.
2. Register a new product with details.
3. Generate and download the QR code.

### For Suppliers

1. Connect to Ethereum using Metamask.
2. Scan or upload a QR code.
3. Update product details or register product bundles.

### For Customers

1. Search for a product by serial number.
2. Scan or upload a QR code to view product history.

## Access the Project

This repository contains the code for the Supply Chain Management Using Distributed Ledgers project. You can access the deployed application at [https://fake-product-identification-one.vercel.app/](https://fake-product-identification-one.vercel.app/) on both desktop and mobile. The app is deployed on Vercel. 

## Testing and Demonstration

For testing the application as a manufacturer or supplier, a Metamask wallet is needed and the extension should be added to the browser. 

### Manufacturer's page
![image](https://github.com/user-attachments/assets/8938070c-fa27-40e5-ab5b-73b80409ad15)

### Suplier's page
![image](https://github.com/user-attachments/assets/7c0521f9-3861-437b-9f64-c659f591a527)

![image](https://github.com/user-attachments/assets/9004f22e-cd22-4519-af2b-9a8cd98a34cf)

### Customer's page
Try this part by searching for the serial numbers 3765429865, 9375602854 or upload the following QR codes:

#### Adults Flu Pack (Complex product)
![image](https://github.com/user-attachments/assets/b5cba469-45b2-4655-832e-fba796ddaa72)

#### Malarone
![image](https://github.com/user-attachments/assets/0e5ad465-1113-4186-8a76-8d7de5acd92f)






