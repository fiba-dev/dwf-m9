import { object } from "yup";
import { User } from "models/user";

export async function editUser(body, user: User) {
	const usuario = user.data;

	Object.assign(usuario, body);

	user.push();

	return user;
}
export async function getUserFromId(userId) {
	const user = new User(userId);
	await user.pull();
	return user;
}
