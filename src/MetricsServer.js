const Nimiq = require('@nimiq/core');
const fs = require('fs');
const https = require('https');

const DatabaseMetrics = require('./metrics/DatabaseMetrics.js');
const ServerMetrics = require('./metrics/ServerMetrics.js');

class MetricsServer {
    constructor(sslKeyPath, sslCertPath, dbHost, dbPassword, poolServer, port = 8442) {
        this._poolServer = poolServer;

        const databaseMetrics = new DatabaseMetrics(dbHost, dbPassword);
        const serverMetrics = new ServerMetrics(poolServer);

        Nimiq.Log.i(TAG, 'starting metrics server');
        const sslOptions = {
            key: fs.readFileSync(sslKeyPath),
            cert: fs.readFileSync(sslCertPath)
        };
        const httpsServer = https.createServer(sslOptions, async (req, res) => {
            Nimiq.Log.i(TAG, 'preparing metrics...');
            const db = await databaseMetrics.get();
            const server = serverMetrics.get();
            const raw = Object.assign(db, server);
            const extended = this.extend(raw);
            const formatted = this.format(raw);
            const json = JSON.stringify(formatted, null, 4);
            res.writeHead(200);
            res.end(json);
            Nimiq.Log.i(TAG, `Lastest: ${ json }`);
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

        return { about, raw, formatted };
    }
}

const TAG = 'Metrics';
const about = { version: '1.0.0' }

module.exports = exports = MetricsServer;
