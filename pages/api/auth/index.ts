import type { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "controller/auth";
import * as yup from "yup";
let email = yup
	.object()
	.shape({
		email: yup.string(),
	})
	.noUnknown(true)
	.strict();
export default async function (req: NextApiRequest, res: NextApiResponse) {
	try {
		await email.validate(req.body);
		const results = await sendCode(req.body.email);
		res.send(results);
	} catch (error) {
		res.status(404).send(error);
	}
}
