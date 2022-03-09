import './App.css';
import contract from './contracts/dao.json';
import { useEffect, useState } from 'react';
import {ethers} from 'ethers';

const abi = contract.abi;
const contractAddress = "0xe77df3C92062F73f7bCc56074D72587f48ea3bc3";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);

  const [data, setData] = useState({
    input: ""
  });

  const onSubmitFormTokenAdd = (event) => {
    event.preventDefault();
    const { input } = event.target;
    setData({
      input: input.value
    });
  };

  const onSubmitFormTokenRemove = (event) => {
    event.preventDefault();
    const { input } = event.target;
    setData({
      input: input.value
    });
  };

  const onSubmitFormValidatorAdd = (event) => {
    event.preventDefault();
    const { input } = event.target;
    setData({
      input: input.value
    });
  };

  const onSubmitFormValidatorRemove = (event) => {
    event.preventDefault();
    const { input } = event.target;
    setData({
      input: input.value
    });
  };

  const onSubmitFormVote = (event) => {
    event.preventDefault();
    const { input } = event.target;
    setData({
      input: input.value
    });
  };

  const onSubmitFormComplete = (event) => {
    event.preventDefault();
    const { input } = event.target;
    setData({
      input: input.value
    });
  };

  const onSubmitFormFee = (event) => {
    event.preventDefault();
    const { input } = event.target;
    setData({
      input: input.value
    });
  };

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
              const nftContract = new ethers.Contract(contractAddress, abi, signer);
  
              let nftTx = await nftContract.getVoteDetails("dummy");
  
              await nftTx.wait();
              console.log(nftTx.hash);
          } else {
              console.log("Ethereum object not found");
          }
      } catch(e) {
          console.log(e);
      }
  }

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
              aramisDAO
          </h1>
          <h4>
              (best i get at frontend development)
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
              <input type="text" name="input-validator" />
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
              <input type="text" name="input-validator" />
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
              <input type="text" name="input-token" />
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
              <input type="text" name="input-token" />
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
              <input type="text" name="input-token" />
              <input type="Submit" />
            </form>
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
      </div>
  )
}

export default App;