import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract, keccak256, toUtf8Bytes, ethers } from "ethers";
import './App.css';

const contractAddress = '0xe9e0453eC5e34754639E7b5e32E643b30c4a4D66';
const contractABI = [
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
        "inputs": [
            {
                "internalType": "bool",
                "name": "_vote",
                "type": "bool"
            },
            {
                "internalType": "bytes32",
                "name": "_signatureHash",
                "type": "bytes32"
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
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "signatureHash",
                "type": "bytes32"
            }
        ],
        "name": "Voted",
        "type": "event"
    }
];

function VotingApp() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [yesCount, setYesCount] = useState(0);
    const [noCount, setNoCount] = useState(0);

    // Función para inicializar la conexión y el contrato
    useEffect(() => {
        async function init() {
            if (window.ethereum) {
                try {
                    const providerInstance = new BrowserProvider(window.ethereum);
                    const signerInstance = await providerInstance.getSigner();
                    const contractInstance = new Contract(contractAddress, contractABI, signerInstance);
    
                    setProvider(providerInstance);
                    setSigner(signerInstance);
                    setContract(contractInstance);

                    // Llamada para cargar los votos actuales
                    await loadVotes(contractInstance);
                } catch (error) {
                    console.error("Error durante la inicialización:", error);
                }
            } else {
                console.error("MetaMask no está disponible.");
            }
        }
        init();
    }, []);

    // Función para cargar votos actuales
    const loadVotes = async (contractInstance) => {
        try {
            const yesVotes = await contractInstance.yesVotes();
            const noVotes = await contractInstance.noVotes();
            
            setYesCount(parseInt(yesVotes.toString()));
            setNoCount(parseInt(noVotes.toString()));
        } catch (error) {
            console.error("Error al cargar votos:", error);
        }
    };

    const handleVote = async (userVote) => {
        if (!signer) console.error("Signer no inicializado");
        if (!contract) console.error("Contrato no inicializado");

        if (!signer || !contract) {
            console.error("El contrato o el firmante no están inicializados.");
            return;
        }

        try {
            const message = JSON.stringify({ vote: userVote ? "yes" : "no" });
            const signature = await signer.signMessage(message);
            const signatureHash = keccak256(toUtf8Bytes(signature));

            const tx = await contract.vote(userVote, signatureHash);
            await tx.wait();

            // Actualizar los votos después de votar
            await loadVotes(contract);
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
                <button onClick={() => handleVote(true)} className="yes">Vote Yes</button>
                <button onClick={() => handleVote(false)} className="no">Vote No</button>
            </div>
        </div>
    );
}

export default VotingApp;