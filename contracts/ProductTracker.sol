// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract ProductTracker {

    mapping(uint=> string) products;

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

    function addProduct(
        uint _serialNumber,
        string memory _cid
    ) public {
        products[_serialNumber] = _cid;

        emit ProductTracker__AddProduct (
            _serialNumber,
            _cid,
            block.timestamp
        );
    }

    event ProductTracker__DeleteProduct(
        uint serialNumber,
        uint timestamp
    );

    function updateProduct(
        uint _serialNumber,
        string memory _cid
    ) public {
        require(bytes(products[_serialNumber]).length > 0, "Product not found");
        
        products[_serialNumber] = _cid;

        emit ProductTracker__UpdateProduct(
            _serialNumber,
            _cid,
            block.timestamp
        );
    }
    
    function deleteProduct(uint _serialNumber) public {
        require(bytes(products[_serialNumber]).length > 0, "Product not found");
        delete products[_serialNumber];
        emit ProductTracker__DeleteProduct(_serialNumber, block.timestamp);
    }

    function getProduct(uint _serialNumber) public view returns(
        string memory
    ){
        return products[_serialNumber];
    }
}