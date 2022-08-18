import { Persona } from "models/personas";

export async function createPersona(params: any) {
	const PersonaNueva = await Persona.createNewPersona({
		nombre: params.nombre,
		"razón social": params["razón social"],
		nit: params.nit,
		telefono: params.telefono,
		codigo: params.codigo,
	});
}
export async function obtenerPersonas(offset, limit) {
	let res = await Persona.obtenerPersonas(offset, limit);
	console.log("SOY RES", res);
	return res;
}
