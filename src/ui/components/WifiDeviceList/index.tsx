import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { FunctionComponent, useMemo } from 'react';
import { SxProps, Theme } from '@mui/system';
import { MulticastDnsInformation } from '../../gql/generated/types';
import { useTranslation } from 'react-i18next';

const styles: Record<string, SxProps<Theme>> = {
  root: {
    marginBottom: 2,
    '& a': {
      color: '#90caf9',
    },
  },
};

interface WifiDeviceSelectProps {
  wifiDevices: MulticastDnsInformation[];
  onChange: (dnsDevice: MulticastDnsInformation) => void;
}

const WifiDeviceSelect: FunctionComponent<WifiDeviceSelectProps> = (props) => {
  const { wifiDevices, onChange } = props;
  const { t } = useTranslation();

  const wifiDevicesSorted = useMemo(() => {
    return wifiDevices.sort((a, b) => {
      if (a.target === b.target) {
        return a.name > b.name ? 1 : -1;
      }
      return a.target > b.target ? 1 : -1;
    });
  }, [wifiDevices]);

  return (
    <Box sx={styles.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('WifiDeviceList.Name')}</TableCell>
            <TableCell>{t('WifiDeviceList.Target')}</TableCell>
            <TableCell>{t('WifiDeviceList.Version')}</TableCell>
            <TableCell>{t('WifiDeviceList.Type')}</TableCell>
            <TableCell>{t('WifiDeviceList.DNS')}</TableCell>
            <TableCell>{t('WifiDeviceList.IP')}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {wifiDevicesSorted.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                {row.deviceName ? row.deviceName : row.target}
              </TableCell>
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
                  {t('WifiDeviceList.Select')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default WifiDeviceSelect;
