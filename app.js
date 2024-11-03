const express = require('express');
const ethers = require('ethers');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuración de la dirección y ABI del contrato
const contractAddress = "0xd6DfC5DD49E8A0185b9501A8d238945cD34A88B5";
const contractABI = [
    [
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
        },
        {
            "inputs": [],
            "name": "getVoteCounts",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
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
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "voteSignatureHash",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
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
    ]
];

// Configuración de Express para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para mostrar la página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de la API para obtener el conteo de votos
app.get('/api/votes', async (req, res) => {
    try {
        const provider = new ethers.providers.JsonRpcProvider("http://localhost:3000/");
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const [yesVotes, noVotes] = await contract.getVoteCounts();
        res.json({ yesVotes: yesVotes.toNumber(), noVotes: noVotes.toNumber() });
    } catch (error) {
        console.error("Error obteniendo votos:", error);
        res.status(500).json({ error: "Error obteniendo votos" });
    }
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
