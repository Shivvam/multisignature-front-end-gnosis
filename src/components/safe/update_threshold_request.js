import {useEffect,useState} from 'react';
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle} from '@fortawesome/free-solid-svg-icons'


const { ethers } = require("ethers");
const { abi } = require("../../../artifacts/contracts/Wallet.sol/Wallet.json"); // abi to use the multi-sig wallet. 
const { bytecode } = require("../../../artifacts/contracts/Wallet.sol/Wallet.json");



export default function UpdateThreshold({safeValue,safeIndex,modalOpen,modalClose,thereshould}) {

    const {accounts,walletAddress} =  safeValue;
 
    const [_threshold,setThreshold] = useState(null);

    const [displayMSG,setdisplayMSG] = useState("");

    const [updateSafeUnderProcess,setupdateSafeUnderProcess] = useState(false);

     useEffect(()=>{

        let isCancelled = false;
         if (!isCancelled) {
                  setThreshold(thereshould)
                  console.log(thereshould)
         }  

         return () => {
          isCancelled = true;
        };
      },[]);


    const closeModal = () => {
        modalClose((modalOpen)=>!modalOpen)
    }
 

    const handleThresholdChange = (e) => {
        setThreshold(e.target.value);
    }

 

    const handelUpdateThreshold = () => {
            if(!_threshold){
                setdisplayMSG("Please Select threshold value");
                return;
            }else{
                if(Number(_threshold)>accounts.length){
                    setdisplayMSG("Threshold should be lower than the number of owners");
                      return;
                }else{
                    if(Number(_threshold)<1){
                        setdisplayMSG("There should be atleast one owener");
                          return;
                    }else{
                         setdisplayMSG("");
                    }
                }
            }
            updateThresholdRequest(_threshold);

    }


    const updateThresholdRequest = async (newThreshold) => {

         const provider = new ethers.providers.Web3Provider(ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner()

        const wallet = new ethers.Contract(walletAddress, abi, signer);
        try {
            let requestResult = await wallet.updatethresholdRequest(newThreshold);
            console.log("success");
            if(requestResult){
                closeModal();
            }
        } catch (e) {
            console.log(e);
        }

    }

	return(
           <div className={modalOpen?"modal fade fixed top-10 left-1/4 border w-1/2  rounded shadow-3xl":"modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"}   aria-labelledby="exampleModalCenterTitle" aria-modal="true" role="dialog">
                  <div className="modal-dialog modal-dialog-centered relative  pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                      <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                        <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalScrollableLabel">
                          Update Alpha Safe Wallet Setting
                        </h5>
                        <button type="button"
                          className="btn-close text-red-500 top-0   font-bold text-2xl border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                          data-bs-dismiss="modal"
                           onClick={closeModal}
                           aria-label="Close">x</button>
                      </div>
                      <div className="modal-body relative p-4">
                            
                            <div className="flex flex-col">
                                <div>
                                    <h5 className="text-center font-semibold">Update Threshold</h5>
                                </div>
                                <div className="text-center">
                                    <input type="number"
                                    className=" border p-2 mx-2 my-1"
                                    min="1"
                                    max={accounts.length}
                                    placeholder={accounts.length>1?(accounts.length-1):1}
                                    value={_threshold||0}
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
                            {updateSafeUnderProcess&&"Please Wait... Updating the Safe"}
                        </p>
                        <button type="button"
                          className="inline-block px-6 py-2.5 bg-indigo-600 mx-5 text-white  text-xs leading-tight   rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                          onClick={handelUpdateThreshold}
                          >
                          Update  
                        </button>
                        
                        <button type="button"
                          className="inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                          onClick={closeModal}
                          >
                          Close
                        </button>
                         
                      </div>
                    </div>
                  </div>
         </div>
	)
}