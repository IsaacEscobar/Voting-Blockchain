const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider("http://localhost:3000/"); // Cambia por la URL de la red correcta

async function check() {
    const blockNumber = await provider.getBlockNumber();
    console.log("Block Number: ", blockNumber);
}

check();
