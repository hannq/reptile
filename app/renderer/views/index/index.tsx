import React, { useState } from 'react';
import { ipcRenderer } from 'electron';

interface IProps {

}

const Index: React.FC<IProps> = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div>count: {count}</div>
      <button onClick={() => {
        setCount(count + 1)
        ipcRenderer.send('screenshot132');
      }}>count + 1</button>
    </div>
  )
}

export default Index;
