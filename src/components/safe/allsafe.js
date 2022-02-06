import {useEffect,useState} from 'react';

import { useSelector, useDispatch } from 'react-redux';
import CreateSafeModal from './createsafe'
import SafeTable from './safetable'

export default function AllSafe({account})  { 
  const allSafeByThisUser = useSelector((state) => state?.connection?.allsafe);
  const [welcomeText,setwelcomeText] = useState("Looking for Safe..."); 
  const [isSafeCreated,setisSafeCreated] = useState(false);
 

  useEffect(()=>{

    let isCancelled = false;
     if (!isCancelled) {
          initAllSafe();
     }

     return () => {
      isCancelled = true;
    };
  },[allSafeByThisUser.length]);

  const initAllSafe = () => {
     if(allSafeByThisUser.length>0){
        setwelcomeText("Your Safe Wallets");
        setisSafeCreated(true);
     }else{
          setwelcomeText("No Safe found ! Create a Safe to get Started");
          setisSafeCreated(false);
     }
     
  }


  
  const getAllSafeByThisAccount = async (acc) => {
    const response = await fetch('/api/allsafe',{
        method : "POST",
        body : JSON.stringify({
            account : acc
        }),
        headers:{
            "Content-Type" : "application/json"
        }
    });

    const {allsafe} = await response.json();
    if(allsafe[0]?.allsafe!=undefined){
       setwelcomeText("Your Safe Wallets");
       setisSafeCreated(true);
       setallSafeByThisUser(allsafe[0]?.allsafe);
    }else{
        setisSafeCreated(false);
        setwelcomeText("No Safe found ! Create a Safe to get Started");
        setallSafeByThisUser([]);
    }
  }


  

	return(
		<>
			<div className="flex flex-col">
				<div className="mx-auto">
                    <p>{welcomeText} </p>
                </div>
                <div>
                    {isSafeCreated&&
                      <SafeTable allsafe={allSafeByThisUser} /> 
                    }

              
                </div>
                <div>
                     <CreateSafeModal primaryAccount={account}/>
                </div>

			</div>
		</>
	)
}