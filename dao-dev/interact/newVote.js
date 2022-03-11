const executeTransaction = require("./utils/executeTransaction");
const ENV = require("../ENV.json");
const fetchNetwork = require("./utils/networkSelect");
const fetchContract = require("./utils/fetchContractABI");
const chooseAccount = require("./utils/accountSelect");

let web3 = undefined;

async function addNewAddr (newAddr, newAmount, voteType) {

    const senderAcct = await chooseAccount();
    const gas = 3508779;

    web3.eth.accounts.wallet.add(senderAcct.pk);
    
    try{
        const contractVars = await fetchContract(web3);
        const abi = contractVars.contract.methods.suggestVote(newAddr, newAmount, voteType).encodeABI();
        await executeTransaction(web3, abi, contractVars.addressContract.toString(), senderAcct.pk, gas);
        process.exit();
    } catch (e){
        console.log(e);
        process.exit();
    }
};

async function main() {
    web3 = await fetchNetwork();
    const newAmount = 1;
    const suggestedMember = "0x0000000000000000000000000000000000000000";
    const voteType = "Remove Member";
    var hex = web3.utils.asciiToHex(voteType);
    var voteType_ = web3.eth.abi.encodeParameter('bytes', web3.utils.rightPad(hex, 64));
    await addNewAddr(suggestedMember, newAmount, voteType_);
}

main();