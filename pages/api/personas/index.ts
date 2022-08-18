import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
import { editUser, getUserFromId } from "controller/users";
import { createPersona, obtenerPersonas } from "controller/personas";
import { authMiddlewareCors } from "lib/init-middleware";

async function getPersonas(req: NextApiRequest, res: NextApiResponse) {
	const personas = await obtenerPersonas();
	console.log("SOY GET PERSONAS", personas);

	res.send(personas);
}
async function setPersonas(req: NextApiRequest, res: NextApiResponse, token) {
	if (
		req.body.nombre &&
		req.body.telefono &&
		req.body.codigo &&
		req.body.nit &&
		req.body["razón social"]
	) {
		await createPersona(req.body);
	} else {
		return res.status(400).send({
			message: "FALTAN DATOS",
		});
	}

	res.send(true);
}

const handlerAuth = method({
	get: getPersonas,
	patch: setPersonas,
});
export default authMiddlewareCors(handlerAuth);
