class ServerMetrics {
    constructor(poolServer) {
        this._poolServer = poolServer;
    }

    async get() {
        const clients = this._poolServer.getClientModeCounts();
        return {
            serverName: this._poolServer.name,
            unregisteredClients: clients.unregistered,
            smartClients: clients.smart,
            nanoClients: clients.nano,
            ipsBanned: this._poolServer.numIpsBanned,
            blocksMined: this._poolServer.numBlocksMined,
            totalShareDifficulty: this._poolServer.totalShareDifficulty
        };

    }
}
