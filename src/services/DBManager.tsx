import { db } from "../db/DBConfig";
import { DataTable, ITable, ITableDBGet, TableName } from "../interface/database";

export async function addDataDB(table: ITable) {
    return new Promise(async (resolve, reject) => {
    try {
        const id = await db.table(table.table).add(table.data);
        resolve(id);
    }
    catch (e) {
        console.error(e);
        reject(e);
    }
});
}

export async function getDataDB(data: ITableDBGet): Promise<DataTable>{
    return new Promise(async (resolve, reject) => {
    try {
        const result = await db.table(data.table).get(data.value);
        resolve(result);
    }
    catch (e) {
        console.error(e);
        reject(e);
    }
});
}

export async function getFromColumnDataDB(table: TableName, column: string, value: any): Promise<DataTable[]> {
    return new Promise(async (resolve, reject) => {
    try {
        const result = await db.table(table).where(column).equals(value).toArray();
        resolve(result);
    }
    catch (e) {
        console.error(e);
        reject(e);
    }
});
}

export async function addOrUpdateDataDB(table: ITable) {
    return new Promise(async (resolve, reject) => {
    try {
        const result = await db.table(table.table).put(table.data);
        resolve(result);
    }
    catch (e) {
        console.error(e);
        reject(e);
    }
});
}

export async function multiAddOrUpdateDataDB(table: ITable[]) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await db.transaction("rw", table.map((t) => t.table), async () => {
                await Promise.all(table.map(async (t) => {
                    await addOrUpdateDataDB(t);
                }));
            });
            resolve(result);
        }
        catch (e) {
            console.error(e);
            reject(e);
        }
    }
);
}

export async function getAllDataDB(table: TableName) {
    return new Promise(async (resolve, reject) => {
    try {
        const result = await db.table(table).toArray();
        resolve(result);
    }
    catch (e) {
        reject(e);
    }
});
}

export async function checkDataAlreadyExist(table: TableName, id: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
    try {
        const result = await db.table(table).get(id);
        resolve(result !== undefined);
    }
    catch (e) {
        reject(e);
    }
});
}

export async function deleteDataDB(table: TableName, id: string | number) {
    return new Promise(async (resolve, reject) => {
    try {
        const result = await db.table(table).delete(id);
        resolve(result);
    }
    catch (e) {
        reject(e);
    }
});
}
