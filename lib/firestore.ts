import admin from "firebase-admin";

var serviceAccount = JSON.parse(process.env.FIREBASE_CONNECTION);
console.log(admin.app.length);
if (admin.app.length == 0) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

const firestore = admin.firestore();
export { firestore };
