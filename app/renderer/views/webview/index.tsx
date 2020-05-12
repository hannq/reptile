import React, { useState, useEffect, useRef } from 'react';
import { ipcRenderer } from 'electron';

interface IProps {

}

const Index: React.FC<IProps> = () => {
  return (
    <>
      <webview
        style={{ display: 'flex', width: 640, height: 480 }}
        src="https://thispersondoesnotexist.com/image.jpg"
      ></webview>
    </>
  )
}

export default Index;
