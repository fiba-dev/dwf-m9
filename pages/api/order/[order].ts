import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { User } from "lib/models/user";
import methods from "micro-method-router";
import { createPreference } from "lib/mercadopago";
import { Order } from "lib/models/order";
import { getProduct } from "lib/controller/products";

import { getMerchantOrder } from "lib/mercadopago";

async function getOrder(req: NextApiRequest, res: NextApiResponse, userBody) {
	const order = await getMerchantOrder(req.query.order);
	res.send(order);
}
const handler = methods({
	get: getOrder,
});
export default authMiddleware(handler);
