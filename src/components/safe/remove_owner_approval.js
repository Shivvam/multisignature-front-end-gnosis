import {useEffect,useState} from 'react';
 var Web3 = require('web3');
 const { ethers } = require("ethers");
const { abi } = require("../../../artifacts/contracts/Wallet.sol/Wallet.json"); // abi to use the multi-sig wallet. 
const { bytecode } = require("../../../artifacts/contracts/Wallet.sol/Wallet.json");



export default function RempveOwnerApproval({walletAddress,modalOpen,setModal}) {

   
    const [transactionUnderProcess,settransactionUnderProcess] = useState(false);
    const [transactionStatus,settransactionStatus] =  useState("");
    const [transactionErrorMessage,settransactionErrorMessage] = useState("");


  

     const closeModal = () => {
          setModal((modalOpen)=>!modalOpen);
   
     }
     

     const handleApproveRemoveOwnerRequest = async () => {
        settransactionUnderProcess(true);

            const _index = 0;   // Default taking as 0

            const provider = new ethers.providers.Web3Provider(ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner()
            
            const wallet = new ethers.Contract(walletAddress, abi, signer);


            try {
                 let requestResult =  await wallet.removeOwnerApproval(_index);
                 if(requestResult){
                    closeModal();
                    settransactionStatus("Approval for remove Owner Request Was Sucessful");
                 }else{
                    settransactionStatus("Approval to remove Owner has been Failed");
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
                          Confirm Pending Remove Owner Request
                        </h5>
                        <button type="button"
                          className="btn-close text-red-500 top-0   font-bold text-2xl border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                          data-bs-dismiss="modal"
                           onClick={closeModal}
                           aria-label="Close">x</button>
                      </div>
                      <div className="modal-body relative p-4">
                             
                            
                          
                            <div className="flex flex-col">
                                <div className="">
                                   
                                        <button
                                        onClick={handleApproveRemoveOwnerRequest}
                                        className="bg-green-600 text-white px-3 py-4 font-semibold border border-white rounded-l"
                                        >
                                        Approve to remove Owner
                                        </button>

                                </div>

                                <div>
                                    {transactionUnderProcess&&
                                        <div>
                                            <h5 className="text-center font-semibold text-orange-600">{transactionStatus}</h5>
                                           {transactionErrorMessage&& <p className="text-center font-semibold text-red-600">{"Error :"+transactionErrorMessage?.error?.message}</p>
                                           }
                                        </div>
                                    }
                                </div>
                                
                            </div>
                             
                      </div>
                      <div
                        className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                        
                      
                        
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