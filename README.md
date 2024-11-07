# Voting DApp

This decentralized application (DApp) allows users to vote "Yes" or "No" on a proposal. Votes are recorded on a blockchain smart contract, ensuring each vote is unique and securely authenticated.

## Overview

This project includes:
- **Smart Contract in Solidity**: Manages the voting process and ensures each user can vote only once.
- **React Frontend**: A user interface that connects with a wallet, displays results, and enables voting.

## Smart Contract (`Voting.sol`)

### Main Functions

1. **`vote(bool _vote, bytes32 _signatureHash)`**: Allows users to cast a "Yes" or "No" vote. The vote is recorded on-chain, ensuring each address can only vote once.
2. **`getYesVotes()`** and **`getNoVotes()`**: Retrieve the current count of "Yes" and "No" votes.

### Events

- **`Voted(address indexed voter, bool vote, bytes32 signatureHash)`**: Emitted each time a user votes, recording their choice and the signature hash.

## Frontend (`App.js`)

### Features

1. **Wallet Connection**: On page load, the app prompts the user to connect a wallet (e.g., MetaMask) and establishes the smart contract for interaction.
2. **Vote Display**: Shows the current "Yes" and "No" vote counts.
3. **Voting Functionality**: Users can vote "Yes" or "No," and the app generates a signature hash sent to the contract for authentication.

### Key Functions in `App.js`

1. **`loadVotes`**: Loads the current votes from the contract and displays them in the UI.
2. **`handleVote`**: Submits the selected vote to the contract, generates a signature hash, and updates the vote count after confirmation.

## Requirements

- **Solidity 0.8.28**: To compile the contract.
- **Node.js and npm**: For managing frontend dependencies.
- **ethers.js**: A library to interact with the blockchain from the frontend.
