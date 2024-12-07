import { INavbarData } from "./helper";

export const navbarData:INavbarData[]=[{ routeLink:'dashboard',icon:'bx bxs-home',label:'Dashboard'},
    { routeLink:'membres',icon:'bx bxs-group',label:'Membres'},
    {routeLink:'signale',icon:'bx bx-error-alt',label:'Signale'},
        { routeLink:'statistique',icon:'bx bxs-pie-chart-alt-2',label:'Statistique',
            items:[{routeLink:'statistique/postes',icon:'bx bx-edit-alt',label:'Posts'},
            {routeLink:'statistique/comments',icon:'bx bx-comment',label:'Commentaires'},
            {routeLink:'statistique/groups',icon:'bx bx-group',label:'Groupes'}]},

        
    ]