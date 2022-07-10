import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import colors from 'colors';

import routes from './routes'; // this imports index.ts file
import Logger from './helpers/logger';
import { isDevEnv } from './helpers/env';
import dbConnection from './database/config.db';

const apiV1 = '/api/v1';

class Server {
    private app: Application;
    private port: string;
    private apiPaths= {
        auth: `${apiV1}/auth`,
    };

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3999';

        if (!isDevEnv()) {
            colors.disable()
        }

        // DB Connection
        this.connectDadaBase();
        // Middlewares
        this.middlewares();
        // Body read and parse
        this.app.use(express.json()); // debe llamarse antes de las rutas
        // Routes
        this.setRoutes();
    }

    async connectDadaBase() {
        await dbConnection()
    }

    middlewares() {
        // call middlewares here
        this.app.use(cors());
        this.app.use(morgan('tiny'));
    }

    setRoutes() {
        this.app.use('/api/tests', routes.testsRoutes);
        this.app.use(this.apiPaths.auth, routes.authRoutes);
    }

    listen() {
        // este metodo es llamado despues de instanciar un objeto Server
        this.app.listen(this.port, () => {
            Logger.info(`Server running on port ${this.port}`)
        });
    }
}

export default Server;
