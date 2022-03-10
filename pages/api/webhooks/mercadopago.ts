import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCode } from "lib/controller/auth";
import { getMerchantOrder } from "lib/mercadopago";
import { id } from "date-fns/locale";
import { Order } from "lib/models/order";
export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { id, topic } = req.query;
	if (topic == "merchant_order") {
		const results = await getMerchantOrder(id);
		if (results.order_status == "paid") {
			const orderId = results.external_reference;
			const myOrder = new Order(orderId);
			await myOrder.pull();
			myOrder.data.status = "closed";
			await myOrder.push();
		}
	}
	res.send("ok");
}
