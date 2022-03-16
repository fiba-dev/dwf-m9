import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { sendCode } from "lib/controller/auth";
import { sendOrderStatusEmail } from "lib/sendgrid";
import { getMerchantOrder } from "lib/mercadopago";
import { id } from "date-fns/locale";
import { Order } from "lib/models/order";

async function changeStatusOrder(
	req: NextApiRequest,
	res: NextApiResponse,
	userBody
) {
	const { id, topic } = req.query;
	if (topic == "merchant_order") {
		const results = await getMerchantOrder(id);
		if (results.order_status == "paid") {
			const orderId = results.external_reference;
			const myOrder = new Order(orderId);
			await myOrder.pull();
			await sendOrderStatusEmail();
			myOrder.data.status = "closed";
			await myOrder.push();
		}
	}
	res.send("ok");
}
const handler = methods({
	get: changeStatusOrder,
});
export default authMiddleware(handler);
