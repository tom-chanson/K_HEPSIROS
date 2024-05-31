import { IFetchClass } from "./fetch";

export interface ISettingsDb {
    name: string;
    value: string;
  }
  
  export type TableName = "settings" | "calendar" | "user";
  export type DataTable = ISettingsDb | ICalendarDb | IUserDb;
  
  interface ITableGeneric {
    table: TableName;
    data: DataTable;
  }

  export interface ITableUser extends ITableGeneric {
    table: "user";
    data: IUserDb;
  }

  export interface ITableSettings extends ITableGeneric {
    table: "settings";
    data: ISettingsDb;
  }

  export interface ITableCalendar extends ITableGeneric {
    table: "calendar";
    data: ICalendarDb;
  }

  export type ITable = ITableUser | ITableSettings | ITableCalendar;
  
  export interface ITableDBGet {
    table: TableName;
    value: string | number;
  }
  
  export interface ICalendarDb {
    pk: string;
    date: Date;
    user: string;
    update_date: Date;
    event: IFetchClass[];
  }

  export interface IUserDb {
    id?: number;
    identifiant: string;
    name: string;
  }