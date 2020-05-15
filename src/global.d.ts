declare const __DEV__: boolean;
declare const __DEV_PORT__: string;

interface Hot {
  accept(path: string, callback: () => void): void;
}

interface NodeModule {
  hot: Hot;
}
