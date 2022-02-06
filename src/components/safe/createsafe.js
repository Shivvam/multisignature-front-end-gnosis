import {useEffect,useState} from 'react';
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle} from '@fortawesome/free-solid-svg-icons'
var Web3 = require('web3');
import {  useDispatch } from 'react-redux'
import {  _setallsafe} from '../../lib/reducers/connectionslice';

const { ethers } = require("ethers");
const { abi } = require("../../../artifacts/contracts/Wallet.sol/Wallet.json"); // abi to use the multi-sig wallet. 
const { bytecode } = require("../../../artifacts/contracts/Wallet.sol/Wallet.json");



export default function CreateSafe({primaryAccount}) {
    
    const dispatch = useDispatch();
    const [modalOpen,setmodalOpen] = useState(false);

    const [accounts,setaccounts] =  useState([]);
    const [threshold,setThreshold] = useState(1);

    const [displayMSG,setdisplayMSG] = useState("");

    const [createSafeUnderProcess,setcreateSafeUnderProcess] = useState(false);

   useEffect(()=>{

    let isCancelled = false;
     if (!isCancelled) {
          setPrimaryAccount();
     }

     return () => {
      isCancelled = true;
    };
  },[primaryAccount]);

  const setPrimaryAccount = async () => {
     setaccounts([primaryAccount]);
  }

  const handleAddAccount = () => {
        setaccounts((accounts)=>[...accounts,""])
  }


    const handleCreateSafeModal = () => {
        setmodalOpen((modalOpen)=>!modalOpen)
    }

    const handleAccountValueChange = (index,e) => {
        let accountValueArray =  [...accounts];
        accountValueArray[index] = e.target.value;
        setaccounts(accountValueArray);
    }

    const handleThresholdChange = (e) => {
        setThreshold(e.target.value);
    }

    const handleRemoveOwner = (index) => {
        if(index===0){
            alert('Primary Owner cannot be removed');
        }else{
            let accountValueArray =  [...accounts];
            accountValueArray.splice(index,1);
            setaccounts(accountValueArray);
        }
    }

    const handleCreateSafe = async () => {

        setcreateSafeUnderProcess(true);
        if(!threshold){
            setdisplayMSG("Please Select threshold value");
            return;
        }else{
            if(Number(threshold)>accounts.length){
                setdisplayMSG("Threshold should be lower than the number of owners");
                  return;
            }else{
                if(Number(threshold)<1){
                    setdisplayMSG("There should be atleast one owener");
                      return;
                }else{
                     setdisplayMSG("");
                }
            }
        }


        if(!validateAllOwners(accounts)){
            setdisplayMSG("Plase Enter Valid Address");
              return;
        }

        deployWallet(accounts,threshold);

        

     }





     const validateAllOwners = (all_owners) => {
        let isValidated = true;
        all_owners.forEach((owner,idx)=>{
       
            isValidated =   Web3.utils.isAddress(owner)
            
        })
        return isValidated;
        
     }


    const deployWallet = async (_owners,_threshold) => {
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        await provider.send("eth_requestAccounts", []);

 
        const signer = provider.getSigner()

        try {
            const walletFactory = new ethers.ContractFactory(abi, bytecode, signer);
            const wallet = await walletFactory.deploy(_owners, _threshold);
            // The output of this address needs to be saved in a database, a key - value pair. Key = wallet address, value = owners.
            console.log(`Wallet succesfully created, address -> ${wallet.address}`);
            insertSafeInformationToDB(wallet.address);
        } catch (e) {
            console.error(e);
        }
	
	   
    }

     const insertSafeInformationToDB = async (walletAddress) => {
        const response = await fetch('/api/createsafe',{          //Create a new safe in user table 
        method : "POST",
        body : JSON.stringify({
            account : primaryAccount,
            safeval : {
                 accounts,
                 threshold,
                 walletAddress 
            }
        }),
        headers:{
            "Content-Type" : "application/json"
        }
        });
        const {allsafe} = await response.json();
        const _accounts =  allLowerCaseETHAddr(accounts)
        addToWalletOwenrKeyPairDB(walletAddress,_accounts);            //Create a new safe in wallets table

        if(allsafe[0]?.allsafe?.length>0){
            setcreateSafeUnderProcess(false);                            //Update app Status via redux tool kit
               dispatch(_setallsafe({
                'allsafe': allsafe[0]?.allsafe
                }));
        }
     }

     const addToWalletOwenrKeyPairDB = async (walletAddress,accounts) => {
        const response = await fetch('/api/addwallettodb',{          //Create a new safe in wallets table
        method : "POST",
        body : JSON.stringify({
            walletAddress,
            accounts 
        }),
        headers:{
            "Content-Type" : "application/json"
        }
        });
        const {data} = await response.json();
        setcreateSafeUnderProcess(false);
        handleCreateSafeModal();
     }

     const allLowerCaseETHAddr = (allAddr) => {
          return allAddr.map((add)=>add.toLowerCase());
     }

	return (
		 <div className="flex">
            <div className="mx-auto mt-6">

                <button 
                className="bg-gray-700 text-white px-5 py-3 rounded-xl border-white border text-xl disabled:bg-gray-400"
                onClick={handleCreateSafeModal}
                disabled={createSafeUnderProcess}
                >Create New Safe</button>
            
            </div>


 
             <div className={modalOpen?"modal fade fixed top-10 left-1/4 border w-1/2  rounded shadow-3xl":"modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"}   aria-labelledby="exampleModalCenterTitle" aria-modal="true" role="dialog">
                  <div className="modal-dialog modal-dialog-centered relative  pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                      <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                        <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalScrollableLabel">
                          Create Alpha Safe
                        </h5>
                        <button type="button"
                          className="btn-close text-red-500 top-0   font-bold text-2xl border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                          data-bs-dismiss="modal"
                           onClick={handleCreateSafeModal}
                           aria-label="Close">x</button>
                      </div>
                      <div className="modal-body relative p-4">
                            <div className="flex flex-col">
                                <div>
                                    <h5 className="text-center font-semibold">Add Safe Owners</h5>
                                </div>
                                <div>
                                    {accounts.map((acc,idx)=>{
                                        return(
                                            <div key={idx} className="flex flex-row text-center border p-1 rounded ">
                                                <div className="flex-2">
                                                    {(idx>0)?"Owner "+Number(idx+1):"Primay Owner"}
                                                </div>
                                                <div className="flex-1">
                                                <input type="text" 
                                                value={acc}
                                                className="w-full border p-2 mx-2 my-1"
                                                onChange={handleAccountValueChange.bind(this,idx)}
                                                placeholder={"ETH Address of Owner "+ Number(idx+1)}
                                                />
                                                </div>
                                                <div className="flex-3">
                                                    <button className="text-red-500"
                                                    onClick={handleRemoveOwner.bind(this,idx)}
                                                    title="Remove"
                                                    >
                                                        <FontAwesomeIcon icon={faMinusCircle} />
                                                    </button>
                                                </div>
                                                
                                            </div>
                                        )
                                    })}
                                    <button className="bg-green-500 text-white text-sm rounded px-2 py-1 m-2"
                                    onClick={handleAddAccount}
                                    title="Add Account"
                                    >
                                    Add Account
                                    </button>
                                
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div>
                                    <h5 className="text-center font-semibold">Set Threshold</h5>
                                </div>
                                <div>
                                    <input type="number"
                                    className=" border p-2 mx-2 my-1"
                                    min="1"
                                    max={accounts.length}
                                    placeholder={accounts.length>1?(accounts.length-1):1}
                                    value={threshold}
                                    onChange={handleThresholdChange.bind(this)}
                                    /> <span className="text-gray-500 text-sm">Out of {accounts.length} Owners</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p className="mx-auto text-red-600">{displayMSG}</p>
                            </div>
                      </div>
                      <div
                        className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                        <p className="m-2 text-green-700 text-bold">
                            {createSafeUnderProcess&&"Please Wait... Creating the Safe"}
                        </p>
                        <button type="button"
                          className="inline-block px-6 py-2.5 bg-indigo-600 mx-5 text-white  text-xs leading-tight   rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                          onClick={handleCreateSafe}
                          >
                          Create Safe
                        </button>
                        
                        <button type="button"
                          className="inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                          onClick={handleCreateSafeModal}
                          >
                          Close
                        </button>
                         
                      </div>
                    </div>
                  </div>
                </div>

        </div>
	)

}