import SQLite from 'react-native-sqlite-storage';
import { DATABASE, ACTION } from './const';

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

    executeSql(sql, params = []) {
        return this.database
            .then(db => db.executeSql(sql, params));
    }

    /**
     * Save action to db
     * @param {{ cattleId, feedId, feedType, quantity, actionTime }} action
     * @returns {Number} saved actionId
     */
    saveAction(action) {
        var { cattleId, feedId, feedType, quantity, actionTime } = action;

        return this.database
            .then(db => new Promise((resolve, reject) => {
                try {
                    let [results] = await db.executeSql(`
                        INSERT INTO 
                            Action(cattleId, feedId, feedType, quantity, actionTime) VALUES(?, ?, ?, ?, ?);`,
                        [cattleId, feedId, feedType, quantity, actionTime]);

                    console.log('saveAction INSERT Action result: ', results);

                    if (results.insertId) {
                        resolve(results.insertId);
                    }

                    throw "Failed to insert Action";
                }
                catch (error) {
                    reject(error);
                }
            }));
    }

    resultToObjects(result) {

        if (result === undefined) {
            return [];
        }

        const count = result.rows.length;
        const objs = [];

        for (let i = 0; i < count; i++) {
            const obj = result.rows.item(i);
            objs.push(obj);
        }
    }

    /**
     * Get un-uploaded actions with un-uploaded childs
     * */
    getUnuploadedActions() {
        return this.database
            .then(db => new Promise((resolve) => {
                let [result] = await db.executeSql(
                    `SELECT * FROM Action WHERE Status <> ?`,
                    [ACTION.STATUS.UPLOADED]);

                const actions = this.resultToObjects(result);

                // Retrieve cage scan
                actions.map((action) => {
                    var [result2] = await db.executeSql(`SELECT * FROM CageScan WHERE actionId = ? and Status <> ?`, [action.actionId, ACTION.STATUS.UPLOADED]);
                    action.cages = this.resultToObjects(result2);
                })

                resolve(actions);
            }));
    }

    /**
     * Update action status
     * @param {any} actionId
     * @param {any} status
     */
    updateActionStatus(actionId, status) {
        return this.database
            .then(db => db.executeSql(`UPDATE Action SET Status = ? WHERE actionId = ?;`, [status, actionId]));
    }

    /**
     * Save cage scan to db
     * @param {{actionId, qr, quantity, picturePaths}} cage cage info
     */
    saveCage(cage) {

        var { actionId, qr, quantity, picturePaths } = cage;
        return this.database
            .then(db => new Promise((resolve, reject) => {
                try {
                    picturePaths = JSON.stringify(picturePaths || []);
                    let [results] = this.database.executeSql(`INSERT INTO CageScan(actionId, qr, quantity, picturePaths) VALUES (?, ?, ?, ?);`,
                        [actionId, qr, quantity, picturePaths]);

                    if (results.insertId) {
                        resolve(results.insertId);
                    }

                    throw `Failed to insert Cage Scan ${qr}`;
                }
                catch (error) {
                    reject(error);
                }
            }));
    }

    /**
     * Upsate cage scan status
     * @param {any} scanId scanId. This Id is specific for this cage, in this action.
     * @param {any} status scan status
     */
    updateCageStatus(scanId, status) {
        return this.database
            .then(db => db.executeSql(`UPDATE CageScan SET Status = ? WHERE scanId = ?;`, [status, scanId]));
    }
}
