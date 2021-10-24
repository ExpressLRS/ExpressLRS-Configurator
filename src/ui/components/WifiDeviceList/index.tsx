import {
  Button,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, { FunctionComponent, useMemo } from 'react';
import { MulticastDnsInformation } from '../../gql/generated/types';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
    '& a': {
      color: '#90caf9',
    },
  },
}));

interface WifiDeviceSelectProps {
  wifiDevices: MulticastDnsInformation[];
  onChange: (dnsDevice: MulticastDnsInformation) => void;
}

const WifiDeviceSelect: FunctionComponent<WifiDeviceSelectProps> = (props) => {
  const { wifiDevices, onChange } = props;
  const styles = useStyles();

  const wifiDevicesSorted = useMemo(() => {
    return wifiDevices.sort((a, b) => {
      if (a.target === b.target) {
        return a.name > b.name ? 1 : -1;
      }
      return a.target > b.target ? 1 : -1;
    });
  }, [wifiDevices]);

  return (
    <div className={styles.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Target</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>DNS</TableCell>
            <TableCell>IP</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {wifiDevicesSorted.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.target}</TableCell>
              <TableCell>{row.version}</TableCell>
              <TableCell>{row.type?.toUpperCase()}</TableCell>
              <TableCell>
                <a target="_blank" href={`http://${row.dns}`} rel="noreferrer">
                  {row.dns}
                </a>
              </TableCell>
              <TableCell>
                <a target="_blank" href={`http://${row.ip}`} rel="noreferrer">
                  {row.ip}
                </a>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    onChange(row);
                  }}
                >
                  Select
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WifiDeviceSelect;
