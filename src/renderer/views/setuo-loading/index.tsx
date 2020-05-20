import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import '../../renderer-ipc-bus';
import { Spin } from 'antd';
import './index.less';

interface IProps {

}

const Index: React.FC<IProps> = () => {
  return (
    <div className="loading-wrapper">
      <Spin delay={100} size="large" />
    </div>
  )
}

export default Index;
