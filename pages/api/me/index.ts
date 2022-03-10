import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
import { findOrCreateAuth, sendCode } from "lib/controller/auth";
import { editUser } from "lib/controller/users";
import parseBearerToken from "parse-bearer-token";
import { decode } from "lib/jwt";
import { User } from "lib/models/user";
import { setDefaultResultOrder } from "dns";

async function getUser(req: NextApiRequest, res: NextApiResponse, token) {
	console.log("TOKEN QUE LLEGA", token);

	const user = new User(token.userId);
	await user.pull();
	res.send(user.data);
}
async function setUser(req: NextApiRequest, res: NextApiResponse, token) {
	console.log("TOKEN QUE LLEGA soy SETUSER", token);
	console.log("SOY REQU:BODY", req.body);
	const user = new User(token.userId);
	await user.pull();
	if (req.body.nombre && req.body.dni && req.body.direccion) {
		await editUser(req.body, user);
	} else {
		return res.status(400).send({
			message: "FALTAN DATOS",
		});
	}

	// res.send(user.data);
	res.send(true);
}
const handler = method({
	get: getUser,
	patch: setUser,
});
export default authMiddleware(handler);
