import supabase from '../../lib/services/supabase';

 

const AllsafeSecondary = async (req,res) => {
     
	const {account} = req.body;
 
	let {data:allsafe,error} = await supabase.from('wallets').select("*").contains("accounts",[account]);
 

	 
	
	if(error){
		res.status(400).json({error:error.message})
	}else{
		res.status(200).json({allsafe})
	}


}



export default AllsafeSecondary;