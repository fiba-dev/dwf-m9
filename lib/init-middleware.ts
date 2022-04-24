import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

function initMiddleware(middleware) {
	return (req, res) =>
		new Promise((resolve, reject) => {
			middleware(req, res, (result) => {
				res.setHeader("Access-Control-Allow-Credentials", true);
				res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
				if (result instanceof Error) {
					return reject(result);
				}
				return resolve(result);
			});
		});
}
const cors = initMiddleware(
	// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
	Cors({
		// Only allow requests with GET, POST and OPTIONS
		methods: ["GET", "POST", "OPTIONS"],
	})
);
export default async function middlewareCors(callback) {
	await cors;
	return callback();
}
