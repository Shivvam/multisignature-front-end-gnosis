const { ethers } = require("ethers");






const { abi } = require("../../../artifacts/contracts/Wallet.sol/Wallet.json"); // abi to use the multi-sig wallet. 
const { bytecode } = require("../../../artifacts/contracts/Wallet.sol/Wallet.json");

 

const deployWallet = async (req,res) => {
 
    const provider = new ethers.providers.Web3Provider(ethereum);
    await provider.send("eth_requestAccounts", []);

 
    const signer = provider.getSigner()


	const {owners,threshold} = req.body;
  
    try {
        const walletFactory = new ethers.ContractFactory(abi, bytecode, signer);
        const wallet = await walletFactory.deploy(owners, threshold);
        // The output of this address needs to be saved in a database, a key - value pair. Key = wallet address, value = owners.
        console.log(`Wallet succesfully created, address -> ${wallet.address}`);
    } catch (e) {
        console.error(e);
    }
	
	if(error){
		res.status(400).json({error:error.message})
	}else{
		res.status(200).json({walletAddress})
	}
}






export default deployWallet;