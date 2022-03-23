import type { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "controller/auth";

export default async function (req: NextApiRequest, res: NextApiResponse) {
	try {
		const results = await sendCode(req.body.email);
		res.send(results);
	} catch (error) {
		res.status(404).send(error);
	}
}
