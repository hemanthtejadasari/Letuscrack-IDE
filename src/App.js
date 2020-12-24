import React from 'react';

import Main from './comps/main'
import Sidebar from './comps/sidebar'
import './styles/main.scss'

import { Container, Row, Col } from 'react-bootstrap'

class App extends React.Component {
  render() {
    return (
      <Container id="app" fluid>
        <Row>
          <Col lg={8} sm={12}>
            <Main />
          </Col>
          <Col className="py-2" lg={4}>
            <Sidebar />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
