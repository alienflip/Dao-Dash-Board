const {promises:fs} = require("fs");
const Contract = require("../../artifacts/contracts/DAOTooling.sol/DAOTooling.json");

async function fetchContract (web3) {
    let addressContract = await fs.readFile("./addressContract.txt");     
    const contract = await new web3.eth.Contract(
        Contract.abi,
        addressContract.toString()
    );
    const retVals = {
        addressContract : addressContract,
        contract : contract
    };
    return retVals;
};
module.exports = fetchContract;