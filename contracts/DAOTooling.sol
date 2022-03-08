/*
 * SPDX-License-Identifier: MIT
 */
 
pragma solidity ^0.8.1;

contract DAOTooling {

    // event system for informing voters of this round information
    event informVoters (
        bool roundIsActve,
        uint256 timeLeftInRound,
        bytes currentVoteType,
        address proposedAddress,
        uint256 proposedAmount,
        uint256 thresholdVotes,
        bytes msg
    );

    // 50 block vote time
    uint256 voteTime = 50;

    // accepted vote proposal types
    bytes addMember = "Add Member";
    bytes removeMember = "Remove Member";
    bytes addToken = "Add Token";
    bytes removeToken = "Remove Token";
    bytes changeFee = "Change Fee";

    // DAO membership, tokens whitelist, fee
    mapping (address => bool) DAO;
    mapping (address => bool) tokens;
    address[] DAOTracker;
    uint256 fee;

    // voting history
    mapping (uint256 => mapping(address => bool)) voteRegister;

    // current round information
    uint256 voteRound = 0;
    bool voteIsActive = false;
    bytes currentVoteType = "unassigned";
    address proposedAddress = address(0);
    uint256 proposedAmount = 0;
    uint256 thresholdVotes = 2;

    // initialise the DAO with base members
    constructor (address member0, address member1, address member2) {
        DAO[member0] = true;
        DAO[member1] = true;
        DAO[member2] = true;
        DAOTracker.push(member0);
        DAOTracker.push(member1);
        DAOTracker.push(member2);
    }

    // allow DAO members to initiate a vote
    function suggestVote (address newAddress, uint256 newAmount, bytes memory voteType) external {
        require (DAO[msg.sender]);
        require (voteIsActive == false); 
        voteIsActive = true;
        voteRound = block.number;
        currentVoteType = voteType;
        voteRegister[voteRound][msg.sender] = true;
        proposedAddress = newAddress;
        proposedAmount = newAmount;

        getVoteDetails("Genesis Vote!");
    }

    function addVote () external {
        require (DAO[msg.sender]);
        require (voteIsActive);
        require (voteTime - (block.number - voteRound) > 0);
        require (!voteRegister[voteRound][msg.sender]);
        voteRegister[voteRound][msg.sender] = true;

        getVoteDetails("New Vote!");
    }

    function completeVote () external {
        require (DAO[msg.sender]);
        require (voteIsActive);
        require (block.number >= voteRound + voteTime);

        // count valid votes
        uint voteCount = 0;
        for (uint i = 0; i < DAOTracker.length; i++){
            if(voteRegister[voteRound][DAOTracker[i]]){
                if(DAOTracker[i] != address(0)){
                    voteCount++;
                }
            }
        }

        // execute output based on threshold
        if(voteCount >= thresholdVotes){
            // handle updating DAO membership
            if(compareBytes(currentVoteType, addMember)){
                DAO[proposedAddress] = true;
                updateThresholdVotes();
            }
            else if (compareBytes(currentVoteType, removeMember)){
                DAO[proposedAddress] = false;
                for (uint i = 0; i < DAOTracker.length; i++){
                    if(DAOTracker[i] == proposedAddress){
                        DAOTracker[i] = address(0);
                        updateThresholdVotes();
                    }
                }
            }

            // handle updating tokens list
            else if(compareBytes(currentVoteType, addToken)){
                tokens[proposedAddress] = true;
            }
            else if (compareBytes(currentVoteType, removeToken)){
                tokens[proposedAddress] = false;
            }
        }

        fee = proposedAmount;
        voteIsActive = false;

        getVoteDetails("Voting end!");
    }

    // used for checking vote type
    function compareBytes (bytes memory bytes_0, bytes memory bytes_1) private pure returns (bool) {
        return keccak256(bytes_0) == keccak256(bytes_1);
    }

    function updateThresholdVotes () private {
        uint256 currDAOSize = DAOTracker.length;
        if(currDAOSize % 2 == 0) {
            thresholdVotes = currDAOSize / 2;
        }
        else{
            thresholdVotes = (currDAOSize / 2) + 1;
        }
    }

    function getVoteDetails(bytes memory message) public {
        emit informVoters (
            voteIsActive,
            voteTime - (block.number - voteRound),
            currentVoteType,
            proposedAddress,
            proposedAmount,
            thresholdVotes,
            message
        );
    }

    function recieveEther () public payable {}
}