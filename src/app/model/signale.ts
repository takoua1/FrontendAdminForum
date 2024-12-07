import { Comment } from "./comment";
import { Decision } from "./decision.enum";
import { Poste } from "./poste";
import { User } from "./user";

export class Signale {

    id!: number;
    titre!: string;
    raison!: string;
    description!: string;
    dateSignale!: Date;
    user!: User;
    poste!: Poste;
    comment!: Comment;
    estTraite!: boolean;
    decision!: Decision;
    dateDecision!: Date;
    admin!: User;
    enabled!:boolean;
}
