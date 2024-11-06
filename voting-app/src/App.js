import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract, ethers } from "ethers";
import './App.css';

const contractAddress = '0xd499DE88c1000751Fe13981261Ed499cF82f0D48';
const contractABI = [
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
	},
	{
		"inputs": [],
		"name": "getNoVotes",
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
		"name": "getYesVotes",
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

function VotingApp() {
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
                    const signerInstance = await providerInstance.getSigner();
                    const contractInstance = new Contract(contractAddress, contractABI, signerInstance);

                    setProvider(providerInstance);
                    setSigner(signerInstance);
                    setContract(contractInstance);
                } catch (error) {
                    console.error("Error durante la inicialización:", error);
                }
            } else {
                console.error("MetaMask no está disponible.");
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
            // Crear el mensaje con el voto
            const message = JSON.stringify({ vote: userVote ? "yes" : "no" });
            
            // Firmar el mensaje
            const signature = await signer.signMessage(message);
            
            // Convertir la firma a bytes32 usando keccak256
            const signatureHash = ethers.keccak256(ethers.toUtf8Bytes(signature));
    
            console.log("Firma hash:", signatureHash);
    
            // Llamada al contrato con los parámetros correctos
            const tx = await contract.vote(userVote, signatureHash);
            await tx.wait();
    
            // Obtener los resultados de la votación
            const yesVotes = await contract.yesVotes();
            const noVotes = await contract.noVotes();
            setYesCount(yesVotes.toNumber());
            setNoCount(noVotes.toNumber());
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
