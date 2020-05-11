import React, { useState, useEffect, useRef } from 'react';
import { ipcRenderer } from 'electron';

interface IProps {

}

const Index: React.FC<IProps> = () => {
  const [count, setCount] = useState(0);
  const webviewRef = useRef<HTMLWebViewElement>(null);
  useEffect(() => {
  }, [])

  return (
    <webview
      ref={webviewRef}
      style={{ display: 'flex', width: 640, height: 480 }}
      src="https://www.baidu.com/"
    ></webview>
  )
}

export default Index;
