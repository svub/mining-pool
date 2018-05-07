const fs = require('fs');
const https = require('https');
const database = require('metrics/database.js');
const server = require('metrics/server.js');

class MetricsServer {
    constructor(dbHost, dbPassword, poolServer, port = 8442) {
        this._poolServer = poolServer;

        const databaseMetrics = new DatabaseMetrics(dbHost, dbPassword);
        const serverMetrics = new ServerMetrics(poolServer);

        https.createServer(options, (req, res) => {
            const db = await databaseMetrics.get();
            const server = serverMetrics.get();
            const raw = Object.assign(db, server);
            const extended = this.extend(raw);
			const formatted = this.format(raw);
            res.write(JSON.stringify(formatted));
            res.end();
        }).listen(port);
    }

    extend(data) {
        data.expected = data.rewards/data.connected;
        return data;
    }

    format(raw) {
        let formatted = Object.assign({}, raw);

        let index = 0, scale = ['H/s', 'kH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s'];
        while (formatted.hashpower >= 1000) {
            index++;
            formatted.hashpower /= 1000;
        }
        formatted.hashpower = `${ formatted.hashpower } ${ scale[index] }`

        return { raw, formatted };
    }
}

module.exports = exports = MetricsServer;
