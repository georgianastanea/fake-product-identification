const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying the smart contract...");
    const ProductTracker = await ethers.getContractFactory("ProductTracker");
    const accounts = await ethers.getSigners();

    // Deploy the contract
    const productTracker = await ProductTracker.connect(accounts[0]).deploy();
    await productTracker.deployed();
    //.waitForDeployment()

    console.log(`ProductTracker is deployed at address: ${productTracker.address}`);
    //.target if it doesn t work
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
