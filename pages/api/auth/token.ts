import { NextApiRequest, NextApiResponse } from "next";
import { expireCode } from "controller/auth";
import { generate } from "lib/jwt";
import { Auth } from "models/auth";
export default async function (req: NextApiRequest, res: NextApiResponse) {
	const auth = await Auth.findByEmailAndCode(req.body.email, req.body.code);

	if (!auth) {
		return res.status(401).send({
			message: "email o code incorrect",
		});
	}
	const expires = auth.isCodeExpired();
	if (expires) {
		return res.status(401).send({
			message: "CODIGO EXPIRADO",
		});
	}

	await expireCode(auth);
	const token = generate({ userId: auth.data.userId });
	res.send(token);
}
