import supabase from '../../lib/services/supabase';

 

const AddWalletToDB = async (req,res) => {
     
	
	const {accounts,walletAddress} = req.body;
 
	let {data,error} = await supabase.from('wallets').insert({
			walletAddress,
			accounts
	})
 
 

	 
	
	if(error){
		res.status(400).json({error:error.message})
	}else{
		res.status(200).json({data})
	}


}



export default AddWalletToDB;