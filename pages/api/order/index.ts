import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { User } from "lib/models/user";
import methods from "micro-method-router";
import { createPreference } from "lib/mercadopago";
import { Order } from "lib/models/order";
const products = {
	1234: {
		title: "Auto",
		description: "Dummy description",
		picture_url: "http://www.myapp.com/myimage.jpg",
		category_id: "cat123",
		quantity: 1,
		currency_id: "ARS",
		unit_price: 100,
	},
};
async function postHandler(
	req: NextApiRequest,
	res: NextApiResponse,
	userBody
) {
	// const user = new User(userBody.userId);
	// await user.pull();
	const { productId } = req.query as any;
	const product = products[productId];
	if (!product) {
		res.status(400).json({ message: "PRODUCT NOT FOUND" });
	}
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
				title: product.title,
				description: product.description,
				picture_url: product.picture_url,
				category_id: product.category_id,
				quantity: product.quantity,
				currency_id: product.currency_id,
				unit_price: product.unit_price,
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
		back_urls: {
			failure: "",
			success: "https://apx.school",
			pending: "https://apx.school/pending-payments",
		},

		notification_url: "https://pagos-sigma.vercel.app/api/webhooks/mercadopago",
		binary_mode: false,
		differential_pricing: {},
	});

	res.send({ url: pref.body.init_point });
}

const handler = methods({
	post: postHandler,
	async get() {},
});
export default authMiddleware(handler);
