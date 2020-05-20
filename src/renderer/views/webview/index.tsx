import React, { useState, useEffect, useRef, useReducer, Component, useLayoutEffect } from 'react';
import { ipcRenderer, WebviewTag } from 'electron';
import { useObservable } from 'rxjs-hooks';
import fse from 'fs-extra';
import path from 'path';
import { getConfigStream } from '@renderer/renderer-ipc-bus';

declare global {
}

interface IProps {

}

const Index: React.FC<IProps> = () => {
  const webviewRef = useRef<WebviewTag>(null);
  const config = useObservable(getConfigStream);
  console.log('config -->', config);
  useLayoutEffect(() => {
    if (config) {
      const script = fse.readFileSync(path.join(config.WEBVIEW_INJECTION, 'index.js'), 'utf8');
      console.log('script ==>', script)
      webviewRef.current.executeJavaScript(script);
      webviewRef.current.openDevTools();
    }
  }, [config])

  return (
    <>
      <webview
        ref={webviewRef}
        style={{ display: 'flex', width: 640, height: 480 }}
        src="https://www.baidu.com"
      ></webview>
    </>
  )
}
// https://thispersondoesnotexist.com/image.jpg
export default Index;
