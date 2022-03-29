import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { getProduct } from "controller/products";

export default async function getProducts(
	req: NextApiRequest,
	res: NextApiResponse,
	userBody
) {
	const productId = req.query.products;
	const resultado = await getProduct(productId);
	if (resultado == false)
		return res.status(404).send({ message: "Product not found" });
	res.send(resultado);
}
const handler = methods({
	get: getProducts,
});
