import {useEffect,useState} from 'react';
 var Web3 = require('web3');
 const { ethers } = require("ethers");
const { abi } = require("../../../artifacts/contracts/Wallet.sol/Wallet.json"); // abi to use the multi-sig wallet. 
const { bytecode } = require("../../../artifacts/contracts/Wallet.sol/Wallet.json");


export default function RemoveOwner({ walletAddress ,modalOpen,setModal,owners}) {

 
    const [ownerToRemove,setownerToRemove] = useState("");
    const [isReqestUnderProcess,setisReqestUnderProcess] = useState(false);
    const [displayMSG,setdisplayMSG] = useState("");
 

    


    const closeModal = () => {
        setModal((modalOpen)=>!modalOpen)
    }

   
     const handleRadioSelected = (e) => {
          setownerToRemove(e.target.value)
     }
 



   

    
      const validateAddress = (_address) => {
         return  Web3.utils.isAddress(_address)
      }


    const handelRemoveOwnerRequest = async () => {
        setisReqestUnderProcess(true);
        setdisplayMSG("Please wait.. requesting to remove owner");
        const provider = new ethers.providers.Web3Provider(ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner()
        
        const wallet = new ethers.Contract(walletAddress, abi, signer);
        try {
            let reqResult = await wallet.removeOwnerRequest(ownerToRemove);
            if(reqResult){
                setisReqestUnderProcess(false);
                setdisplayMSG("Wohaa ! Request to remove owner is successfully created");
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
                          Remove Owner from your Alpha Safe 
                        </h5>
                        <button type="button"
                          className="btn-close text-red-500 top-0   font-bold text-2xl border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                          data-bs-dismiss="modal"
                           onClick={closeModal}
                           aria-label="Close">x</button>
                      </div>
                      <div className="modal-body relative p-4">
                            <div className="flex flex-col px-5 py-1">
                             <p className="text-l text-center my-3 text-indigo-800">Select the Owner Address to remove</p>
                              {owners.map((owner,idx)=>{
                                    return(
                                        <div key={idx}>  
                                            <input type="radio"
                                            onChange={handleRadioSelected.bind(this)}
                                            name="removeOwnerAddress" value={owner} 
                                            />
                                            <span className="text-l mx-2">{owner}</span>
                                        </div>
                                    )
                              }
                              )} 
                                
                            </div>
                            <div>
                                {isReqestUnderProcess&&
                                <p className="text-center text-bold">{displayMSG}</p>
                                }
                            </div>
                      
                      </div>
                      <div
                        className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                         
                        <button type="button"
                          className="inline-block px-6 py-2.5 bg-green-600 mx-5 text-white  text-xs leading-tight   rounded shadow-md hover:bg-green-500 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                          onClick={handelRemoveOwnerRequest}
                          >
                          Remove Owner
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