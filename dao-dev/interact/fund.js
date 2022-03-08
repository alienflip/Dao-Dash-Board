const fetchNetwork = require("./utils/networkSelect");
const fetchContract = require("./utils/fetchContractABI");
const chooseAccount = require("./utils/accountSelect");

let web3 = undefined;

async function executeTransaction(web3, data, to, clientEthPrivateKey, gas) {

    const transaction = {
        to: to,
        gas: gas,
        value: 10000000000,
        data: data
    };
  
    const signedTx = await web3.eth.accounts.signTransaction(
        transaction,
        clientEthPrivateKey
    );
  
    await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (error, hash) {
            if (!error) {
            console.log("Hash ", hash);
            } else {
            console.log(error);
            }
        }
    );
}

async function fund () {

    const senderAcct = await chooseAccount();
    const gas = 58779;

    web3.eth.accounts.wallet.add(senderAcct.pk);
    
    try{
        const contractVars = await fetchContract(web3);
        const abi = contractVars.contract.methods.recieveEther().encodeABI();
        await executeTransaction(web3, abi, contractVars.addressContract.toString(), senderAcct.pk, gas);
        process.exit();
    } catch (e){
        console.log(e);
        process.exit();
    }
};

async function main () {
    web3 = await fetchNetwork ();
    await fund ();
}

main();