export default function initMiddleware(middleware) {
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
