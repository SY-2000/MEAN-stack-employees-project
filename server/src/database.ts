import * as mongodb from 'mongodb';
import {Employee} from './employee';

export const collections: {
    employees?: mongodb.Collection<Employee>;
} = {};

export async function connectTodatabase (uri:string){
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("meanStackProject");
    await applySchemaValidation(db);

    const employeesConnection = db.collection<Employee>('employees');
    collections.employees = employeesConnection;
}

async function applySchemaValidation(db: mongodb.Db){
    const jsonSchema = {
    };

    await db.command({
        callMod: 'employees',
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if(error.codeName === 'NamespaceNotFound'){
            await db.createCollection('employees', {validator: jsonSchema})
        }
    })
}