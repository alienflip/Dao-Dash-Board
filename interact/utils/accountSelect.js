const ENV = require("../../ENV.json");

async function chooseAccount () {
    let account = process.argv[3];
    switch(account){
        case "0":
            return ENV.acct_0;
        case "1":
            return ENV.acct_1;
        case "2":
            return ENV.acct_2;
        default:
            console.log("Remember to select account");
    }
}
module.exports = chooseAccount;