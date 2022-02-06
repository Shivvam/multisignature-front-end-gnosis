import SafeRow from './safe';


export default function SafeTable ({allsafe}) {

      




	return(
        <div>

		<table className="table-auto min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
               >Wallet Address</th>
              <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
               >Owners</th>
              <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
               >Thereshould</th>
              <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
               >Balance</th>
               <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
               >
               Pending Transaction
               </th>
               <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
               >Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allsafe.map((safe,idx)=>{
                return(
                   <SafeRow safe={safe} key={idx} idx={idx} />
                )
            })}

          </tbody>
        </table>
            
       </div>

	)
}