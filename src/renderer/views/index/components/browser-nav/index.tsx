import React, { useCallback, useState } from 'react';
import {
  Row,
  Col,
  Input
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import './index.less';
import { useDispatch, useSelector } from '@renderer/hooks';

interface IProps {

}

const BrowserNav: React.FC<IProps> = () => {
  const [dispath, state] = useDispatch();
  const [url, setUrl] = useState(state.url)
  const handleInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value)
  }, [url])
  const handleSearch = useCallback((v: string) => dispath({ url }), [url])
  const handleGoTo = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    event.keyCode === 13 && dispath({ url })
  }, [url])

  return (
    <Row className="browser-nav-wrapper">
      <Col
        className="left-part"
        span={3}
      >
        <ArrowLeftOutlined className="operator-icon"/>
        <ArrowRightOutlined className="operator-icon" />
        <ReloadOutlined className="operator-icon" />
      </Col>
      <Col span={20} offset={1}>
        <Input.Search
          onSearch={handleSearch}
          onKeyUp={handleGoTo}
          value={url}
          placeholder="请输入网址..."
          onChange={handleInput}
        />
      </Col>
    </Row>
  )
}
// https://thispersondoesnotexist.com/image.jpg
export default BrowserNav;
