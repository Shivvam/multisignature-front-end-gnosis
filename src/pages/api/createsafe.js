import supabase from '../../lib/services/supabase';

 

const Allsafe = async (req,res) => {
     
	
	const {account,safeval} = req.body;

	let safevalToUpdate = [];

	let {data:ifsafe,error1} = await supabase.from('users').select("allsafe").eq('primary_account',account);
	
	if(ifsafe[0]?.allsafe&&(ifsafe[0]?.allsafe.length>0)){
	    
		safevalToUpdate = ifsafe[0]?.allsafe;

	}

	

	safevalToUpdate.push(safeval);

	console.log(safevalToUpdate);

	let {data:allsafe,error2} = await supabase.from('users').update({"allsafe":safevalToUpdate}).eq('primary_account',account);
 

	 
	
	if(error2){
		res.status(400).json({error:error.message})
	}else{
		res.status(200).json({allsafe})
	}


}



export default Allsafe;