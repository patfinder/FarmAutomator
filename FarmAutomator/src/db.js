import SQLite from 'react-native-sqlite-storage';
import { DATABASE, ACTION } from './const';
import { dirHome } from './screens/dirStorage';

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
    open(initDb = true){
        //SQLite.DEBUG(true);
        SQLite.enablePromise(true);

        console.log('db.open db folder', { dirHome });

        return SQLite.openDatabase({
            name: DATABASE.FILE_NAME,
            location: "default"
        })
            .then(db => {
                this._database = db;
                console.log("[db] Database open!");

                if (!initDb) return this._database;

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
        transaction.executeSql(`CREATE TABLE Action (
            actionId INTEGER, cattleId TEXT NOT NULL, feedId TEXT NOT NULL, feedType TEXT NOT NULL,
                quantity REAL NOT NULL, actionTime NUMERIC NOT NULL, status TEXT NOT NULL, PRIMARY KEY(actionId) )
            WITHOUT ROWID;`);

        // Cage scan table
        transaction.executeSql(`CREATE TABLE CageScan ( 
            actionId INTEGER NOT NULL, scanId INTEGER, qr TEXT NOT NULL, quantity REAL NOT NULL,
            picturePaths TEXT NOT NULL, status TEXT NOT NULL, PRIMARY KEY(scanId) )
        WITHOUT ROWID;`);
    }

    removeTables() {
        return this.open(false)
            .then((db) => {
                db.transaction((trans) => {
                    trans.executeSql("DROP TABLE IF EXISTS Action;");
                    trans.executeSql("DROP TABLE IF EXISTS CageScan;");
                })
            });
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
                    db.executeSql(`
                        INSERT INTO 
                            Action(cattleId, feedId, feedType, quantity, actionTime) VALUES(?, ?, ?, ?, ?);`,
                        [cattleId, feedId, feedType, quantity, actionTime])
                        .then(([result]) => {

                            console.log('saveAction INSERT Action result: ', result);

                            if(result.insertId) {
                                resolve(result.insertId);
                            }

                            throw "Failed to insert Action";
                        });
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
                db.executeSql(
                    `SELECT * FROM Action WHERE Status <> ?`,
                    [ACTION.STATUS.UPLOADED])
                    .then(([result]) => {

                        const actions = this.resultToObjects(result);

                        // Retrieve cage scan
                        var scanPromises = actions.map(action => new Promise((resolve) => {
                            db.executeSql(`SELECT * FROM CageScan WHERE actionId = ? and Status <> ?`, [action.actionId, ACTION.STATUS.UPLOADED])
                                .then(([result2]) => {
                                    action.cages = this.resultToObjects(result2);
                                    resolve(action.cases);
                                });
                        }));

                        resolve(Promise.all(scanPromises));
                    });
            }));
    }

    /**
     * Get unuploaded action OR actions with unuploaded scans
     * Unuploaded: status = new OR failed
     * */
    getUnuploadedActionsEx() {
        return this.database
            .then(db => new Promise((resolve) => {
                db.executeSql(`
                    SELECT a.actionId actionId, cattleId, feedId, feedType, a.quantity quantity, actionTime, a.status status, 
                        scanId, qr, s.quantity s_quantity, picturePaths, s.status s_status 
                        FROM Action a 
                        INNER join CageScan s on a.actionId = s.actionId
                        WHERE a.Status IN (?, ?) ? OR s.Status IN (?, ?)`,
                    [ACTION.STATUS.NEW, ACTION.STATUS.FAILED, ACTION.STATUS.NEW, ACTION.STATUS.FAILED])
                    .then(([result]) => {
                        const actionRows = this.resultToObjects(result);

                        var actionGroups = this.groupActions(actionRows);

                        resolve(actionGroups);
                    });
            }));
    }


    /**
     * Group action into object of this shape:
     * {[actionId]: {...action, scans[{...scan}]} }
     * @param {any} actions
     * @returns actions grouped by actionId
     */
    groupActions(actions) {
        return actions.reduce(function (accu, cur) {

            // action
            var { actionId, cattleId, feedId, feedType, quantity, actionTime, status} = cur;

            var action;

            // group
            if (accu[cur.actionId]) {
                action = accu[cur.actionId];
            }
            else {
                accu[cur.actionId] = (
                    action = { actionId, cattleId, feedId, feedType, quantity, actionTime, status }
                );
            }

            // scan
            var { scanId, qr, s_quantity, picturePaths, s_status} = cur;
            var scan = { actionId, scanId, qr, quantity: s_quantity, picturePaths, status: s_status };

            action.scans.push(scan);

            return accu;
        }, {});
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
     * @returns new row Id
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
