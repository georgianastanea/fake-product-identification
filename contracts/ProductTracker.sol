// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract ProductTracker {

    uint public productId;
    mapping(uint=> Product) products;

    struct Product {
        uint productId;
        uint timestamp;
        uint serialNumber;
        string name;
        string source;
        string destination;
        string remarks;
    }

    event ProductTracker__AddProduct(
        uint productId,
        uint timestamp,
        uint serialNumber,
        string name,
        string source,
        string destination,
        string remarks
    );

    event ProductTracker__UpdateProduct(
        uint productId,
        uint timestamp,
        uint serialNumber,
        string name,
        string source,
        string destination,
        string remarks
    );

    function addProduct(
        uint _serialNumber,
        string memory _name,
        string memory _source,
        string memory _destination,
        string memory _remarks
    ) public {
        productId++;
        products[productId] = Product(
            productId,
            block.timestamp,
            _serialNumber,
             _name,
             _source,
            _destination,
            _remarks
        );

        emit ProductTracker__AddProduct (
            productId, 
            block.timestamp, 
            _serialNumber,
            _name, 
            _source, 
            _destination, 
            _remarks);
    }

    function updateProduct(
        uint _productId,
        uint _serialNumber,
        string memory _name,
        string memory _source,
        string memory _destination,
        string memory _remarks
    ) public {
        require(_productId <= productId, "Invalid productId");
        
        Product storage product = products[_productId];
        product.serialNumber = _serialNumber;
        product.name = _name;
        product.source = _source;
        product.destination = _destination;
        product.remarks = _remarks;

        emit ProductTracker__UpdateProduct(
            _productId,
            block.timestamp,
            _serialNumber,
            _name,
            _source,
            _destination,
            _remarks
        );
    }
    
    function getProduct(uint _productId) public view returns(
        uint,
        uint, 
        uint,
        string memory, 
        string memory,
        string memory,
        string memory
    ){
        Product storage product = products[_productId];
        return (
            product.productId,
            product.timestamp,
            product.serialNumber,
            product.name,
            product.source,
            product.destination,
            product.remarks
        );
    }

    function getProductId() public view returns (uint){
        return productId;
    }

    function getTimestamp(uint _productId) public view returns (uint) {
        return products[_productId].timestamp;
    }

    function getSerialNumber(uint _productId) public view returns (uint) {
        return products[_productId].serialNumber;
    }

    function getName(uint _productId) public view returns (string memory) {
        return products[_productId].name;
    }

    function getSource(uint _productId) public view returns (string memory) {
        return products[_productId].source;
    }

    function getDestination(uint _productId) public view returns (string memory) {
        return products[_productId].destination;
    }

    function getRemarks(uint _productId) public view returns (string memory) {
        return products[_productId].remarks;
    }
}