import { Candidata } from '../model/candidata.model';

export interface CandidatasResponse {
  adultas: Candidata[];
  infantiles: Candidata[];
}
