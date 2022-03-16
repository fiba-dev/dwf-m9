import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { getOffsetAndLimit } from "lib/request";
import { productIndex } from "lib/algolia";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { offset, limit } = getOffsetAndLimit(req);
	console.log("este es req.query", req.query, offset, limit);

	const resultado = await productIndex.search(req.query.q as string, {
		hitsPerPage: limit,
		offset: offset,
	});

	res.send({
		results: resultado.hits,
		pagination: {
			limit,
			offset,
			total: resultado.nbHits,
		},
	});
}
export default authMiddleware(handler);
