import fse from 'fs-extra';
import path from 'path';

/** 用于注入 webview 中执行的脚本 */
const WEBVIEW_INJECTION = path.join(process.cwd(), 'webview-injection');
/** 外部扩展用的文件夹 */
const EXTERNALS_DIR = path.join(process.cwd(), 'externals');
/** 用于用户扩展到 config 文件 */
const EXTERNAL_CONFIG_YAML = path.join(EXTERNALS_DIR, 'CONFIG.yaml');

[
  EXTERNAL_CONFIG_YAML
].forEach(file => fse.ensureFileSync(file));

export default {
  EXTERNALS_DIR,
  WEBVIEW_INJECTION,
  EXTERNAL_CONFIG_YAML
}
