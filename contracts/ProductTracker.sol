// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductTracker {
    mapping(uint => string) products;
    mapping(uint => uint[]) complexProducts; 

    event ProductTracker__AddProduct(
        uint serialNumber,
        string cid,
        uint timestamp
    );

    event ProductTracker__UpdateProduct(
        uint serialNumber,
        string cid,
        uint timestamp
    );

    event ProductTracker__AddComplexProduct(
        uint serialNumber,
        uint[] containingProducts,
        uint timestamp
    );

    event ProductTracker__UpdateComplexProduct(
        uint serialNumber,
        uint[] containingProducts,
        uint timestamp
    );

    function addProduct(uint _serialNumber, string memory _cid) public {
        require(!productExists(_serialNumber), "Product already exists");
        products[_serialNumber] = _cid;
        emit ProductTracker__AddProduct(_serialNumber, _cid, block.timestamp);
    }

    function updateProduct(uint _serialNumber, string memory _cid) public {
        require(productExists(_serialNumber), "Product not found");
        products[_serialNumber] = _cid;
        emit ProductTracker__UpdateProduct(_serialNumber, _cid, block.timestamp);
    }

    function addComplexProduct(uint _serialNumber, uint[] memory _containingProducts) public {
        require(!productExists(_serialNumber), "Product already exists");
        for (uint i = 0; i < _containingProducts.length; i++) {
            require(productExists(_containingProducts[i]), "Component product not found");
        }
        complexProducts[_serialNumber] = _containingProducts;
        emit ProductTracker__AddComplexProduct(
            _serialNumber, 
            _containingProducts, 
            block.timestamp);
    }

    function updateComplexProduct(uint _serialNumber, uint[] memory _containingProducts) public {
        require(productExists(_serialNumber), "Complex product not found");
        for (uint i = 0; i < _containingProducts.length; i++) {
            require(productExists(_containingProducts[i]), "Component product not found");
        }
        complexProducts[_serialNumber] = _containingProducts;
        emit ProductTracker__UpdateComplexProduct(
            _serialNumber, 
            _containingProducts, 
            block.timestamp);
    }

    function getProduct(uint _serialNumber) public view returns (string memory) {
        return products[_serialNumber];
    }

    function getComplexProduct(uint _serialNumber) public view returns (uint[] memory) {
        return complexProducts[_serialNumber];
    }

    function productExists(uint _serialNumber) public view returns (bool) {
        return bytes(products[_serialNumber]).length > 0;
    }
}
