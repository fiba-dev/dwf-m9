import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import methods from "micro-method-router";
import { getMerchantOrder } from "lib/mercadopago";

async function getOrder(req: NextApiRequest, res: NextApiResponse, userBody) {
	const order = await getMerchantOrder(req.query.order);
	res.send(order);
}
const handler = methods({
	get: getOrder,
});
export default authMiddleware(handler);
