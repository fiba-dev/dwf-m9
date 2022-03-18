import { object } from "yup";
import { User } from "lib/models/user";
import { firestore } from "lib/firestore";
const collection = firestore.collection("users");
export async function editUser(body, user: User) {
	const usuario = user.data;

	Object.assign(usuario, body);

	user.push();
	return user;

	// const auth = await Auth.findByEmail(cleanEmail);
	// if (auth) {
	// 	console.log("AUTH ENCONTRADO");

	// 	return auth;
	// } else {
	// 	console.log("AUTH NO ENCONTRADO, CREANDO UNO NUEVO");

	// 	const newUser = await User.createNewUser({
	// 		email: cleanEmail,
	// 	});
	// 	const newAuth = await Auth.createNewAuth({
	// 		email: cleanEmail,
	// 		userId: newUser.id,
	// 		code: "",
	// 		expires: new Date(),
	// 	});
	// 	return newAuth;
	// }
}
export async function getEmailUser(userid) {
	const results = collection.doc(userid);
	const data = await (await results.get()).data();

	if (results) {
		const email = data.email;
		return email;
	} else return null;
}
