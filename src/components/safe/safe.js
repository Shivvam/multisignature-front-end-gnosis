import {useEffect,useState} from 'react';
import SafeOwners from './safeowners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit , faPaperPlane, faCheckCircle, faUserPlus, faUserMinus} from '@fortawesome/free-solid-svg-icons'

import UpdateThresholdModal from './update_threshold_request';
import UpdateThresholdApprovalModal from './update_threshold_approval';
import TxRequestModal from './transaction_request';
import TxApprovalModal from './transaction_approval';
import AddOwnerRequest from './addowner_request'
import AddOwnerApproveModal  from './addowner_approval'
import RemoveOwnerRequest from './remove_owner_request'
import RemoveOwnerApproveModal from './remove_owner_approval'

var Web3 = require('web3');

import {getWalletBalance,getWalletThreshould, getWalletPendingTX,getWalletPendingUpdateTS,getOwnersAddress} from '../../lib/helper/helper';  // Helpers to get the data from Wallet



export default function SingleSafe({safe,idx}) {


    const [updateThresholdReqestModalOpen,setupdateThresholdReqestModalOpen] = useState(false);
    const [updateThresholdApproveModalOpen,setupdateThresholdApproveModalOpen] = useState(false);
    
    const [txRequestModalOpen,settxRequestModalOpen] = useState(false);
    const [txApproveModalOpen,settxApproveModalOpen] = useState(false);
    
    const [addOwnerReqModalOpen,setaddOwnerReqModalOpen] = useState(false);
    const [addOwnerApproveModalOpen,setaddOwnerApproveModalOpen] = useState(false);
    
    const [removeOwnerReqModalOpen,setremoveOwnerReqModalOpen] = useState(false); 
    const [removeOwnerApproveModalOpen,setremoveOwnerApproveModalOpen] = useState(false);

    const [walletBalance,setwalletBalance] = useState(0);
    const [walletThereshould,setwalletThereshould] = useState(null);
    const [walletOwners , setwalletOwners ] = useState([]);

    const [pendingTransactionsData,setpendingTransactionsData] = useState([]);
    const [pendingUpdateThresholdData,setpendingUpdateThresholdData] = useState([]);

      useEffect(()=>{

        let isCancelled = false;
         if (!isCancelled) {
                 walletDataFromChain(safe['walletAddress']);
         }

         return () => {
          isCancelled = true;
        };
      },[]);


    const handleUpdateThresholdRequest = () => {
          setupdateThresholdReqestModalOpen((updateThresholdReqestModalOpen)=>!updateThresholdReqestModalOpen)
    }    

     const handleUpdateThresholdApprove = () => {
          setupdateThresholdApproveModalOpen((updateThresholdApproveModalOpen)=>!updateThresholdApproveModalOpen)
    }    

    const handleTxRequest = () => {
          settxRequestModalOpen((txRequestModalOpen)=>!txRequestModalOpen)
    } 

     const handleTxApprove = () => {
          settxApproveModalOpen((txApprovalModal)=>!txApproveModalOpen)
     } 

     
      
     const handleAddOwnerReqest = () => {
          setaddOwnerReqModalOpen((addOwnerReqModalOpen)=>!addOwnerReqModalOpen);
     }

     const handleAddOwnerApprove = () => {
          setaddOwnerApproveModalOpen((addOwnerApproveModalOpen)=>!addOwnerApproveModalOpen)
     }

     const handleRemoveOwnerReqest = () => {
          setremoveOwnerReqModalOpen((removeOwnerReqModalOpen)=>!removeOwnerReqModalOpen);
     }
     
     const handleRemoveOwnerApprove = () => {
           setremoveOwnerApproveModalOpen((removeOwnerApproveModalOpen)=>!removeOwnerApproveModalOpen);
     }

     


    const walletDataFromChain = async (wAddress) => {
        let balance = await getWalletBalance(wAddress);
        let thereshould =  await getWalletThreshould(wAddress);
        let pendingTX =  await getWalletPendingTX(wAddress);
        let pendingTS = await getWalletPendingUpdateTS(wAddress);
        let allOweners = await getOwnersAddress(wAddress);

        if(balance){
            setwalletBalance(balance);
        }
        if(parseInt(thereshould)){
            setwalletThereshould(parseInt(thereshould))
        }
        if(pendingUpdateThresholdData&&(pendingUpdateThresholdData?.length>0)){
            setpendingUpdateThresholdData(pendingTS);
 
        }
        if(pendingTransactionsData&&(pendingTransactionsData?.length>0)){
          setpendingTransactionsData(pendingTX);
        }
        if(allOweners&&(allOweners?.length>0)){
            setwalletOwners(allOweners)
        }
    }


      
  

	return(
		 <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs">{safe['walletAddress']}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <SafeOwners allOweners={walletOwners} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {walletThereshould}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {walletBalance+"  ETH"}
                        </td> 
                        <td className="px-6 py-4 whitespace-nowrap text-center ">
                            
                            {(pendingTransactionsData&&(pendingTransactionsData?.length>0))&&                                      
                            <button className="block p-1 mt-1 text-gray-600 px-3 py-2 border border-gray-400 rounded text-xs " onClick={handleTxApprove.bind(this)}>
                                  <span className="bg-yellow-500 text-white font-bold px-2 py-1 rounded-full">{pendingTransactionsData?.length||0}</span>        
                                  Pending Transaction 
                                  <FontAwesomeIcon icon={faCheckCircle} />
                            </button>
                            }
                            {(pendingUpdateThresholdData&&(pendingUpdateThresholdData?.length>0))&&
                            <button className="block p-1 mt-1 text-gray-600 px-3 py-2 border border-gray-400 rounded text-xs " onClick={handleUpdateThresholdApprove.bind(this)}>
                                  <span className="bg-yellow-500 text-white font-bold px-2 py-1 rounded-full">{pendingUpdateThresholdData?.length||0}</span>
                                  Pending Update Threshold 
                                  <FontAwesomeIcon icon={faCheckCircle} />
                            </button>
                            }

                            <button className="block p-1 mt-1 text-gray-600 px-3 py-2 border border-gray-400 rounded text-xs " onClick={handleAddOwnerApprove.bind(this)}>
                                         Approve Add Owner Request 
                                         <FontAwesomeIcon icon={faCheckCircle} />
                            </button>
                            <button className="block p-1 mt-1 text-gray-600 px-3 py-2 border border-gray-400 rounded text-xs " onClick={handleRemoveOwnerApprove.bind(this)}>
                                         Approve Remove Owner Request 
                                         <FontAwesomeIcon icon={faCheckCircle} />
                            </button>

                            <AddOwnerApproveModal  modalOpen={addOwnerApproveModalOpen} setModal={setaddOwnerApproveModalOpen}  walletAddress={safe['walletAddress']} />
                            <RemoveOwnerApproveModal  modalOpen={removeOwnerApproveModalOpen} setModal={setremoveOwnerApproveModalOpen}  walletAddress={safe['walletAddress']} />
                            
                            <TxApprovalModal modalOpen={txApproveModalOpen} setModal={settxApproveModalOpen} allPendingTX={pendingTransactionsData} walletAddress={safe['walletAddress']} />

                            <UpdateThresholdApprovalModal modalOpen={updateThresholdApproveModalOpen} setModal={setupdateThresholdApproveModalOpen} allPendingTS={pendingUpdateThresholdData} walletAddress={safe['walletAddress']} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                                <div>
                                    <button className="mt-1 text-gray-500 px-2 py-1 border border-gray-400 rounded text-xs" onClick={handleUpdateThresholdRequest.bind(this)}>
                                      <FontAwesomeIcon icon={faEdit} /> Update Threshold 
                                    </button>
                                    <UpdateThresholdModal safeValue={safe} thereshould={walletThereshould} safeIndex={idx} modalOpen={updateThresholdReqestModalOpen} modalClose={setupdateThresholdReqestModalOpen} />
                                </div>
                              
                                <div>
                                    <button className="mt-1 text-purple-600 px-2 py-1 border border-gray-400 rounded text-xs " onClick={handleTxRequest.bind(this)}>
                                      <FontAwesomeIcon icon={faPaperPlane} />   Send ETH 
                                    </button>
                                    <TxRequestModal  fromWalletAddress={safe['walletAddress']}  modalOpen={txRequestModalOpen} setModal={settxRequestModalOpen}/>
                                </div>
                                <div>
                                    <button className="mt-1 text-green-600 px-2 py-1 border border-gray-400 rounded text-xs " onClick={handleAddOwnerReqest.bind(this)}>
                                       <FontAwesomeIcon icon={faUserPlus} />  Add Owner
                                    </button>
                                    <AddOwnerRequest  walletAddress={safe['walletAddress']}  modalOpen={addOwnerReqModalOpen} modalCloseHandle={setaddOwnerReqModalOpen}  />
                                </div>
                                <div>
                                    <button className="mt-1 text-red-600 px-2 py-1 border border-gray-400 rounded text-xs " onClick={handleRemoveOwnerReqest.bind(this)}>
                                        <FontAwesomeIcon icon={faUserMinus} /> Remove Owener 
                                    </button>
                                    <RemoveOwnerRequest  walletAddress={safe['walletAddress']}  modalOpen={removeOwnerReqModalOpen} setModal={setremoveOwnerReqModalOpen} owners={walletOwners} />
                                </div>

                            </div>
                        </td>

        </tr>
	)
}