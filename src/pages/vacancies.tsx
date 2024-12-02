import { Col, Grid, H2, Row, TabItem, Tabs } from '@salutejs/sdds-serv';
import { GetServerSideProps } from 'next';
import { gssp } from '@/entities/home/gssp';
import { Layout } from '@/widgets/Layout';
import { Indent } from '@/shared/ui/Indent';
import { Title } from '@/shared/ui/Title';
import { useState } from 'react';

const TAB_ITEMS = [
  {
    name: 'All'
  },
  {
    name: 'Bangalore'
  },
  {
    name: 'Mumbai'
  },
  {
    name: 'New Delhi'
  }
];

export default function Page() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <Layout>
      <Indent $s={32} $m={36} $l={60} />
      <Grid>
        <Row>
          <Col>
            <Title>Our vacancies</Title>
          </Col>
        </Row>
      </Grid>
      <Indent $s={32} $m={36} $l={60} />
      <Grid view="default">
        <Row>
          <Col>
            <Tabs view="divider" size="h4">
              {TAB_ITEMS.map((item, i) => (
                <TabItem
                  view="clear"
                  key={`item:${item.name}`}
                  size="h4"
                  selected={i === selectedTabIndex}
                  tabIndex={0}
                  onClick={() => setSelectedTabIndex(i)}
                >
                  {item.name}
                </TabItem>
              ))}
            </Tabs>
          </Col>
        </Row>
      </Grid>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = gssp;
