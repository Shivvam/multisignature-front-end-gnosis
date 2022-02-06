import {useEffect,useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown , faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import {_connect, _disconnect , _setallsafe} from '../../lib/reducers/connectionslice';
import Link from 'next/link';
import {setCookie} from '../lib/utills';


 
import {createClient} from '@supabase/supabase-js'
const supabase =  createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)                                                                                                    // Supabase Client for Setting up  supabase auth from the client
 



export default function Navbar() {




        const isConnected = useSelector((state) => state?.connection?.isConnected);
        const dispatch = useDispatch();
        const [connectBtnText,setconnectBtnText] = useState('Connect Wallet');
        const [menuOpen,setmenuOpen] = useState(false);

  useEffect(()=>{

    let isCancelled = false;
     if (!isCancelled) {
          checkAccounts();
     }

     return () => {
      isCancelled = true;
    };
    
 
  },[isConnected]);


   const checkAccounts = async () => {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if(accounts?.length>0){
                dispatch(_connect({'account':accounts[0]}));
                setconnectBtnText(shortAddress(accounts[0]))
                checkDBForAccount(accounts[0]); 
         }else{
                dispatch(_disconnect())
                setconnectBtnText('Connect Wallet');
         }
   }
     
  const checkDBForAccount = async (acc) => {
    const response = await fetch('/api/connect',{          //Checks for ETH in Database --> if present then ok if not then a new record is added
        method : "POST",
        body : JSON.stringify({
            account : acc
        }),
        headers:{
            "Content-Type" : "application/json"
        }
    });
     const {data,token} = await response.json();
    if(data.length>0){
        // Wohaah Account created 
        // Now use the JWT token for further DB query
          getAllSafeByThisAccount(data[0].primary_account)
          getAllSafeHavingThisAccount(data[0].primary_account);
          await supabase.auth.setAuth(token);
          setCookie('alpha_safe_jwt',token,1);
    }
  }

  const getAllSafeByThisAccount = async (acc) => {                //Get all Safes created by this account
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
           
        dispatch(_setallsafe({
        'allsafe': allsafe[0]?.allsafe
        }));
           
     } 
   }


  const getAllSafeHavingThisAccount = async (acc) => {                  //Get all Safes having this account as owner
    const response = await fetch('/api/allsafesecondary',{
        method : "POST",
        body : JSON.stringify({
            account : acc
        }),
        headers:{
            "Content-Type" : "application/json"
        }
    });

    const {allsafe} = await response.json();
  
    if(allsafe?.length>0){
         dispatch(_setallsafe({
             'allsafe': allsafe 
        }));
    }
    
    
  }
  

  const handleDisconnect = async () => {
    const accounts = await window.ethereum.request({
    method: "wallet_requestPermissions",
    params: [{
        eth_accounts: {}
    }]
    }).then(() => ethereum.request({
        method: 'eth_requestAccounts'
    }))

    checkAccounts();
  }

  const handleNavButton = () => {
        isConnected ?  handleMenu()  :  handleConnectWallet()
  }

  const handleMenu = () => {
    setmenuOpen((menuOpen)=>!menuOpen);
  }
  const shortAddress = (address) => {
        if(!address){
            return;
        }
        let len = address.length;
        return address.substring(0,6)+"..."+address.substring(len-4,len);
  }


   

 


 

  const handleConnectWallet = () => {
    setconnectBtnText('Connecting..');
    if(!isMetaMaskInstalled()){
        return;
    }else{
        onClickConnect();
    }
  }

  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  const onClickConnect = async () => {
  try {
    // Will open the MetaMask UI
    // You should disable this button while the request is pending!
    //await ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await window.ethereum.request({
    method: "wallet_requestPermissions",
    params: [{
        eth_accounts: {}
    }]
    }).then(() => ethereum.request({
        method: 'eth_requestAccounts'
    }))

    checkAccounts();
  } catch (error) {
    console.error(error);
  }
};


  return (
    <nav className="bg-gray-700 h-12 mb-5">
            <Link href="/" >
                <span className="text-white font-bold text-3xl">
                    Alpha Safe
                </span>
        
            </Link>
        
        
        <div className="float-right">
          <div>
            <button type="button" className="m-2 text-white border p-1 rounded" onClick={handleNavButton} >
                {connectBtnText}    {isConnected&&<FontAwesomeIcon icon={menuOpen?faChevronUp : faChevronDown} />}
            </button>
          </div>
          {menuOpen&&
           <div className="origin-top-right absolute right-0  w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" >       
             <button className="block px-4 py-2 text-sm text-white bg-red-500 rounded m-2" onClick={handleDisconnect}>Disconnect Wallet</button>
           </div>
           }
          
       
        </div>
    </nav>
  )
}
