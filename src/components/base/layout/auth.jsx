import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import styles from './auth.module.sass';
import BackgroundImgAuth from 'assets/login/background.png';
import { ReactComponent as LogoAuth } from 'assets/login/logo.svg';

class AuthLayout extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Container fluid className="container-auth">
          <Row className="h-100 d-flex align-items-center bg-white">
            <Col xs={12} md={6}>
              {this.props.children}
            </Col>
            <Col md={6} className={`h-100 d-flex justify-content-center align-items-center ${styles.authBgImage}`} style={{ backgroundImage: `url(${BackgroundImgAuth})` }}>
              <LogoAuth/>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default AuthLayout;
