import { isDevEnv } from './env';
import colors from 'colors';
const logLevels = {
    success: 'SUCCESS',
    error: 'ERROR',
    warning: 'WARNING',
    info: 'INFO',
};
class Logger {
    constructor() {}

    private static log(head: string, ...messages: string[]) {
        messages = messages.map((msg) => {
            let newMsg: string;
            if (typeof msg === 'object') {
                newMsg = JSON.stringify(msg, null, 5);
            } else {
                newMsg = msg.toString();
            }

            switch (true) {
                case head.includes(logLevels.success):
                    return newMsg.green;
                case head.includes(logLevels.error):
                    return newMsg.red;
                case head.includes(logLevels.warning):
                    return newMsg.yellow;
                case head.includes(logLevels.info):
                    return newMsg.cyan;

                default:
                    return newMsg;
            }
        });

        messages = [head, ...messages];

        console.log(messages.join('\n'));
    }

    static async success(...messages: string[]) {
        const head: string = colors.bgGreen.white.bold(`${logLevels.success}:`);
        this.log(head, ...messages);
    }

    static async error(...messages: string[]) {
        const head: string = colors.bgRed.white.bold(`${logLevels.error}:`);
        this.log(head, ...messages);
    }

    static async warning(...messages: string[]) {
        const head: string = colors.bgYellow.white.bold(`${logLevels.warning}:`);
        this.log(head, ...messages);
    }

    static async info(...messages: string[]) {
        const head: string = colors.bgCyan.white.bold(`${logLevels.info}:`);
        this.log(head, ...messages);
    }
}

export default Logger;
