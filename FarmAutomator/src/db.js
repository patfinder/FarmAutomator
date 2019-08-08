import SQLite from 'react-native-sqlite-storage';
import { DATABASE } from './const';

export default class Database {
    constructor() {
        this._database = undefined;
    }

    get database() {
        if (this._database !== undefined) {
            return Promise.resolve(this._database);
        }

        // otherwise: open the database first
        return this.open();
    }

    /**
     * Open the connection to the database
     * */
    open(){
        //SQLite.DEBUG(true);
        SQLite.enablePromise(true);

        return SQLite.openDatabase({
            name: DATABASE.FILE_NAME,
            location: "default"
        })
            .then(db => {
                this._database = db;
                console.log("[db] Database open!");

                return this.initialize(this._database);
            })
            .then(() => {
                return this._database;
            });
    }

    /**
     * Close the connection to the database
     * */
    close() {
        if (this._database === undefined) {
            return Promise.reject("[db] Database was not open; unable to close.");
        }
        return this._database.close().then(status => {
            console.log("[db] Database closed.");
            this._database = undefined;
        });
    }

    initialize(database) {
        // List table
        return database.transaction(this.createTables);
    }

    createTables(transaction) {

        // Action table
        transaction.executeSql(`CREATE TABLE IF NOT EXISTS "Action" ( actionId INTEGER, cattleId TEXT, feedId TEXT, feedType TEXT, quantity REAL, actionTime NUMERIC, PRIMARY KEY(actionId) );`);

        // Cage scan table
        transaction.executeSql(`CREATE TABLE IF NOT EXISTS "CageScan" ( scanId INTEGER, qr TEXT, quantity REAL, picturePaths TEXT, PRIMARY KEY(scanId) );`);
    }

    executeSql(sql) {
        return this.database
            .then(db => db.executeSql(sql));
    }
}
