const { ethers } = require("ethers");
const { abi } = require("../../artifacts/contracts/Wallet.sol/Wallet.json"); // abi to use the multi-sig wallet. 
const { bytecode } = require("../../artifacts/contracts/Wallet.sol/Wallet.json");


    


export const getTotalOwners = async (walletAddress) => {
 const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner()
    const wallet = new ethers.Contract(walletAddress, abi, signer);
    const totalOwners = await wallet.totalOwners();
    return totalOwners.toString();
}

export const getTotalOwnersAddress = async (walletAddress) => {
 const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner()
    const wallet = new ethers.Contract(walletAddress, abi, signer);
    const getOwnersAddres = await wallet.getOwnersAddress();
    return getOwnersAddres;
}

export const getWalletBalance = async (walletAddress) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner()
     const wallet = new ethers.Contract(walletAddress, abi, signer);
     const walletBalance = await provider.getBalance(walletAddress);
     return ethers.utils.formatEther(walletBalance);
}

export const getWalletThreshould = async (walletAddress) => {
     const provider = new ethers.providers.Web3Provider(ethereum);
     const signer = provider.getSigner()
     const wallet = new ethers.Contract(walletAddress, abi, signer);
     const threshold = await wallet.threshold();
     return threshold;
}

export const getWalletPendingTX = async (walletAddress) => {
     const provider = new ethers.providers.Web3Provider(ethereum);
     const signer = provider.getSigner()
     const wallet = new ethers.Contract(walletAddress, abi, signer);
     const pendingTransactionsData  = await wallet.pendingTransactionsData();
     return pendingTransactionsData;
}

export const getWalletPendingUpdateTS = async (walletAddress) => {
     const provider = new ethers.providers.Web3Provider(ethereum);
     const signer = provider.getSigner()
     const wallet = new ethers.Contract(walletAddress, abi, signer);
     const pendingUpdateTSData  = await wallet.pendingUpdatethresholdData();
     return pendingUpdateTSData;
}


export const getOwnersAddress = async (walletAddress) => {
     const provider = new ethers.providers.Web3Provider(ethereum);
     const signer = provider.getSigner()
     const wallet = new ethers.Contract(walletAddress, abi, signer);
     const allowners  = await wallet.getOwnersAddress();
     return allowners;
}

 


 