import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract, ethers } from 'ethers';
import './App.css';

// Dirección del contrato inteligente desplegado en la red Ethereum.
const contractAddress = '0xd6DfC5DD49E8A0185b9501A8d238945cD34A88B5';
// ABI del contrato inteligente para interactuar con sus métodos.
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "_vote",
                "type": "bool"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "voter",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "vote",
                "type": "bool"
            }
        ],
        "name": "Voted",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "getVoteCounts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "voteCountYes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "voteCountNo",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "hasVoted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "noVotes",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "yesVotes",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

function App() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [yesCount, setYesCount] = useState(0);
    const [noCount, setNoCount] = useState(0);

    useEffect(() => {
        async function init() {
            if (window.ethereum) {
                try {
                    const providerInstance = new BrowserProvider(window.ethereum);
                    setProvider(providerInstance);

                    const accounts = await providerInstance.send("eth_accounts", []);
                    if (accounts.length === 0) {
                        await providerInstance.send("eth_requestAccounts", []);
                    }

                    const signerInstance = await providerInstance.getSigner();
                    setSigner(signerInstance);

                    const contractInstance = new Contract(contractAddress, contractABI, signerInstance);
                    setContract(contractInstance);

                    const yesVotes = await contractInstance.yesVotes();
                    const noVotes = await contractInstance.noVotes();

                    setYesCount(parseInt(yesVotes.toString(), 10));
                    setNoCount(parseInt(noVotes.toString(), 10));
                } catch (error) {
                    console.error("Error durante la inicialización:", error);
                }
            } else {
                console.error("Core Wallet no está disponible. Asegúrate de que esté instalado.");
            }
        }
        init();
    }, []);

    const handleVote = async (userVote) => {
        if (!signer || !contract) {
            console.error("El contrato o el firmante no están inicializados.");
            return;
        }

        try {
            const tx = await contract.vote(userVote);
            await tx.wait();

            const yesVotes = await contract.yesVotes();
            const noVotes = await contract.noVotes();
            setYesCount(parseInt(yesVotes.toString(), 10));
            setNoCount(parseInt(noVotes.toString(), 10));
        } catch (error) {
            console.error("Error al votar:", error);
        }
    };

    return (
        <div className="container">
            <h1>Voting with Blockchain</h1>
            <h2>Do you like blockchain?</h2>
            <p>Votes for "Yes": {yesCount}</p>
            <p>Votes for "No": {noCount}</p>
            <p>Total votes: {yesCount + noCount}</p>
            <div className="buttons">
                <button onClick={() => handleVote(true)} className="yes">Votar Sí</button>
                <button onClick={() => handleVote(false)} className="no">Votar No</button>
            </div>
        </div>
    );
}

export default App;
