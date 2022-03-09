const executeTransaction = require("./utils/executeTransaction");
const ENV = require("../ENV.json");
const fetchNetwork = require("./utils/networkSelect");
const fetchContract = require("./utils/fetchContractABI");
const chooseAccount = require("./utils/accountSelect");

let web3 = undefined;

async function getDetails (voteType) {

    const senderAcct = await chooseAccount();
    const gas = 13942700;

    web3.eth.accounts.wallet.add(senderAcct.pk);

    try{
        const contractVars = await fetchContract(web3);
        const abi = contractVars.contract.methods.getVoteDetails(voteType).encodeABI();
        await executeTransaction(web3, abi, contractVars.addressContract.toString(), senderAcct.pk, gas);
        process.exit();
    } catch (e){
        console.log(e);
        process.exit();
    }
};

async function main() {
    web3 = await fetchNetwork();
    const voteType = "dummy";
    var hex = web3.utils.asciiToHex(voteType);
    var voteType_ = web3.eth.abi.encodeParameter('bytes', web3.utils.rightPad(hex, 64));
    await getDetails(voteType_);
}

main();