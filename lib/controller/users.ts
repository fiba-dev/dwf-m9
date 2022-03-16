import { object } from "yup";
import { User } from "lib/models/user";

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
