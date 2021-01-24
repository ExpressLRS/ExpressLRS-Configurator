import {Card, CardContent, Container, Divider, makeStyles, Typography} from '@material-ui/core';
import React, {FunctionComponent} from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import ListIcon from '@material-ui/icons/List';
import CardTitle from '../../components/CardTitle';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  main: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
  },
}));

export const LogsView: FunctionComponent = () => {
  const styles = useStyles();

  return (
    <main className={styles.root}>
      <Sidebar/>
      <div className={styles.content}>
        <Header/>
        <Container className={styles.main}>
          <Card>
            <CardTitle icon={<ListIcon/>} title="Logs"/>
            <Divider/>
            <CardContent>
              <Typography variant="h6">Todo:</Typography>
              <ul>
                <li>Debugging information</li>
                <li>Logs display</li>
              </ul>
            </CardContent>
          </Card>
        </Container>
      </div>
    </main>
  );
};

export default LogsView;
