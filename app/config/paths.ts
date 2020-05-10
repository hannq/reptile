import fse from 'fs-extra';
import path from 'path';

const EXTERNALS_DIR = path.join(process.cwd(), 'externals');
const EXTERNAL_CONFIG_YAML = path.join(EXTERNALS_DIR, 'CONFIG.yaml');

[
  EXTERNAL_CONFIG_YAML
].forEach(file => fse.ensureFileSync(file));

export default {
  EXTERNALS_DIR,
  EXTERNAL_CONFIG_YAML
}
