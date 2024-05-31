 import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import "../styles/components/calendar.less";

 import { Scheduler } from "@aldabil/react-scheduler";
import type { ProcessedEvent, SchedulerRef } from "@aldabil/react-scheduler/types";
import { IconButton, Typography } from "@mui/material";
import { fr } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { dayProps, frTranslations, monthProps, weekProps } from "../const";

 import { EventCalendar, IEventClass, IEventException } from "../interface/calendar";
import { IFetchResult } from "../interface/fetch";

 import ErrorIcon from '@mui/icons-material/Error';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { ThemeProvider } from '@mui/material/styles';
import { FetchDay, FetchMonth, FetchWeek } from "../services/fetchHtml";
import { darkTheme } from "./palette";

 import {
    RemoteQuery
} from "@aldabil/react-scheduler/types";
import { IUserDb } from "../interface/database";
import { IUser } from "../interface/user";
import { getAllDataDB } from "../services/DBManager";
import UserNavbar from "./userNavbar";

 export default function Calendar() {
     const calendarRef = useRef<SchedulerRef>(null);
     const [width, setWidth] = useState(window.innerWidth);
     const [height, setHeight] = useState(window.innerHeight);
     const [showCalendar, setShowCalendar] = useState(false);

     const [weekView, setWeekView] = useState(weekProps);
     const [monthView, setMonthView] = useState(monthProps);

     const [modeAgenda, setModeAgenda] = useState(false);

     const [identifiant, setIdentifiant] = useState("");

     const [listUser, setListUser] = useState<IUserDb[]>([]);

     const identifiantRef = useRef(identifiant);
     const [listUserLoading, setListUserLoading] = useState(true);

     const navbarUserRef = useRef<HTMLDivElement>(null);


     useEffect(() => {
        if (calendarRef.current) {
            calendarRef.current.scheduler.agenda = modeAgenda;
        console.log("modeAgenda", modeAgenda);

        }
        }, [modeAgenda]);


    

     const typo = (text: string, icon?: string, margin?: string, color?: string, gap: number = 8, iconSize: "small" | "inherit" | "large" | "medium" = "medium", textOverflowEllipsis?: boolean) => {
         const iconSvg: { [key: string]: JSX.Element } = {
             "PlaceIcon": <PlaceIcon fontSize={iconSize} />,
             "PersonIcon": <PersonIcon fontSize={iconSize} />,
             "ScheduleIcon": <ScheduleIcon fontSize={iconSize} />,
             "ErrorIcon": <ErrorIcon fontSize={iconSize} />,
         }
         const colorText: string = color? color: "textSecondary";
         return (
             <Typography 
                 style={{ display: "flex", alignItems: "center", gap: gap, margin: margin ? margin : 0 }}
                 color={colorText} variant="caption">
                 {icon ? iconSvg[icon] : null}
                 <span style={{ overflow: textOverflowEllipsis ? "hidden" : "visible", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</span>
             </Typography>
         )
     }

     const viewerExtraComponent = (_fields: any, event: any) => {

         if (event.date_update) {
             const stringUpdate = `Dernière mise à jour: ${event.date_update.toLocaleDateString()} ${event.date_update.toLocaleTimeString()}`;
             return (
                 <>
                 {typo(event.room, "PlaceIcon")}
                 {typo(event.teacher, "PersonIcon")}
                 {typo(stringUpdate, "ScheduleIcon")}
                 </>
             )
         } else if (event.error) {
             if (event.date_data) {
                 const dateUpdate = `Date de la dernière mise à jour des données: ${event.date_data.toLocaleDateString()} ${event.date_data.toLocaleTimeString()}`;
                 return (
                     <>
                     {typo(event.message, "ErrorIcon")}
                     {typo(dateUpdate, "ScheduleIcon")}
                     </>
                 )
             }
             else {
             return (
                 <>
                 {typo(event.message, "ErrorIcon")}
                 </>
             )
             }
         } else {
             return (
                 <></>
             )
         }
     }

     const eventRenderer = ({ event, ...props }: any) => {
         const backgroundColor: string | number = event.color? event.color: darkTheme.palette.primary.main;
         const colorText: string | number = darkTheme.palette.primary.contrastText;
         return (
         <div
             style={{
             height: "100%",
             background: backgroundColor,
             padding: 4,
             }}
             {...props}
         > 
             {typo(event.title,undefined,"auto", colorText, 2, "small")}
             {typo(event.room, "PlaceIcon", "auto", colorText, 2, "small")}
             {typo(event.teacher, "PersonIcon", "auto", colorText, 2, "small")}
         </div>
         );
       };

     useEffect(() => {
         if (window.innerWidth < 600) {
             setWeekView({...weekProps, weekDays: [0, 1, 2, 3, 4]});
             setMonthView({...monthProps, weekDays: [0, 1, 2, 3, 4]});
         } else {
             setWeekView({...weekProps, weekDays: [0, 1, 2, 3, 4, 5, 6]});
             setMonthView({...monthProps, weekDays: [0, 1, 2, 3, 4, 5, 6]});
         }
     }
     , [width]);

     useEffect(() => {
        if (navbarUserRef.current) {
            const navbarHeight = navbarUserRef.current.clientHeight;
            setHeight(window.innerHeight - navbarHeight * 2 - 45.5);
        } else {
            setHeight(window.innerHeight);
        }
        setShowCalendar(true);
         window.addEventListener("resize", () => {
             if (window.innerWidth !== width) {
                 setWidth(window.innerWidth);
             }
            if (window.innerHeight !== height) {
                if (navbarUserRef.current) {
                    const navbarHeight = navbarUserRef.current.clientHeight;
                    setHeight(window.innerHeight - navbarHeight * 2 - 42.5);
                } else {
                    setHeight(window.innerHeight);
                }
            }
         });
        
     } , []);
     

    
     const updateDelay = 5;
     const forceUpdate = false;
     async function getDataMonth(login: string, date: Date) {
         const data = await FetchMonth(login, date, updateDelay, forceUpdate);
         return data;
     }

     async function getDataWeek(login: string, date: Date) {
         const data = await FetchWeek(login, date, updateDelay, forceUpdate);
         return data;
     }

     async function getDataDay(login: string, date: Date): Promise<IFetchResult> {
         //s'il s'agit du samedi ou du dimanche, renvoyé un tableau vide
         if (date.getDay() === 6 || date.getDay() === 0) {
             return {data: [],exception: [], user: login};
         }
         const data = await FetchDay(login, date, updateDelay, forceUpdate);
         return data;
     }



     function addEventId(data: IFetchResult): EventCalendar[] {
         let events: EventCalendar[] = []; 
         let eventId = 1;
         data.data.forEach((day) => {
             const eventResult: IEventClass = {
                 user: data.user,
                 title: day.title,
                 start: day.start,
                 end: day.end,
                 teacher: day.teacher,
                 room: day.room,
                 event_id: eventId,
                 date_update: day.date_update,
                 allDay: false
             }
             events.push(eventResult);
             eventId++;
         });
         data.exception.forEach((exception) => {
             const eventResult: IEventException = {
                 user: data.user,
                 title: "Une erreur est survenue",
                 message: exception.message,
                 start: exception.date,
                 end: exception.date,
                 event_id: eventId,
                 allDay: true,
                 error: true,
                 color: "#af2525",
                 date_data: exception.date_data,
             }
             events.push(eventResult);
             eventId++;
         });
         return events;
     }

     useEffect(() => {
         identifiantRef.current = identifiant;
     }, [identifiant]);

      const fetchRemote = async (query: RemoteQuery, updateForce?: boolean): Promise<ProcessedEvent[]> => {
        const identifiantActual = identifiantRef.current;
          if (!identifiantActual) {
              return [];
          }
          let data: IFetchResult = {
              data: [],
              exception: [],
              user: identifiantActual,
          };
          return new Promise(async (res) => {
          switch (query.view) {
              case "month":
                  let month = query.start;
                  if (query.start.getDate() !== 1 && !updateForce) {
                      month = new Date(query.start.getFullYear(), query.start.getMonth()+1, 1);
                  }
                  data = await getDataMonth(identifiantActual, month);
                  break;
              case "week":
                  data = await getDataWeek(identifiantActual, query.start);
                  break;
              case "day":
                  if (updateForce) {
                      data = await getDataDay(identifiantActual, query.start);
                  } else {
                      data = await getDataDay(identifiantActual, new Date(query.start.getFullYear(), query.start.getMonth(), query.start.getDate()+1));
                  }
                  break;
              default:
                  break;
          }
          res(addEventId(data))
      });
      }

      const updateResourceOnClick = () => {
          const listUser = document.querySelectorAll("[data-item='user'][data-item-id]");
          //pour chaque éléménent de la liste ajouter un écouteur d'événement à son parent si celui-ci est un bouton
          listUser.forEach((user) => {
              const parent = user.parentElement;
              if (parent) {
                  parent.addEventListener("click", () => {
                      setIdentifiant(user.getAttribute("data-item-id") as string);
                  });
              }
          });
        
        }

     const updateListUserFromDb = (userToSelect?: IUser | false) => {
        setListUserLoading(true);
         getAllDataDB("user").then((data) => {
            const dataUser = data as IUserDb[];
            setListUser(dataUser);
            setIdentifiant(dataUser[0] ? dataUser[0].identifiant : "");
            if (userToSelect === false) {
                setIdentifiant("");
            } else if (userToSelect) {
                setIdentifiant(userToSelect.identifiant);
            }
            setListUserLoading(false);
         });
     }

      useEffect(() => {
          updateListUserFromDb();
           updateResourceOnClick();
        }, []);

        useEffect(() => {
            //attendre 1000ms que la taille ne change plus
            setShowCalendar(false);
            const timeout = setTimeout(() => {
                setShowCalendar(true);
            }, 500);

            return () => {
                clearTimeout(timeout);
            }
        }, [height]);
       const userChange = (user: string) => {
         setIdentifiant(user);
       }

       useEffect(() => {
         updateCalendar();
         }, [identifiant]);

       const updateCalendar = async () => {
         if (calendarRef.current) {
             const view = calendarRef.current.scheduler.view;
             const date = calendarRef.current.scheduler.selectedDate;
             const query: RemoteQuery = {
                 start: date,
                 view: view,
                 end: date
             }
             calendarRef.current.scheduler.triggerLoading(true);
              const events: ProcessedEvent[] = await fetchRemote(query, true);
              calendarRef.current.scheduler.handleState(events, "events");
             calendarRef.current.scheduler.triggerLoading(false);
         }
       }

       


     return (
         <ThemeProvider theme={darkTheme}>
         <div className="calendar">
             <UserNavbar 
                 refNavbar={navbarUserRef}
                 listUser={listUser}
                 userSelected={identifiant}
                 userChange={userChange}
                 updateUserList={updateListUserFromDb}
                 userLoading={listUserLoading}
                ></UserNavbar>
                {(showCalendar && !listUserLoading) &&
             <Scheduler 
              getRemoteEvents={fetchRemote}
             viewerExtraComponent={viewerExtraComponent}
             ref={calendarRef}
             deletable={false}
             editable={false}
             agenda={modeAgenda}
             hourFormat="24"
             draggable={false}
             timeZone="Europe/Paris"
             translations={frTranslations}
             month={monthView}
             week={weekView}
             day={dayProps}
             locale={fr}
             height={height}
             onViewChange={updateResourceOnClick}
             eventRenderer={eventRenderer}
             fields={[
                 {
                 name: "teacher",
                 type: "input",
                 config: {
                     required: true,
                     label: "Intervenant",
                     placeholder: "Intervenant",
                 },
                 },
                 {
                 name: "Group",
                 type: "input",
                 config: {
                     required: true,
                     label: "Groupe",
                     placeholder: "Groupe",
                 },
                 },
                 {
                 name: "Room",
                 type: "input",
                 config: {
                     required: true,
                     label: "Salle",
                     placeholder: "Salle",
                 },
                 }
             ]}
             stickyNavigation={true}
             />
            }
            <IconButton className="modeAgenda" color="primary" style={{backgroundColor: darkTheme.palette.primary.main}}
            onClick={() => {
                setModeAgenda(!modeAgenda);
            }}>
        {modeAgenda ? <ViewAgendaIcon /> : <CalendarMonthIcon />}
     </IconButton>
     </div>
     </ThemeProvider>
     );
 }