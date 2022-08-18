import { firestore } from "lib/firestore";
import { getHeapCodeStatistics } from "v8";
const collection = firestore.collection("personas");
export class Persona {
	ref: FirebaseFirestore.DocumentReference;
	data: any;
	id: any;
	constructor(id) {
		this.id = id;
		this.ref = collection.doc(id);
	}
	async pull() {
		const snap = await this.ref.get();
		this.data = snap.data();
	}
	async push() {
		this.ref.update(this.data);
	}
	static async createNewPersona(data) {
		const newUserSnap = await collection.add(data);
		const newUser = new Persona(newUserSnap.id);
		newUser.data = data;
		return newUser;
	}
	static async getEmailUser(userid) {
		const results = await collection.doc(userid);
		const data = await (await results.get()).data();

		if (results) {
			const email = data.email;
			return email;
		} else return null;
	}
	static async obtenerPersonas() {
		let snapshot = await collection.get();
		let data = snapshot.docs.map((doc) => doc.data());

		return data;
	}
}
