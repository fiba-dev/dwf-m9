import type { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "controller/auth";
import * as yup from "yup";
import Cors from "cors";
const cors = Cors({
	methods: ["GET", "POST", "HEAD"],
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
function authMiddlewareCors(callback) {
	const data = {};
	return async function (req: NextApiRequest, res: NextApiResponse) {
		const respuesta = await runMiddleware(req, res, cors);
		callback(req, res, data);
	};
}
let email = yup
	.object()
	.shape({
		email: yup.string(),
	})
	.noUnknown(true)
	.strict();
export default authMiddlewareCors(async function (
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		await email.validate(req.body);
		const results = await sendCode(req.body.email);
		res.send(results);
	} catch (error) {
		res.status(404).send(error);
	}
});
