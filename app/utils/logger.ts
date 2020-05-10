import logger from 'electron-log';
import config from '../config';

if (config.LOG_PATH) logger.transports.file.file = config.LOG_PATH;

export default logger;

