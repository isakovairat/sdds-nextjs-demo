import { Col, Grid, Row, TextM } from '@salutejs/sdds-serv';
import s from './Footer.module.scss';

export const Footer = () => {
  return (
    <Grid view="default">
      <Row>
        <Col>
          <TextM>
            Sberbank has been working in India since 2010, and has been working with clients from large and medium-sized
            businesses
          </TextM>
        </Col>
      </Row>
    </Grid>
  );
};
