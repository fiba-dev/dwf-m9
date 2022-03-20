import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { sendCode } from "lib/controller/auth";
import { sendOrderStatusEmail } from "lib/sendgrid";
import { getMerchantOrder } from "lib/mercadopago";
import { id } from "date-fns/locale";
import { Order } from "lib/models/order";
import { getEmailUser } from "lib/controller/users";

export default async function changeStatusOrder(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id, topic } = req.query;
	try {
		if (topic == "merchant_order") {
			const results = await getMerchantOrder(id);

			if (results.order_status == "paid") {
				const orderId = results.external_reference;
				console.log("soy orderid", orderId);

				const myOrder = new Order(orderId);
				await myOrder.pull();
				console.log("soy myorder", myOrder);

				const userId = myOrder.data.userId;

				const email = await getEmailUser(userId);

				const sent = await sendOrderStatusEmail(email);
				myOrder.data.status = "closed";

				await myOrder.push();
			}
		}
	} catch (error) {
		res.send(error);
	}
	res.send("ok");
}
