import { NextApiRequest, NextApiResponse } from "next";

import parseBearerToken from "parse-bearer-token";
import { decode } from "lib/jwt";

function authMiddleware(callback) {
	return function (req: NextApiRequest, res: NextApiResponse) {
		const token = parseBearerToken(req);
		if (!token) {
			res.status(401).send({ message: "no hay token" });
		}
		const decodedToken = decode(token);
		if (decodedToken) {
			callback(req, res, decodedToken);
		} else {
			res.status(401).send({ message: "no hay token" });
		}
	};
}

export { authMiddleware };
