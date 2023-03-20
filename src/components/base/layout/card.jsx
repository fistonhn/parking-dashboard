import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { showMessages } from 'components/helpers/messages';

function CardLayout ({ messages, isFetching, children }) {
  return (
    <Container>
      <Row>
        <Col sm={9} md={7} lg={5} className="mx-auto">
          <div className=" my-5">
            <div className="">
              <fieldset disabled={isFetching}>
                {children}
              </fieldset>
              {showMessages(messages)}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CardLayout;
