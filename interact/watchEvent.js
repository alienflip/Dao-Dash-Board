const Web3 = require('web3');
const ENV = require("../ENV.json");
const fetchContract = require("./utils/fetchContractABI");

async function main () {
    let web3 = undefined;
    let network = process.argv[2];
    switch(network){
        case "rinkeby":
            web3 = new Web3(ENV.WSSINFURA_END_POINT + ENV.INFURA_API_KEY);
            break;
        case "metis":
            web3 = new Web3(new Web3.providers.WebsocketProvider(ENV.WSSMetis));
            break;
        case "harmony":
            web3 = new Web3(ENV.WSSHarmony);
            break;
        default:
            console.log("Remember to select network");
    }
    
    web3.eth.accounts.wallet.add(ENV.PRIVATE_KEY);

    try{
        const contractVars = await fetchContract(web3);

        const startBlock = await web3.eth.getBlockNumber();
        contractVars.contract.events
            .informVoters({ fromBlock: startBlock, step: 0 })
            .on('connected', (connected) => {
                console.log(connected);
            })
            .on('data', async event => {
                let eventParse = {
                    roundIsActve: event.returnValues.roundIsActve,
                    timeLeftInRound: event.returnValues.timeLeftInRound,
                    currentVoteType: web3.utils.hexToAscii(event.returnValues.currentVoteType).replace(/[\x00]/g, ''),
                    proposedAddress: event.returnValues.proposedAddress,
                    thresholdVotes: event.returnValues.thresholdVotes,
                    msg: web3.utils.hexToAscii(event.returnValues.msg).replace(/[\x00]/g, '')
                }
                console.log(eventParse);
            })
            .on('changed', function (event) {})
            .on('error', function (error, receipt) {
                console.log('locked error: ' + error);
                console.log('locked error receipt: ' + receipt);
            });
    }catch(e){
        console.log(e);
    }
}

main();