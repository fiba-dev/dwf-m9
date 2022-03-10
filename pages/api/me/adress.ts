import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
import * as yup from "yup";
import { findOrCreateAuth, sendCode } from "lib/controller/auth";
import { editUser } from "lib/controller/users";
import parseBearerToken from "parse-bearer-token";
import { decode } from "lib/jwt";
import { User } from "lib/models/user";
import { setDefaultResultOrder } from "dns";
let userDatos = yup
	.object()
	.shape({
		nombre: yup.string(),
		dni: yup.string(),
		email: yup.string().email(),
		direccion: yup.string(),
	})
	.noUnknown(true)
	.strict();
async function setUser(req: NextApiRequest, res: NextApiResponse, token) {
	console.log("TOKEN QUE LLEGA soy SETUSER", token);
	const user = new User(token.userId);
	await user.pull();
	try {
		await userDatos.validate(req.query);
		console.log("SOY REQ.query", req.query);
	} catch (e) {
		console.log(e);
		return res.status(422).send({ field: "body", message: "error" });
	}
	await editUser(req.query, user);
	const { nombre, dni, direccion } = req.query;
	console.log("soy objeto", nombre, dni, direccion);

	// if (req.body.nombre && req.body.dni && req.body.direccion) {
	// 	const newUser = await editUser(req.body, user);
	// } else {
	// 	return res.status(400).send({
	// 		message: "FALTAN DATOS",
	// 	});
	// }

	// res.send(user.data);
	res.send(true);
}
const handler = method({
	patch: setUser,
});
export default authMiddleware(handler);
