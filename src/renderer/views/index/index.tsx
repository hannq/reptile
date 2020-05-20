import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import Webview from '../webview';
import { getConfigStream } from '@renderer/renderer-ipc-bus';
import { Button } from 'antd';
import initConfig from '@config';
import { useObservable } from 'rxjs-hooks';

interface IProps {

}

const Index: React.FC<IProps> = () => {
  const [count, setCount] = useState(0);
  const [tatalCount, setTatalCount] = useState(0);
  const config = useObservable(getConfigStream, initConfig);
  console.log('config -->', config)
  useEffect(() => {
    ipcRenderer.on('taskReady', (e, count) => {
      setCount(count);
    });
  }, [])
  return (
    <div>
      <input placeholder="请输入图片数量" type="text" onChange={e => setTatalCount(+e.target.value)}/>
      <div>counts: {tatalCount}/{count}</div>
      <Button onClick={() => {
        setCount(0);
        ipcRenderer.send('screenshot132', tatalCount);
      }}>开始下载</Button>
      <Webview />
    </div>
  )
}

export default Index;
