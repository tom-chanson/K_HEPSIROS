import Dexie from 'dexie';
import { ICalendarDb, ISettingsDb, IUserDb } from "../interface/database";

export const DBConfig = {
    name: "Calenpsi",
    version: 1,
    objectStoresMeta: [
      {
        store: "settings",
        storeConfig: { keyPath: "name", autoIncrement: false },
        storeSchema: [
          { name: "name", keypath: "name", options: { unique: true } },
          { name: "value", keypath: "value", options: { unique: false } },
        ],
      },
      {
        store: "calendar",
        storeConfig: { keyPath: "pk", autoIncrement: false },
        storeSchema: [
          { name: "pk", keypath: "pk", options: { unique: true } },
          { name: "date", keypath: "date", options: { unique: false } },
          { name: "user", keypath: "user", options: { unique: false } },
          { name: "update_date", keypath: "update_date", options: { unique: false } },
          { name: "event", keypath: "event", options: { unique: false }},
        ],
      },
      {
        store: "user",
        storeConfig: { keyPath: "id", autoIncrement: true },
        storeSchema: [
          { name: "id", keypath: "id", options: { unique: true } },
          { name: "identifiant", keypath: "identifiant", options: { unique: true } },
          { name: "name", keypath: "name", options: { unique: false } },
        ],
      }
    ],
  };

export class DB extends Dexie {
  settinds!: Dexie.Table<ISettingsDb>;
  calendar!: Dexie.Table<ICalendarDb, String>;
  user!: Dexie.Table<IUserDb, String>;

  constructor() {
    super('Calenpsi');
    this.version(1).stores({
      settings: 'name,value',
      calendar: 'pk,date,user,update_date,event',
      user: '++id,&identifiant,name'
    });
  }
}

export const db = new DB();

