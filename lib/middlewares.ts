import { NextApiRequest, NextApiResponse } from "next";

import parseBearerToken from "parse-bearer-token";
import { decode } from "lib/jwt";

function authMiddleware(callback) {
	return function (req: NextApiRequest, res: NextApiResponse) {
		const token = parseBearerToken(req);
		console.log("token", token);
		if (!token) {
			res.status(401).send({ message: "no hay token" });
		}
		const decodedToken = decode(token);
		console.log(decodedToken);

		if (decodedToken) {
			callback(req, res, decodedToken);
		} else {
			res.status(401).send({ message: "no hay token" });
		}
	};
}

export { authMiddleware };
