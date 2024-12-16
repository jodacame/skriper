import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import Logger from '../logger.js';
import Upgrade from './upgrade.js';
const DB = {
    db: null,
    async init() {
        this.db = new sqlite3.Database((process.env.DB_PATH || '/data/') + 'skriper.db');
        Logger.info(`Database path: ${process.env.DB_PATH || '/data/'}`);
        await this.install();
    },
    async query(sql, params = []) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            if (sql.trim().toUpperCase().startsWith("INSERT")) {
                this.db.run(sql, params, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID });
                    }
                });
            } else {

                this.db.all(sql, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            }
        });
    },
    /**
     * Install the database using ./install.sql file
     * @returns {Promise}
     */
    async install() {
        // check if the database is already installed
        const tables = await this.query("SELECT name FROM sqlite_master WHERE type='table'");
        if (tables.length > 0) {
            const tablesToUpgrade = Object.keys(Upgrade);
            for (const tableName of tablesToUpgrade) {
                Logger.info(`Upgrading table ${tableName}`);
                const table = Upgrade[tableName];
                const fields = Object.keys(table);
                Logger.info(`Fields: ${fields.join(', ')}`);
                // Check if table exists and columns are correct
                const tableInfo = await this.query(`PRAGMA table_info(${tableName})`);
                const columns = tableInfo.map((column) => column.name);
                Logger.info(`Columns: ${columns.join(', ')}`);
                for (const field of fields) {
                    if (!columns.includes(field)) {
                        Logger.info(`Adding column ${field}`);
                        await this.query(`ALTER TABLE ${tableName} ADD COLUMN ${field} ${table[field]}`);
                    }
                }
            }
            return Promise.resolve();
        }
        const __dirname = path.resolve();
        const sql = fs.readFileSync(path.join(__dirname, 'utils/db/install.sql'), 'utf8');
        const queries = sql.split(';');
        for (const query of queries) {
            if (query.trim().length > 0) {
                await this.query(query);
            }
        }
    }
};

DB.install();
export default DB;