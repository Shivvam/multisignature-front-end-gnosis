import supabase from '../../services/supabase';
import jwt from 'jsonwebtoken'
const connectAPI = async (req,res) => {

	const {account} = req.body;

	let {data,error} = await supabase.from('users').select('primary_account').eq('primary_account',account);
	let token = null;

	
	if(data.length>0){
		 token = jwt.sign(
			{
			  "aud": "authenticated",
			  "exp": Math.floor((Date.now()/1000)+(60*60*24)),
			  "sub": data[0].id,
			  "user_metadata": {
				id : data[0].id
			  },
			  "role": "authenticated"
			}
		,process.env.NEXT_SUPABASE_JWT_SECRET)

	}else{
		let {data,error} = await supabase.from('users').insert({
			'primary_account' : account
		})
		token = jwt.sign(
			{
			  "aud": "authenticated",
			  "exp": Math.floor((Date.now()/1000)+(60*60*24)),
			  "sub": data.id,
			  "user_metadata": {
				id : data.id
			  },
			  "role": "authenticated"
			}
		,process.env.NEXT_SUPABASE_JWT_SECRET)
	}

	if(error){
		res.status(400).json({error:error.message})
	}else{
		res.status(200).json({data,token})
	}


}



export default connectAPI;