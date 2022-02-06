import {useEffect,useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AllSafe from './safe/allsafe';


export default function Welcome()  {
	
	const isConnected = useSelector((state) => state?.connection?.isConnected);
	const primaryAcc = useSelector((state) => state?.connection?.account);

	const [welcomeText,setwelcomeText] = useState("Connect Wallet"); 

	useEffect(()=>{

    let isCancelled = false;
     if (!isCancelled) {
          setWelcome();
     }

     return () => {
      isCancelled = true;
    };
  },[isConnected]);


   const setWelcome = () => {
		  setwelcomeText(isConnected?"Welcome "+shortAddress(primaryAcc) :"Please Connect your wallet" )
   }

   const shortAddress = (address) => {
        if(!address){
            return;
        }
        let len = address.length;
        return address.substring(0,6)+"..."+address.substring(len-4,len);
  }

	return(
		<>
			<div className="flex flex-col">
				
				<p className="mx-auto">{welcomeText}</p>

				{isConnected&&
					<AllSafe account={primaryAcc} />
				}
			</div>
		</>
	)
}