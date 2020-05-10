declare const __DEV__: boolean;

interface Hot {
  accept(path: string, callback: () => void): void;
}

interface NodeModule {
  hot: Hot;
}
