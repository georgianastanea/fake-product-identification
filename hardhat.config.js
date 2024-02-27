require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 31337
    },
    sepolia: {
      chainId: 11155111,
      url: "https://eth-sepolia.g.alchemy.com/v2/-YHv43SlfvwpCBLw9kpBiJWBMTtufCqS",
      accounts: ["580d19ac03d1efbc92e26e04981297efea582b8b52e3e40b69d094bb510fac68"]
    }
  }
};
