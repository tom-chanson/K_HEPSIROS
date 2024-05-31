import * as cheerio from 'cheerio';
// import axios from 'axios';
import { fetch as fetchTauri } from '@tauri-apps/plugin-http';
import { endOfMonth, startOfMonth } from 'date-fns';
import { edtUrlAction, edtUrlServerId } from "../const";
import { ICalendarDb } from "../interface/database";
import { IFetchClass, IFetchException, IFetchResult } from "../interface/fetch";
import { addOrUpdateDataDB, getDataDB } from "../services/DBManager";

declare global {
    interface Window {
      __TAURI_INTERNALS__: Record<string, unknown>;
    }
}

 
async function Fetch(login: string, date: Date): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        let url = `?action=${edtUrlAction}&serverid=${edtUrlServerId}&tel=${login}&date=${dateString}%208:00`;
        // console.log(url);
        try{

            // const responseDOM: string = await invoke("scrap", { url });
            // const response: IHttpResponse = JSON.parse(responseDOM) as IHttpResponse;
            // resolve(response);
            // const response = await (await axios.get(url)).data
            let response = "";
            const timeout = 15000;
            // console.log(window.__TAURI_INTERNALS__)
            if (window.__TAURI_INTERNALS__) {
                // console.log("tauri app detected");
                url = `https://edtmobiliteng.wigorservices.net/WebPsDyn.aspx${url}`;
                // url = `/edt?Action=${edtUrlAction}&serverid=${edtUrlServerId}&tel=${login}&date=${dateString}%208:00`
                // console.log(url);
                let response_tauri = await fetchTauri(url, {
                    method: "GET",
                    connectTimeout: timeout,
                    
                })
                //récupérer le body de la réponse
                response = await response_tauri.text();
                // console.log(response);
            } else {
                if (process.env.NODE_ENV === 'production') {
                    console.log("web app detected");
                    url = `/edt${url}`; //proxy
                } else {
                    url = `/edt${url}`; //proxy
                    // url = `https://edtmobiliteng.wigorservices.net/WebPsDyn.aspx${url}`;
                }
                // url = `/edt?Action=${edtUrlAction}&serverid=${edtUrlServerId}&tel=${login}&date=${dateString}%208:00`
                // console.log("Web app detected");
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                const response_fetch = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                response = await response_fetch.text();
                if (response === "" || !response_fetch.ok) {
                    throw new Error("Erreur lors de la récupération des données (jour: " + dateString + ")");
                }
            }
            
            // console.log(response);
            
            resolve(response);
        }
        catch(e){
            console.error(e);
            reject(new Error("Erreur lors de la récupération des données (jour: " + dateString + ")"));
        }
    });
}

function getFirstMondayOfWeek(date: Date) {
    const day = date.getDay(); // Jour de la semaine (0 pour dimanche, 1 pour lundi, ..., 6 pour samedi)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajustement pour obtenir le lundi de la semaine
    const monday = new Date(date.setDate(diff));

    return monday;
}

function getListMonday(firstDayOfMonth: Date) {
    let listMonday: Date[] = [];
    //récupérer les lundis du mois
    const lastDayOfMonth = endOfMonth(firstDayOfMonth);
    let monday = firstDayOfMonth;
    while (monday <= lastDayOfMonth) {
        if (monday.getDay() === 1) {
            listMonday.push(monday);
        }
        monday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 1);
    }

    //si le mois commence entre lundi et vendredi, récupérer les cours de la semaine précédente
    if (firstDayOfMonth.getDay() !== 0 && firstDayOfMonth.getDay() !== 6) {
        const mondayPreviousWeek = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), firstDayOfMonth.getDate() - firstDayOfMonth.getDay() + 1);
        listMonday.unshift(mondayPreviousWeek);
    }
    return listMonday;
}

export async function FetchMonth(login: string, date: Date, updateDelay: number, forceUpdate:boolean): Promise<IFetchResult> {
    const firstDayOfMonth = startOfMonth(date);
    const listMonday = getListMonday(firstDayOfMonth);
    const listPromise: Promise<IFetchResult>[] = [];

    listMonday.forEach((monday) => {
        listPromise.push(FetchWeek(login, monday, updateDelay, forceUpdate));
    });
    const resultPromise = await Promise.all(listPromise);
    let result: IFetchResult = {
        data: [],
        exception: [],
        user: login,
    }
    resultPromise.forEach((week) => {
        result.data = result.data.concat(week.data);
        result.exception = result.exception.concat(week.exception);
    });
    return result;
}

export async function FetchWeek(login: string, date: Date, updateDelay: number, forceUpdate:boolean): Promise<IFetchResult> {
    let result: IFetchResult = {
        data: [],
        exception: [],
        user: login,
    }
    const monday = getFirstMondayOfWeek(date);

    const listPromise: Promise<IFetchResult>[] = [];
    for (let i = 0; i < 5; i++) {
        const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
        listPromise.push(FetchDay(login, day, updateDelay, forceUpdate));
        // console.log("day");
        // console.log(day);
    }
    const resultPromise = await Promise.all(listPromise);
    resultPromise.forEach((day) => {
        result.data = result.data.concat(day.data);
        result.exception = result.exception.concat(day.exception);
    });
    return result;
}

export async function FetchDay(login: string, date: Date, updateDelay: number, forceUpdate: boolean): Promise<IFetchResult> {
    const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const pk = btoa(`${dateString}_${login}`)
    let result: IFetchResult = {
        data: [],
        exception: [],
        user: login,
    }
    let dataDb: ICalendarDb | undefined = undefined;
    if (!forceUpdate) {
        dataDb = await getDataDB({ table: "calendar", value: pk }) as ICalendarDb;
        if (dataDb){
            // ajouter le updateDelay (en minutes) à la date de mise à jour
            const updateDate = new Date(dataDb.update_date.getTime() + updateDelay * 60000);
            const dateUpdateMidnight = new Date(updateDate.getFullYear(), updateDate.getMonth(), updateDate.getDate(), 0, 0, 0, 0);
            if (updateDate > new Date() || dataDb.date < dateUpdateMidnight) {
                // console.log(`data from db: ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
                result.data = dataDb.event;
                return result;
            }
        }
    }
    let resultFetch: IFetchClass[] = [];
    try{
        resultFetch = await getFetchData(login, date);
    }
    catch(e){
        const exception: Error = e as Error;
        let error: IFetchException = {
            message: exception.message as string,
            date: dateDay,
            error: true,
        }
        result.exception.push(error);
        if (!dataDb) {
            dataDb = await getDataDB({ table: "calendar", value: pk }) as ICalendarDb;
        }
        if (dataDb) {
            result.data = dataDb.event;
            error.date_data = dataDb.update_date;
        }
        return result;
    }
    // console.log("result");
    const resultDb: ICalendarDb = {
        pk: pk,
        date: dateDay,
        user: login,
        update_date: new Date(),
        event: resultFetch
    }
    result.data = resultFetch;
    //ajouter les données dans la base de données ou mettre à jour
    await addOrUpdateDataDB({ table: "calendar", data: resultDb });
    // console.log(`data from fetch: ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    return result;
}

async function getFetchData(login: string, date: Date): Promise<IFetchClass[]> {
    let response = "";
    try{
        response = await Fetch(login, date);
        if (date.getMonth() === 6 && date.getDate() === 20) {
            throw new Error("Erreur lors de la récupération des données (jour: " + date.getDate() + ")");
        }
    }
    catch(e){
        throw e;
    }
    const $ = cheerio.load(response);
    const divLine = $('.Ligne');

    const result: IFetchClass[] = [];
    const elementBase64: string[] = [];

    divLine.each((_index, element) => {
        /* récupérer le contenu de la div avec la class "Debut" */
        const start = $(element).find('.Debut').text();
        const date_start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(start.split(':')[0]), parseInt(start.split(':')[1]));
        const end = $(element).find('.Fin').text();
        const date_end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(end.split(':')[0]), parseInt(end.split(':')[1]));
        const title = $(element).find('.Matiere').text();
        const teacher = $(element).find('.Prof').text();
        const room = $(element).find('.Salle').text();
        // s' il ne s'agit pas d'un doublon (oui oui, on vous connait l'EPSI :) )

        //vérifier si l'élément existe déjà dans le tableau
        //encoder en base 64 pour comparer

        const elementLatin1 = encodeURIComponent(`${date_start}-${date_end}-${title}-${room}-${teacher}`); 

        const element64 = btoa(elementLatin1);
        if (elementBase64.includes(element64)) {
            return;
        }
        elementBase64.push(element64);
        result.push({
            start: date_start,
            end: date_end,
            title,
            room,
            teacher,
            date_update: new Date(),
            error: false,
        });
    });
    // console.log("result");
    // console.log(result);
    return result;
}
