import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export default async function sendCodeEmail(
	email: string,
	code: number,
	expires
) {
	const msg = {
		to: "fibarrola06@gmail.com", // Change to your recipient
		from: "fibarrola06@gmail.com", // Change to your verified sender
		subject: "Sending with SendGrid is Fun",
		text: "and easy to do anywhere, even with Node.js",
		html:
			"<strong>CODIGO:" +
			code +
			" al email" +
			email +
			" y expira " +
			expires +
			" </strong>",
	};
	sgMail
		.send(msg)
		.then(() => {
			console.log("Email sent");
		})
		.catch((error) => {
			console.error(error);
		});
	return true;
}
