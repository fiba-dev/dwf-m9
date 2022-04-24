import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
import { editUser, getUserFromId } from "controller/users";
import { cors } from "lib/init-middleware";

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

const handlerAuth = method({
	get: getUser,
	patch: setUser,
});
export default async function handler(req, res) {
	// Run cors
	await cors(req, res);
	// Rest of the API logic
	res.json({ message: "Hello Everyone!" });
}
// export default middlewareCors(authMiddleware(handlerAuth));
