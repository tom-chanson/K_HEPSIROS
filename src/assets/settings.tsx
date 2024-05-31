import { ISettingsCategory } from "../interface/setting"

export const settings: ISettingsCategory[] = [
    {
        name: "Calendrier",
        settings: [
            {
                name: "Timeout",
                label: "Timeout (en secondes)",
                anchor: "calendar-timeout",
                description: "Temps avant que les requêtes pour récupérer les données du calendrier soient annulées",
                type: "number",
                default: 20,
                min: 5,
            },
            {
                name: "Rafraichissement",
                label: "Rafraichir les données qui ont plus de x minutes",
                anchor: "calendar-refresh",
                description: "Rafraichir les données qui ont plus de x minutes lorsque la vue ou la date change. Si le bouton de rafraichissement est utilisé, toutes les données sont rafraichies. Si la valeur est à 0, les données sont toujours rafraichies. (Cette option permet de limiter la quantité de requêtes et améliore la vitesse de chargment des données)",
                type: "number",
                default: 5,
                min: 0,
            },
            {
                name: "Rafraichissement des anciennes données",
                label: "Type de rafraichissement des anciennes données",
                anchor: "calendar-refresh-old",
                description: "Choix du type de rafraichissement pour les données des jours précédents",
                type: "choice",
                default: "partial",
                choices: [
                    {value: "none", label: "Ne pas rafraichir"},
                    {value: "partial", label: "Rafraichir une seule fois après la date"},
                    {value: "full", label: "Rafraichir à chaque fois après la date"},
                ],
            },
            {
                name: "Affichage du week-end",
                label: "Afficher le week-end",
                anchor: "calendar-weekend",
                description: "Afficher le week-end dans le calendrier. Si l'écran est trop petit, le week-end est automatiquement caché.",
                type: "choice",
                default: "show-weekend",
                choices: [
                    {value: "show-weekend", label: "Afficher le week-end"},
                    {value: "show-saturday", label: "Afficher le samedi"},
                    {value: "show-sunday", label: "Afficher le dimanche"},
                    {value: "hide", label: "Cacher le week-end"},
                ],
            },
            {
                name: "Heure de début",
                label: "Heure de début la journée",
                anchor: "calendar-start-hour",
                description: "Heure de début de la journée. Si un cours commence avant cette heure, l'heure de début est automatiquement modifiée.",
                type: "number",
                default: 8,
                min: 0,
                max: 24,
            },
            {
                name: "Heure de fin",
                label: "Heure de fin la journée",
                anchor: "calendar-end-hour",
                description: "Heure de fin de la journée. Si un cours finit après cette heure, l'heure de fin est automatiquement modifiée.",
                type: "number",
                default: 18,
                min: 0,
                max: 24,
            }
        ]
    },
    {
        name: "Données",
        settings: [
            {
                type: "list-button",
                name: "Suppression des données",
                anchor: "data-delete",
                description: "Supprimer les données du calendrier et les identifiants",
                label: "Supprimer les données",
                buttons: [
                    {
                        text: "Données du calendrier",
                        color: "red",
                        onClick: () => {
                            console.log("delete calendar data");
                        }
                    },
                    {
                        text: "Identifiants",
                        color: "red",
                        onClick: () => {
                            console.log("delete id data");
                        }
                    },
                    {
                        text: "Tout",
                        color: "red",
                        onClick: () => {
                            console.log("delete all data");
                        }
                    },
                ],
            }
        ]
    }, {
        name: "Réinitialisation",
        settings: [
            {type: "popin",
            name: "Réinitialisation des paramètres",
            anchor: "reset-settings",
            description: "Réinitialiser les paramètres par défaut",
            label: "Réinitialiser les paramètres",
            buttonText: "Réinitialiser",
            popinTitle: "Réinitialisation des paramètres",
            popinText: "Voulez-vous vraiment réinitialiser les paramètres ?",
            popinButtons: [
                {
                    text: "Annuler",
                    color: "red",
                    role: "close",
                    onClick: () => {
                        console.log("cancel reset settings");
                    }
                },
                {
                    text: "Réinitialiser",
                    color: "green",
                    onClick: () => {
                        console.log("reset settings");
                    }
                },
            ],
            }
        ]
    }
]
