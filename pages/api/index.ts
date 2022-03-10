import { NextApiRequest, NextApiResponse } from "next";
import { findOrCreateAuth, sendCode } from "lib/controller/auth";
import { Auth } from "lib/models/auth";
import { User } from "lib/models/user";
export default async function (req: NextApiRequest, res: NextApiResponse) {
	// const auth = await findOrCreateAuth(req.body.email);
	// res.send(auth);
	const code = await sendCode(req.body.email);
	res.send(code);
	// const newUser = await User.createNewUser({
	// 	email: "email@test",
	// });
	// newUser.data.test = "CAMBIO";
	// await newUser.push();
	// res.send(newUser);
}
