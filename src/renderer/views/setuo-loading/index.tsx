import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import '../../renderer-ipc-bus';

interface IProps {

}

const Index: React.FC<IProps> = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Loading ...</h1>
      <div>count: {count}</div>
      <div onClick={() => setCount(count => count + 1)}>点我 +1</div>
    </div>
  )
}

export default Index;
