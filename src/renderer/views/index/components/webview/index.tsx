import React, { useState, useEffect, useRef, useReducer, Component, useLayoutEffect } from 'react';
import { ipcRenderer, WebviewTag } from 'electron';
import { useObservable } from 'rxjs-hooks';
import fse from 'fs-extra';
import path from 'path';
import { getConfigStream } from '@renderer/renderer-ipc-bus';
import { useSelector } from '@renderer/hooks';
import './index.less';

declare global {
}

interface IProps {

}

const Index: React.FC<IProps> = () => {
  const webviewRef = useRef<WebviewTag>(null);
  const config = useObservable(getConfigStream);
  const url = useSelector('url');
  console.log('config -->', config);
  console.log('url -->', url);
  useLayoutEffect(() => {
    if (config) {
      const script = fse.readFileSync(path.join(config.WEBVIEW_INJECTION, 'index.js'), 'utf8');
      webviewRef.current.addEventListener('dom-ready', function() {
        webviewRef.current.executeJavaScript(script);
        webviewRef.current.openDevTools();
      })
    }
  }, [config])

  return (
    <webview
      ref={webviewRef}
      src={url}
      className="webview"
    ></webview>
  )
}
// https://thispersondoesnotexist.com/image.jpg
export default Index;
