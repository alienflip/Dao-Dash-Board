const {promises:fs} = require('fs')
const ENV = require("../ENV.json");

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const baseContract = await ethers.getContractFactory("DAOTooling");
    const contract = await baseContract.deploy(
        ENV.acct_0.addr,
        ENV.acct_1.addr,
        ENV.acct_2.addr
    );

    await fs.writeFile('./addressContract.txt', contract.address, (err) => {
        if (err) throw err;
    });

    console.log("Deployed to : ", contract.address);
}
  
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});