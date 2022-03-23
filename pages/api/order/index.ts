import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { User } from "models/user";
import methods from "micro-method-router";
import { createPreference } from "lib/mercadopago";
import { Order } from "models/order";
import { getProduct } from "controller/products";
import { getUserFromId } from "controller/users";

async function postHandler(
	req: NextApiRequest,
	res: NextApiResponse,
	userBody
) {
	const { productId } = req.query;
	const product = await getProduct(productId);
	if (product == false) {
		return res.status(404).send({ message: "Product not found" });
	}
	const objectProduct = product.object;
	const user = await getUserFromId(userBody.userId);

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
			success: "https://dwf-m9.vercel.app/api/ipn/mercadopago",
			pending: "https://dwf-m9.vercel.app/api/ipn/mercadopago",
		},

		notification_url: "https://dwf-m9.vercel.app/api/ipn/mercadopago",
		binary_mode: false,
		differential_pricing: {},
	});

	res.send({ url: pref.body.init_point });
}

const handler = methods({
	post: postHandler,
});
export default authMiddleware(handler);
