import { Persona } from "models/personas";
import _ from "lodash";

export async function createPersona(params: any) {
	const PersonaNueva = await Persona.createNewPersona({
		nombre: params.nombre,
		"razón social": params["razón social"],
		nit: params.nit,
		telefono: params.telefono,
		codigo: params.codigo,
	});
}
function removeDiacritic(text) {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toString();
}
async function pagination(page, array) {
	let limit = 20 * page + 1;
	let offset = limit - 21;

	return array.slice(offset, limit);
}
export async function buscarPersonas(query: any, filter: any, page: any) {
	let res = await Persona.obtenerPersonas();
	console.log("SOY RES", res);

	let finded = res.filter((e) => {
		if (
			_.includes(removeDiacritic(e[filter].toString()).split(" ").join(), query)
		) {
			return e;
		} else return false;
	});
	let results = await pagination(page, finded);
	let totalPages = Math.ceil(finded.length / 20);
	let totalResults = finded.length;
	console.log("SOY FINDED", finded);

	return {
		total_pages: totalPages,
		total_results: totalResults,
		results: results,
	};
}
