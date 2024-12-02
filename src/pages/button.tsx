import { Badge, Button, Checkbox, Col, Grid, IconButton, Link, Radiobox, Row, Switch } from '@salutejs/sdds-serv';
import { Close24 } from '@/shared/ui/Icon/icons/24/close';
import { GetServerSideProps } from 'next';
import { gssp } from '@/entities/home/gssp';
import { Layout } from '@/widgets/Layout';
import { Indent } from '@/shared/ui/Indent';

export default function Page() {
  return (
    <Layout>
      <Indent $s={32} $m={36} $l={60} />
      <Grid view="default">
        <Row>
          <Col>
            <Button view="default" value={'value'} pin={'circle-circle'}>
              default
            </Button>
            <Button view="default" value={'value'} isLoading pin="circle-circle">
              default
            </Button>
            <Button view="default" value={'value'} disabled pin="circle-circle">
              default
            </Button>
            <Button view="default" value={'value'} contentLeft={<Close24 />} pin="circle-circle">
              default
            </Button>
            <Button view="default" square contentLeft={<Close24 />} pin="circle-circle" />
            <Indent $s={32} $m={36} $l={60} />
            <Button view="accent" value={'value'} pin="circle-circle">
              accent
            </Button>
            <IconButton view="accent">
              <Close24 />
            </IconButton>
            <Indent $s={32} $m={36} $l={60} />
            <Checkbox label="label" description="description" />
            <Indent $s={32} $m={36} $l={60} />
            <Switch />
            <Indent $s={32} $m={36} $l={60} />
            <Radiobox label="label" description="description" />
            <Indent $s={32} $m={36} $l={60} />
            <Link view="accent">Link</Link>
            <Indent $s={32} $m={36} $l={60} />
            <Badge view="accent">123</Badge>
            <Indent $s={32} $m={36} $l={60} />
            <Button view="secondary" value={'value'}>
              secondary
            </Button>
            <Indent $s={32} $m={36} $l={60} />
            <Button view="clear" value={'value'}>
              clear
            </Button>
            <Indent $s={32} $m={36} $l={60} />
            <Button view="success" value={'value'}>
              success
            </Button>
            <Indent $s={32} $m={36} $l={60} />
            <Button view="warning" value={'value'}>
              warning
            </Button>
            <Indent $s={32} $m={36} $l={60} />
            <Button view="critical" value={'value'}>
              critical
            </Button>
            <Indent $s={32} $m={36} $l={60} />
            <Button view="dark" value={'value'}>
              dark
            </Button>
            <Indent $s={32} $m={36} $l={60} />
            <Button view="black" value={'value'}>
              black
            </Button>
            <Indent $s={32} $m={36} $l={60} />
            <Button view="white" value={'value'}>
              white
            </Button>
            <Indent $s={32} $m={36} $l={60} />
          </Col>
        </Row>
      </Grid>
      <Indent $s={32} $m={36} $l={60} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = gssp;
