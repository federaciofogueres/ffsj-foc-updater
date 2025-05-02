export interface Meta {
    id: number;
    ejercicio: string;
    ordenSector: number;
    numero: number;
    lemaAdulta: string;
    lemaInfantil: string;
    categoriaAdulta: number;
    categoriaInfantil: number;
    artistaAdulta: string;
    artistaInfantil: string;
    presidenteAdulto: string;
    presidenteInfantil: string;
    bellezaAdulta: string;
    bellezaAdultaFotoUrl: string;
    bellezaInfantil: string;
    bellezaInfantilFotoUrl: string;
    damasAdultas: string;
    damasInfantiles: string;
}

export interface Hoguera {
    id: number;
    hogueraKey: string;
    hoguera: string;
    lema: string;
    anyoFundacion: string;
    ubicacion: string;
    web: string;
    sector: number;
    lat: number;
    lng: number;
    meta: Meta;
    active: boolean;
}