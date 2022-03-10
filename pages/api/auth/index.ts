import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCode } from "lib/controller/auth";
export default async function (req: NextApiRequest, res: NextApiResponse) {
	const results = await sendCode(req.body.email);
	res.send(results);
}
// async get(req:NextApiRequest, res:NextApiResponse) {
//     res.status( 200).send( `Esto es un GET`)
//   },
//   async post(req:NextApiRequest, res:NextApiResponse) {
//     res.status( 200).send( `Esto es un POST`)
//   },

// export default function (req:NextApiRequest, res:NextApiResponse) {
//    if(req.method=="GET")
//    {
//     res.status(200).send("AUTH")

//    }
//    else if(req.method=="POST"){
//     res.status(200).send("POST")
//    }
//    else{
//        res.status(404).send("metodo no permitido")
//    }
// }
