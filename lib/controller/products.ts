import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
function getLista() {
	const arr = Array.from(Array(1000).keys());
	const test = arr.map((valor) => {
		return { nombre: valor };
	});
	return test;
}
function getOffsetAndLimit(req: NextApiRequest, maxLimit, maxOffset) {
	const queryOffset = parseInt(req.query.offset as string);
	const queryLimit = parseInt(req.query.limit as string);
	const offset = queryOffset < maxOffset ? queryOffset : 0;
	const limit = queryLimit <= maxLimit ? queryLimit : 100;
	return { offset, limit };
}

// export (req:NextApiRequest, res:NextApiResponse) {
//     const lista= getLista()
//     // console.log(lista);
//     const {offset, limit}= getOffsetAndLimit(req,100,lista.length)
//     const sliced=lista.slice(offset,offset+limit)
//         res.send({results:sliced,
//         pagination:{
//           offset,limit,total:lista.length
//         }})
//       }
