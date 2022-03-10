import './App.css';
import contract from './contracts/dao.json';
import { useEffect, useState } from 'react';
import {ethers} from 'ethers';
import { hexlify } from 'ethers/lib/utils';

const abi = contract.abi;
const contractAddress = "0x903cb21bF52fD61b25ebEB4EAa74BF0571953a55";
const zeroAddr = "0x0000000000000000000000000000000000000000";

function hex2a(hex) {
  var str = '';
  for (var i = 0; i < hex.length; i += 2) {
      var v = parseInt(hex.substr(i, 2), 16);
      if (v) str += String.fromCharCode(v);
  }
  return str;
}  

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
      const{ethereum} = window;
      if(!ethereum){
          console.log("Install MetaMask!");
          return;
      }else{
          console.log("LFG!");
      }

      const accounts = await ethereum.request({method: 'eth_accounts'});
      if(accounts.length !== 0){
          const account = accounts[0];
          setCurrentAccount(account);
      }else{
          console.log("No authorised accounts");
      }
  }

  const connectWalletHandler = async () => {
      const{ethereum} = window;
      if(!ethereum){
          console.log("Install MetaMask!");
          return;
      }else{
          console.log("LFG!");
      }

      try{
          const accounts = await ethereum.request({method:'eth_requestAccounts'});
          setCurrentAccount(accounts[0]);
       }catch(e){
           console.log(e);
       }
  }

  const contractHandler = async (type, address, fee) => {
    try{
        const {ethereum} = window;
        if(ethereum){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);
            let type_ = undefined;
            let tx = undefined;

            switch(type){
              case "voteDetails":
                const dummy = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("get-logs"));
                tx = await contract.getVoteDetails(dummy);
                break;
              case "addVote":
                tx = await contract.addVote();
                break;
              case "completeVote":
                tx = await contract.completeVote();
                break;
              case "newValidator":
                type_ = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Add Member"));
                tx = await contract.suggestVote(address, 0, type_);
                break;
              case "removeValidator":
                type_ = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Remove Member"));
                tx = await contract.suggestVote(address, 0, type_);
                break;
              case "addToken":
                type_ = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Add Token"));
                tx = await contract.suggestVote(address, 0, type_);
                break;
              case "removeToken":
                type_ = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Remove Token"));
                tx = await contract.suggestVote(address, 0, type_);
                break;
              case "changeFee":
                type_ = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Change Fee"));
                tx = await contract.suggestVote(zeroAddr, fee, type_);
                break;
              default:
                break;
            }
  
            await tx.wait();

            if(type == "voteDetails") {
              const filterFrom = contract.filters.informVoters();
              let voteDetails = await contract.queryFilter(filterFrom, 0, -20)
              const currentVote = voteDetails[0];
              console.log("round is active: ", currentVote.args[0])
              console.log("time left in round: ", currentVote.args[1].toString())
              console.log("vote type: ", hex2a(currentVote.args[2].toString()))
              console.log("proposed address: ", currentVote.args[3].toString())
              console.log("proposed amount: ", currentVote.args[4].toString())
              console.log("threshold votes: ", currentVote.args[5].toString())
              console.log("sender message: ", hex2a(currentVote.args[6].toString()))
            }
        } else {
            console.log("Ethereum object not found");
        }
    } catch(e) {
        console.log(e);
    }
  }

  const [data, setData] = useState({
    name: ""
  });

  const onSubmitFormVoteDetails = (event) => {
    event.preventDefault();
    contractHandler("voteDetails", zeroAddr, 0);
  };

  const onSubmitFormVote = (event) => {
    event.preventDefault();
    contractHandler("addVote", zeroAddr, 0);
  };

  const onSubmitFormComplete = (event) => {
    event.preventDefault();
    contractHandler("completeVote", zeroAddr, 0);
  };

  const onSubmitFormValidatorAdd = (event) => {
    event.preventDefault();
    const { name } = event.target;
    setData({
      name: name.value
    });
    contractHandler("newValidator", name.value, 0);
  };

  const onSubmitFormValidatorRemove = (event) => {
    event.preventDefault();
    const { name } = event.target;
    setData({
      name: name.value
    });
    contractHandler("removeValidator", name.value, 0);
  };

  const onSubmitFormTokenAdd = (event) => {
    event.preventDefault();
    const { name } = event.target;
    setData({
      name: name.value
    });
    contractHandler("addToken", name.value, 0);
  };

  const onSubmitFormTokenRemove = (event) => {
    event.preventDefault();
    const { name } = event.target;
    setData({
      name: name.value
    });
    contractHandler("removeToken", name.value, 0);
  };

  const onSubmitFormFee = (event) => {
    event.preventDefault();
    const { name } = event.target;
    setData({
      name: name.value
    });
    contractHandler("changeFee", zeroAddr, name.value);
  };

  const connectWalletButton = () => {
    return(
        <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
            Connect wallet!
        </button>
    )
  };

  const getVoteDetailsButton = () => {
      return(
          <button onClick={onSubmitFormVoteDetails} className='cta-button get-vote'>
              Click for current round details!
          </button>
      )
  };

  const addVoteButton = () => {
    return(
        <button onClick={onSubmitFormVote} className='cta-button get-vote'>
            Click to add a vote in this round!
        </button>
    )
  };

  const completeVoteButton = () => {
    return(
        <button onClick={onSubmitFormComplete} className='cta-button get-vote'>
            Click to complete voting round!
        </button>
    )
  };

  useEffect(() => {
      checkWalletIsConnected();
  }, []);

  return(
      <div className='main-app'>
          <h1>
              aramidDAO
          </h1>
          <h4>
              (best i get at frontend dev)
          </h4>
          <div>
              {currentAccount ? getVoteDetailsButton() : connectWalletButton()}
          </div>
          <div>
            .
          </div>
          <div>
            {addVoteButton()}
          </div>
          <div>
            .
          </div>
          <div>
            {completeVoteButton()}
          </div>
          <div>
            .
          </div>
          <div>
            .
          </div>
          <div>
            .
          </div>
          <div>
            <form
              onSubmit={(e) => onSubmitFormValidatorAdd(e)}
              style={{ display: "flex", flexDirection: "column"}}
            >
              <label style={{textAlign: "center"}}>Suggest a new validator address</label>
              <input type="text" name="name" />
              <input type="Submit" />
            </form>
          </div>
          <div>
            .
          </div>
          <div>
            <form
              onSubmit={(e) => onSubmitFormValidatorRemove(e)}
              style={{ display: "flex", flexDirection: "column"}}
            >
              <label style={{textAlign: "center"}}>Suggest a validator address to remove</label>
              <input type="text" name="name" />
              <input type="Submit" />
            </form>
          </div>
          <div>
            .
          </div>
          <div>
            <form
              onSubmit={(e) => onSubmitFormTokenAdd(e)}
              style={{ display: "flex", flexDirection: "column"}}
            >
              <label style={{textAlign: "center"}}>Suggest new token address</label>
              <input type="text" name="name" />
              <input type="Submit" />
            </form>
          </div>
          <div>
            .
          </div>
          <div>
            <form
              onSubmit={(e) => onSubmitFormTokenRemove(e)}
              style={{ display: "flex", flexDirection: "column"}}
            >
              <label style={{textAlign: "center"}}>Suggest a token address to remove</label>
              <input type="text" name="name" />
              <input type="Submit" />
            </form>
          </div>
          <div>
            .
          </div>
          <div>
            <form
              onSubmit={(e) => onSubmitFormFee(e)}
              style={{ display: "flex", flexDirection: "column"}}
            >
              <label style={{textAlign: "center"}}>Suggest a new fee</label>
              <input type="text" name="name" />
              <input type="Submit" />
            </form>
          </div>
      </div>
  )
}

export default App;