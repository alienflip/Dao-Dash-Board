async function executeTransaction(web3, data, to, clientEthPrivateKey, gas) {
  const transaction = {
    to: to,
    gas: gas,
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
  
module.exports = executeTransaction;