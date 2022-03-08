const Web3 = require('web3');
const ENV = require("../../ENV.json");

async function chooseNetwork () {
    let network = process.argv[2];
    switch(network){
        case "rinkeby":
            return await new Web3(ENV.WSSINFURA_END_POINT + ENV.INFURA_API_KEY);
        case "metis":
            return await new Web3(new Web3.providers.HttpProvider(ENV.METIS_END_POINT));
        case "harmony":
            return await new Web3(ENV.HARMONY_END_POINT);
        default:
            console.log("Remember to select network");
    }
}
module.exports = chooseNetwork;