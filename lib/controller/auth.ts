import { User } from "lib/models/user";
import { Auth } from "lib/models/auth";
import { sendCodeEmail } from "lib/sendgrid";
import { timeStamp } from "console";
import addMinutes from "date-fns/addMinutes";
import gen from "random-seed";
import { addSeconds, subSeconds } from "date-fns";
import { add } from "date-fns/esm";

let seed = "CLAVESECRETALALA";
let rand4 = gen.create(seed);
export async function sendCode(email) {
	const auth = await findOrCreateAuth(email);
	const code = rand4.intBetween(1000, 99999);
	const now = new Date();
	const twentyMinutes = addSeconds(now, 1200);
	auth.data.code = code;
	auth.data.expires = twentyMinutes;
	await auth.push();
	await sendCodeEmail(auth.data.email, code, twentyMinutes);
	console.log("EMAIL ENVIADO A: " + email + "CON CODIGO:" + code);

	return true;
}
export async function expireCode(auth) {
	console.log("soy datadeauth", auth.data.expires.toDate());

	const twentyMinutes = subSeconds(auth.data.expires.toDate(), 1200);
	auth.data.expires = twentyMinutes;
	await auth.push();
}

export async function findOrCreateAuth(email: string) {
	const cleanEmail = email.trim().toLowerCase();
	const auth = await Auth.findByEmail(cleanEmail);
	if (auth) {
		console.log("AUTH ENCONTRADO");

		return auth;
	} else {
		console.log("AUTH NO ENCONTRADO, CREANDO UNO NUEVO");

		const newUser = await User.createNewUser({
			email: cleanEmail,
		});
		const newAuth = await Auth.createNewAuth({
			email: cleanEmail,
			userId: newUser.id,
			code: "",
			expires: new Date(),
		});
		return newAuth;
	}
}
