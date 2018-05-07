const mysql = require('mysql2/promise');

class DatabaseMetrics {

    constructor(dbHost, dbPassword) {
        this._dbHost = dbHost;
        this._dbPassword = dbPassword;
    }

    async get() {
        if (this._dbHost && !this.connectionPool) {
            this._connectionPool = await mysql.createPool({
                host: dbHost,
                user: 'pool_server',
                password: dbPassword,
                database: 'pool'
            });
        }

        if (this._connectionPool) {
            // query DB
        }
        else return DUMMY_DATA; // testing only
    }
}

const DUMMY_DATA = {
    "connected": 100,     // currently
    "hashpower": 1000000, // current H/s
    "fee": 0.01,          // fraction
    "rewards": 4000       // per day
}

module.exports = exports = DatabaseMetrics;
