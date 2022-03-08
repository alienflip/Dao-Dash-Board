const executeTransaction = require("./utils/executeTransaction");
const ENV = require("../ENV.json");
const fetchNetwork = require("./utils/networkSelect");
const fetchContract = require("./utils/fetchContractABI");
const chooseAccount = require("./utils/accountSelect");

async function addVote () {
    let web3 = await fetchNetwork();

    const senderAcct = await chooseAccount();
    const gas = 8018493;

    web3.eth.accounts.wallet.add(senderAcct.pk);
    
    try{
        const contractVars = await fetchContract(web3);
        const abi = contractVars.contract.methods.addVote().encodeABI();
        await executeTransaction(web3, abi, contractVars.addressContract.toString(), senderAcct.pk, gas);
        process.exit();
    } catch (e){
        console.log(e);
        process.exit();
    }
};

addVote();