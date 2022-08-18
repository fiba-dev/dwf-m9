import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
import { editUser, getUserFromId } from "controller/users";
import { buscarPersonas, createPersona } from "controller/personas";
import { authMiddlewareCors } from "lib/init-middleware";
import { getOffsetAndLimit } from "lib/request";

async function getPersonas(req: NextApiRequest, res: NextApiResponse) {
	// const { offset, limit } = getOffsetAndLimit(req);
	console.log("ENTRE");
	console.log("Soy req", req.query);

	const personas = await buscarPersonas(
		req.query.q,
		req.query.filter,
		req.query.page
	);

	res.send(personas);
}
async function setPersonas(req: NextApiRequest, res: NextApiResponse, token) {
	console.log("SOY PERSONA", req.body);

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
