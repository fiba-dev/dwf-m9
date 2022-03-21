import type { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "controller/auth";

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const results = await sendCode(req.body.email);
	res.send(results);
}
