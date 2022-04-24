import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
import { editUser, getUserFromId } from "controller/users";
import initMiddleware from "lib/init-middleware";
import Cors from "cors";
const cors = initMiddleware(
	// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
	Cors({
		// Only allow requests with GET, POST and OPTIONS
		methods: ["GET", "POST", "OPTIONS"],
	})
);
async function getUser(req: NextApiRequest, res: NextApiResponse, token) {
	const user = await getUserFromId(token.userId);

	res.send(user.data);
}
async function setUser(req: NextApiRequest, res: NextApiResponse, token) {
	const user = await getUserFromId(token.userId);

	if (req.body.nombre && req.body.dni && req.body.direccion) {
		await editUser(req.body, user);
	} else {
		return res.status(400).send({
			message: "FALTAN DATOS",
		});
	}

	res.send(true);
}
const handler = method({
	get: getUser,
	patch: setUser,
});
export default async function enableCors(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await cors(req, res);
	authMiddleware(handler);
}
