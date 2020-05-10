import YAML from 'yaml';
import fse from 'fs-extra';
import paths from './paths';
import logger from 'electron-log';
import { isNullOrUndefined } from 'util';

class Config {
  readonly LOG_PATH: string = logger.transports.file.file;
  readonly CHROME_EXEC_PARH: string = null;
  constructor(externalConfig: Partial<Config>) {
    externalConfig && Object.keys(this).forEach(key => {
      if (!isNullOrUndefined(externalConfig[key])) this[key] = externalConfig[key];
    });
  }
}

const externalConfig: Partial<Config> = YAML.parse(fse.readFileSync(paths.EXTERNAL_CONFIG_YAML, { encoding: 'utf8' }));

export {
  paths
}

export default new Config(externalConfig);
