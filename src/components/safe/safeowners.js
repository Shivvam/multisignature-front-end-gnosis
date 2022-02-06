export default function DisplaySafeOweners ({allOweners}) {
	
	return(
		<div>
			{allOweners.map((owner,idx)=>{
				return(
					<div key={idx}>
						<p className="text-xs">Owner {Number(idx)+1} : {owner}</p>
					</div>
				)
			}
			)}

		</div>
	)

}