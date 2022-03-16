import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { User } from "lib/models/user";
import methods from "micro-method-router";
import { createPreference } from "lib/mercadopago";
import { Order } from "lib/models/order";
import { getProduct } from "lib/controller/products";

import { getMerchantOrder } from "lib/mercadopago";
// const products = {
// 	1234: {
// 		title: "Auto",
// 		description: "Dummy description",
// 		picture_url: "http://www.myapp.com/myimage.jpg",
// 		category_id: "cat123",
// 		quantity: 1,
// 		currency_id: "ARS",
// 		unit_price: 100,
// 	},
// };
async function postHandler(
	req: NextApiRequest,
	res: NextApiResponse,
	userBody
) {
	console.log("soy products,", req.query.productId);
	const { productId } = req.query;
	const product = await getProduct(productId);
	if (product == false) {
		return res.status(404).send({ message: "Product not found" });
	}
	const objectProduct = product.object;
	const user = new User(userBody.userId);
	await user.pull();
	const order = await Order.createNewOrder({
		aditionalInfo: req.body,
		productId,

		userId: userBody.userId,
		status: "pending",
	});

	const pref = await createPreference({
		external_reference: order.id,
		items: [
			{
				title: objectProduct.Name,

				description: objectProduct.Notes,
				picture_url: objectProduct.Images[0].url,
				category_id: objectProduct.type,
				quantity: req.body.quantity,
				currency_id: "ARS",
				unit_price: objectProduct["Unit cost"],
			},
		],
		payer: {
			phone: {},
			identification: {},
			address: {},
		},
		payment_methods: {
			excluded_payment_methods: [{}],
			excluded_payment_types: [{}],
		},
		shipments: {
			free_methods: [{}],
			receiver_address: {},
		},
		additional_info: "Esta es informacion adicional",

		back_urls: {
			failure: "",
			success: "https://apx.school",
			pending: "https://apx.school/pending-payments",
		},

		notification_url:
			"https://webhook.site/7800fcd9-0ffb-4672-a69e-d5f8d0c90c63",
		binary_mode: false,
		differential_pricing: {},
	});

	res.send({ url: pref.body.init_point });
}

const handler = methods({
	post: postHandler,
});
export default authMiddleware(handler);
