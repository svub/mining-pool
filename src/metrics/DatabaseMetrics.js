const mysql = require('mysql2/promise');

class DatabaseMetrics {

    constructor(dbHost, dbPassword) {
        this._dbHost = dbHost;
        this._dbPassword = dbPassword;
    }

    async get() {
        if (this._dbHost && !this.connectionPool) {
            this._connectionPool = await mysql.createPool({
                host: this._dbHost,
                user: 'pool_server',
                password: this._dbPassword,
                database: 'pool'
            });
        }

        if (this._connectionPool) {
            // query DB
	    return DUMMY_DATA; // testing only
        }
        else return DUMMY_DATA; // testing only
    }
}

const DUMMY_DATA = {
    "connected": 0,  // currently
    "hashpower": 0,  // current H/s
    "fee": 0.01,     // fraction
    "rewards": 4000  // avg block rewards per day
}

module.exports = exports = DatabaseMetrics;
