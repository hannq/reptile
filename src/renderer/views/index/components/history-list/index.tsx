import React, {  } from 'react';
import './index.less';

interface IProps {

}

const HistoryList: React.FC<IProps> = () => {
  return (
    <div className="history-list-wrapper">
      <ul>
        {Object.keys(new Array(100).fill(null)).map(i => <li key={i}>item - {i}</li>)}
      </ul>
    </div>
  )
}
// https://thispersondoesnotexist.com/image.jpg
export default HistoryList;
