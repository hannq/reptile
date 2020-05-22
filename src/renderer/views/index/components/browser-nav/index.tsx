import React, { useState, useEffect, useRef, useReducer, Component, useLayoutEffect } from 'react';
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

interface IProps {

}

const BrowserNav: React.FC<IProps> = () => {
  return (
    <Row>
      <Col
        className="left-part"
        span={3}
      >
        <ArrowLeftOutlined className="operator-icon"/>
        <ArrowRightOutlined className="operator-icon" />
        <ReloadOutlined className="operator-icon" />
      </Col>
      <Col span={20} offset={1}>
        <Input placeholder="请输入网址..." />
      </Col>
    </Row>
  )
}
// https://thispersondoesnotexist.com/image.jpg
export default BrowserNav;
