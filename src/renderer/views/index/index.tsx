import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import Webview from './components/webview';
import BrowserNav from './components/browser-nav';
import OperationBar from './components/operation-bar';
import HistoryList from './components/history-list';
import { Layout } from 'antd';
import { getConfigStream } from '@renderer/renderer-ipc-bus';
import initConfig from '@config';
import { useObservable } from 'rxjs-hooks';
import './index.less';


interface IProps {

}

const Index: React.FC<IProps> = () => {
  // const [count, setCount] = useState(0);
  // const [tatalCount, setTatalCount] = useState(0);
  // const config = useObservable(getConfigStream, initConfig);
  // console.log('config -->', config)
  // useEffect(() => {
  //   ipcRenderer.on('taskReady', (e, count) => {
  //     setCount(count);
  //   });
  // }, [])
  return (
    <Layout style={{ height: '100%' }}>
      <Layout.Sider style={{ border: '1px solid #ccc' }}>
        <div className="sider-bar-wrapper">
          <OperationBar />
          <HistoryList />
        </div>
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ border: '1px solid #ccc' }}>
          <BrowserNav />
        </Layout.Header>
        <Layout.Content style={{ border: '1px solid #ccc' }}>
          <Webview />
        </Layout.Content>
        <Layout.Footer style={{ border: '1px solid #ccc' }}>Footer</Layout.Footer>
      </Layout>
      {/* <input placeholder="请输入图片数量" type="text" onChange={e => setTatalCount(+e.target.value)}/>
      <div>counts: {tatalCount}/{count}</div>
      <Button onClick={() => {
        setCount(0);
        ipcRenderer.send('screenshot132', tatalCount);
      }}>开始下载</Button>
      <Webview /> */}
    </Layout>
  )
}

export default Index;
