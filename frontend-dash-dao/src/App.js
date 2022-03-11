import './App.css';
import contract from './contracts/dao.json';
import { useEffect, useState } from 'react';
import {ethers} from 'ethers';
import { hexlify } from 'ethers/lib/utils';

const abi = contract.abi;
const contractAddress = "0x903cb21bF52fD61b25ebEB4EAa74BF0571953a55";

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

  const getVoteDetailsHandler = async () => {
      try{
          const {ethereum} = window;
          if(ethereum){
              const provider = new ethers.providers.Web3Provider(ethereum);
              const signer = provider.getSigner();
              const contract = new ethers.Contract(contractAddress, abi, signer);
  
              const dummy = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("yo wassup"));
              let tx = await contract.getVoteDetails(dummy);
  
              await tx.wait();
              console.log(tx.hash);

              let voteDetailsOut = {
                "round is active" : undefined,
                "time left in round" : undefined,
                "vote type" : undefined,
                "proposed address" : undefined,
                "proposed amount" : undefined,
                "threshold votes" : undefined,
                "sender message" : undefined
              }
            
              const filterFrom = contract.filters.informVoters();
              let block = await provider.getBlockNumber();
              let voteDetails = await contract.queryFilter(filterFrom, block - 1, block)
              const currentVote = voteDetails[0];
              voteDetailsOut["round is active"] = currentVote.args[0]
              voteDetailsOut["time left in round"] = currentVote.args[1].toString()
              voteDetailsOut["vote type"] = hex2a(currentVote.args[2].toString())
              voteDetailsOut["proposed address"] = currentVote.args[3].toString()
              voteDetailsOut["proposed amount"] = currentVote.args[4].toString()
              voteDetailsOut["threshold votes"] = currentVote.args[5].toString()
              voteDetailsOut["sender message"] = hex2a(currentVote.args[6].toString())
              console.log(voteDetailsOut);
          } else {
              console.log("Ethereum object not found");
          }
      } catch(e) {
          console.log(e);
      }
  }

  const addVoteHandler = async () => {
    try{
        const {ethereum} = window;
        if(ethereum){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);

            let tx = await contract.addVote();
  
            await tx.wait();
            console.log(tx.hash);
        } else {
            console.log("Ethereum object not found");
        }
    } catch(e) {
        console.log(e);
    }
  }

  const completeRoundHandler = async () => {
    try{
        const {ethereum} = window;
        if(ethereum){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);
            
            let tx = await contract.completeVote();
  
            await tx.wait();
            console.log(tx.hash);
        } else {
            console.log("Ethereum object not found");
        }
    } catch(e) {
        console.log(e);
    }
  }

  const addValidatorHandler = async (address) => {
    try{
        const {ethereum} = window;
        if(ethereum){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);

            const type = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Add Member"));
            
            let tx = await contract.suggestVote(address, 0, type);
  
            await tx.wait();
            console.log(tx.hash);
        } else {
            console.log("Ethereum object not found");
        }
    } catch(e) {
        console.log(e);
    }
  }

  const removeValidatorHandler = async (address) => {
    try{
        const {ethereum} = window;
        if(ethereum){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);

            const type = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Remove Member"));
            
            let tx = await contract.suggestVote(address, 0, type);
  
            await tx.wait();
            console.log(tx.hash);
        } else {
            console.log("Ethereum object not found");
        }
    } catch(e) {
        console.log(e);
    }
  }

  const addTokenHandler = async (address) => {
    try{
        const {ethereum} = window;
        if(ethereum){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);

            const type = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Add Token"));
            
            let tx = await contract.suggestVote(address, 0, type);
  
            await tx.wait();
            console.log(tx.hash);
        } else {
            console.log("Ethereum object not found");
        }
    } catch(e) {
        console.log(e);
    }
  }

  const removeTokenHandler = async (address) => {
    try{
        const {ethereum} = window;
        if(ethereum){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);

            const type = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Remove Token"));
            
            let tx = await contract.suggestVote(address, 0, type);
  
            await tx.wait();
            console.log(tx.hash);
        } else {
            console.log("Ethereum object not found");
        }
    } catch(e) {
        console.log(e);
    }
  }

  const changeFeeHandler = async (fee) => {
    try{
        const {ethereum} = window;
        if(ethereum){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);

            const zeroAddr = "0x0000000000000000000000000000000000000000";
            const type = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Change Fee"));

            let tx = await contract.suggestVote(zeroAddr, fee, type);
  
            await tx.wait();
            console.log(tx.hash);
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

  const onSubmitFormVote = (event) => {
    event.preventDefault();
    addVoteHandler();
  };

  const onSubmitFormComplete = (event) => {
    event.preventDefault();
    completeRoundHandler();
  };

  const onSubmitFormValidatorAdd = (event) => {
    event.preventDefault();
    const { name } = event.target;
    setData({
      name: name.value
    });
    addValidatorHandler(name.value);
  };

  const onSubmitFormValidatorRemove = (event) => {
    event.preventDefault();
    const { name } = event.target;
    setData({
      name: name.value
    });
    removeValidatorHandler(name.value);
  };

  const onSubmitFormTokenAdd = (event) => {
    event.preventDefault();
    const { name } = event.target;
    setData({
      name: name.value
    });
    addTokenHandler(name.value);
  };

  const onSubmitFormTokenRemove = (event) => {
    event.preventDefault();
    const { name } = event.target;
    setData({
      name: name.value
    });
    removeTokenHandler(name.value);
  };

  const onSubmitFormFee = (event) => {
    event.preventDefault();
    const { name } = event.target;
    setData({
      name: name.value
    });
    changeFeeHandler(name.value);
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
          <button onClick={getVoteDetailsHandler} className='cta-button get-vote'>
              Click for current round details!
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

  const addVoteButton = () => {
    return(
        <button onClick={onSubmitFormVote} className='cta-button get-vote'>
            Click to add a vote in this round!
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