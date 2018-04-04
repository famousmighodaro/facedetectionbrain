import React from 'react';


const Rank =({name, entries})=>{
	return(

		<div className='' >
			<div className='white f3' >
				{`${name} , your rank is.....`}
			</div>
			<div className='white f' >
				{entries}
			</div>
		</div>

		);
}
export default Rank;