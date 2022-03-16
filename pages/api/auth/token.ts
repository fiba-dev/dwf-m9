import { NextApiRequest, NextApiResponse } from "next";
import { findOrCreateAuth, sendCode, expireCode } from "lib/controller/auth";
import { generate } from "lib/jwt";
import { jwt } from "jsonwebtoken";

import { Auth } from "lib/models/auth";
import { isAfter } from "date-fns";
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

	// let token = generate({ userId: "aAsTelMfTixQ3d1j2bw4" });
	// res.send(token);
	// const newUser = await User.createNewUser({
	// 	email: "email@test",
	// });
	// newUser.data.test = "CAMBIO";
	// await newUser.push();
	// res.send(newUser);
}
