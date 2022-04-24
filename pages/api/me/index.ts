import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
import { editUser, getUserFromId } from "controller/users";

import Cors from "cors";
const cors = Cors({
	methods: ["GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
}
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
function authMiddlewareCors(callback) {
	const data = {};
	return async function (req: NextApiRequest, res: NextApiResponse) {
		const respuesta = await runMiddleware(req, res, cors);
		callback(req, res, data);
	};
}
export default authMiddlewareCors(authMiddleware(handlerAuth));
// export default async function handler(req, res, callback) {
// 	await runMiddleware(req, res, cors);
// 	authMiddleware(handlerAuth);
// 	console.log("SOY DATa");

// 	res.json({ meesage: "HELLO" });
// }
