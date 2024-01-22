import {Logger} from 'telegram';
// import firstInit from './firstInit';

export default class NewLogger extends Logger {
    info(message: string) {
        console.log(`\x1b[33m Info: ${message} \x1b[0m`);

        if (message === 'The server closed the connection') {
            // firstInit();
        }
    }
}
