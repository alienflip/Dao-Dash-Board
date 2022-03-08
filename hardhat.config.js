require("@nomiclabs/hardhat-waffle");
const ENV = require("./ENV.json");

module.exports = {
  solidity: "0.8.1",
  networks: {
    rinkeby: {
      url: ENV.INFURA_END_POINT + ENV.INFURA_API_KEY,
      accounts: [`0x${ENV.PRIVATE_KEY}`]
    },
    metis: {
      url: "https://stardust.metis.io/?owner=588",
      accounts: [`0x${ENV.PRIVATE_KEY}`]
    },
    harmony: {
      url: `https://api.s0.b.hmny.io`,
      accounts: [`0x${ENV.PRIVATE_KEY}`]
    },
  },
};