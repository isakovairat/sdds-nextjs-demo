import {Button, Col, Grid, H2, Row, TabItem, Tabs,} from "@salutejs/sdds-serv";
import {textAccent} from "@salutejs/sdds-serv/tokens";
import {GetServerSideProps} from "next";
import {gssp} from "@/entities/home/gssp";

export default function Page() {
  return (
    <>
      <header>
        <Grid>
          <Row>
            <Col>
              <Tabs size="m" view="clear">
                <TabItem>
                    About Sber
                </TabItem>
                <TabItem>
                    Exchange rates
                </TabItem>
                <TabItem>
                    Contact us
                </TabItem>
              </Tabs>
            </Col>
          </Row>
        </Grid>
      </header>
      <main>
        <Grid>
          <Row>
            <Col>
              <H2>Our vacancies</H2>
            </Col>
          </Row>
          <Row>
            <Col>
              <Tabs size="l" view="clear">
                <TabItem>All</TabItem>
                <TabItem>Bangalore</TabItem>
                <TabItem>Mumbai</TabItem>
                <TabItem>New Delhi</TabItem>
              </Tabs>
            </Col>
          </Row>
          <Button view="accent">Hello, SDDS!</Button>
          <p style={{ color: textAccent }}>Token usage example</p>
        </Grid>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = gssp;


