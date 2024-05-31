import { Translations } from "@aldabil/react-scheduler/types";
import { DayProps } from "@aldabil/react-scheduler/views/Day";
import { MonthProps, } from "@aldabil/react-scheduler/views/Month";
import { WeekProps } from "@aldabil/react-scheduler/views/Week";
import { IUser } from "./interface/user";

const maxDate = new Date(2023, 11, 31);
const minDate = new Date(2023, 0, 1);

const startDayHours = 8;
const endDayHours = 18;

const leftValuemonday = 103.12; //Les cours du lundi ont comme valeur de left 103.12% jusqu'à 103.12 + leftValueGapDays
const leftValueGapDays = 19.4; //différence de left entre chaque jour. Exemple: 103.12 + 19.4 = 122.52% pour le mardi

// const edtUrlAction = "posEDTBEECOME";
const edtUrlAction = "posETUD";
const edtUrlServerId = "C";

const numberAttemptFetch = 3;


const frTranslations: Translations = {
    navigation: {
        month: "Mois",
        week: "Semaine",
        day: "Jour",
        today: "Aujourd'hui",
        agenda: "Agenda"
    },
    form: {
        addTitle: "Ajouter un événement",
        editTitle: "Modifier l'événement",
        confirm: "Valider",
        delete: "Supprimer",
        cancel: "Annuler",
    },
    event: {
        title: "Titre",
        start: "Début",
        end: "Fin",
        allDay: ""
    },
    validation: {
        required: "Obligatoire",
        invalidEmail: "Email invalide",
        onlyNumbers: "Seul les chiffres sont autorisés",
        min: (min: Number) => `Minimum ${min} lettres`,
        max: (max: Number) => `Maximum ${max} lettres`,
    },
    moreEvents: "cours de plus...",
    loading: "Récupération des données...",
    noDataToDisplay: "Aucune donnée à afficher"
};


const monthProps: MonthProps = {
    weekDays: [0, 1, 2, 3, 4, 5, 6], 
    weekStartOn: 1, 
    startHour: 8, 
    endHour: 18,
    navigation: true,
    disableGoToDay: false
}

const weekProps: WeekProps = {
    weekDays: [0, 1, 2, 3, 4, 5, 6], 
    weekStartOn: 1, 
    startHour: 8, 
    endHour: 19,
    navigation: true,
    disableGoToDay: false,
    step: 60
}

const dayProps: DayProps = {
    startHour: 8, 
    endHour: 19,
    navigation: true,
    step: 60
}

const RESOURCES: IUser[] = [{
    identifiant: "tom.chanson",
    name: "Tom Chanson"
}, {
    identifiant: "louis.ducruet",
    name: "Louis Ducruet"
}
];

export { RESOURCES, dayProps, edtUrlAction, edtUrlServerId, endDayHours, frTranslations, leftValueGapDays, leftValuemonday, maxDate, minDate, monthProps, numberAttemptFetch, startDayHours, weekProps };

