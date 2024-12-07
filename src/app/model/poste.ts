import { Comment } from "./comment";
import { User } from "./user";

export class Poste {

    id!:number;
    message!:string;
    category!:string;
    dateCreate!:Date;
    image!:string;
    user!:User;
 
    comments!:Comment[];
    enabled!:boolean;

}