import { Col, Grid, Row, TabItem, Tabs } from '@salutejs/sdds-serv';
import { GetServerSideProps } from 'next';
import { gssp } from '@/entities/home/gssp';
import { Layout } from '@/widgets/Layout';
import { Indent } from '@/shared/ui/Indent';
import { Title } from '@/shared/ui/Title';

export default function Page() {
  return (
    <Layout>
      <Indent $s={32} $m={36} $l={60} />
      <Grid>
        <Row>
          <Col>
            <Title>Main Page</Title>
          </Col>
        </Row>
      </Grid>
      <Indent $s={32} $m={36} $l={60} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = gssp;
