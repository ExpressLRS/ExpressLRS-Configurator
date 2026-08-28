import { FunctionComponent } from 'react';
import {
  Alert,
  Checkbox,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import Omnibox, { Option } from '../Omnibox';
import {
  ReceiverCapabilities,
  ReceiverConfigurationInput,
} from '../../gql/generated/types';

const styles: Record<string, SxProps<Theme>> = {
  icon: {
    minWidth: 40,
  },
  notice: {
    width: '100%',
  },
  complimentaryItem: {
    marginY: 1,
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
};

export type ReceiverOptionsFormData = ReceiverConfigurationInput;

/** model match is off when the id is out of range, which is what 255 means */
const MODEL_MATCH_OFF = 255;

/**
 * The receiver follows the power of the transmitter. Mirrors PWR_MATCH_TX of
 * the firmware and POWER_MATCH_TX in the api ReceiverConfiguration service.
 */
const POWER_MATCH_TX = 8;

/** eSerialProtocol value for MAVLink, the only protocol using the system ids */
const PROTOCOL_MAVLINK = 7;

/** channel index of AUX2, the first channel team race can be put on */
const AUX2 = 5;

/** AUX7, the channel a receiver ships with for team race */
const TEAMRACE_CHANNEL_DEFAULT = 10;

/** team race is off in this position, which is what a receiver ships with */
const TEAMRACE_DISABLED = 0;

interface ReceiverOptionsFormProps {
  data: ReceiverOptionsFormData;
  capabilities: ReceiverCapabilities | null;
  onChange: (data: ReceiverOptionsFormData) => void;
}

const ReceiverOptionsForm: FunctionComponent<ReceiverOptionsFormProps> = ({
  data,
  capabilities,
  onChange,
}) => {
  const { t } = useTranslation();

  const numbered = (
    labels: string[],
    offset = 0,
  ): Option[] => labels.map((label, index) => ({
    label,
    value: String(index + offset),
  }));

  // the values are the ones the firmware stores, see common.h of ExpressLRS
  const serialProtocols = numbered([
    'CRSF',
    t('ReceiverOptionsForm.InvertedCRSF'),
    'SBUS',
    t('ReceiverOptionsForm.InvertedSBUS'),
    'SUMD',
    'DJI RS Pro',
    t('ReceiverOptionsForm.HoTTTelemetry'),
    'MAVLink',
    'MSP DisplayPort',
    'GPS',
  ]);

  const serial1Protocols = numbered([
    t('ReceiverOptionsForm.Off'),
    'CRSF',
    t('ReceiverOptionsForm.InvertedCRSF'),
    'SBUS',
    t('ReceiverOptionsForm.InvertedSBUS'),
    'SUMD',
    'DJI RS Pro',
    t('ReceiverOptionsForm.HoTTTelemetry'),
    'Tramp',
    'SmartAudio',
    'MSP DisplayPort',
    'GPS',
  ]);

  // the receiver's own menu offers exactly these two, the third enum value is
  // not implemented for the serial outputs
  const failsafeModes = numbered([
    t('ReceiverOptionsForm.FailsafeNoPulses'),
    t('ReceiverOptionsForm.FailsafeLastPosition'),
  ]);

  const antennaModes = numbered([
    t('ReceiverOptionsForm.AntennaOne'),
    t('ReceiverOptionsForm.AntennaTwo'),
    t('ReceiverOptionsForm.AntennaDiversity'),
  ]);

  const bindStorageModes = numbered([
    t('ReceiverOptionsForm.BindStoragePersistent'),
    t('ReceiverOptionsForm.BindStorageVolatile'),
    t('ReceiverOptionsForm.BindStorageReturnable'),
  ]);

  // the receiver only offers the levels its amplifier supports, followed by
  // the option to follow the transmitter, exactly like its own Lua screen
  const allPowerLevels = ['10 mW', '25 mW', '50 mW', '100 mW', '250 mW', '500 mW', '1 W', '2 W'];
  const powerMin = capabilities?.powerMin ?? 0;
  const powerMax = Math.min(
    capabilities?.powerMax ?? allPowerLevels.length - 1,
    allPowerLevels.length - 1,
  );
  const powerLevels: Option[] = [
    ...allPowerLevels
      .slice(powerMin, powerMax + 1)
      .map((label, index) => ({ label, value: String(index + powerMin) })),
    { label: t('ReceiverOptionsForm.PowerMatchTx'), value: String(POWER_MATCH_TX) },
  ];

  const modelMatchOptions: Option[] = [
    { label: t('ReceiverOptionsForm.Off'), value: String(MODEL_MATCH_OFF) },
    ...Array.from({ length: 64 }, (_, id) => ({
      label: t('ReceiverOptionsForm.ModelId', { id }),
      value: String(id),
    })),
  ];

  // the receiver offers AUX2 upwards for this, the value stored is the channel
  // index, where AUX2 is channel 5
  const teamraceChannels = numbered(
    Array.from({ length: 11 }, (_, index) => `AUX${index + 2}`),
    AUX2,
  );

  // the labels the receiver itself uses for the switch positions
  const teamracePositions = numbered([
    t('ReceiverOptionsForm.TeamraceDisabled'),
    t('ReceiverOptionsForm.TeamracePositionLow'),
    '2',
    '3',
    t('ReceiverOptionsForm.TeamracePositionMid'),
    '4',
    '5',
    t('ReceiverOptionsForm.TeamracePositionHigh'),
  ]);

  const update = (change: Partial<ReceiverOptionsFormData>) => {
    onChange({ ...data, ...change });
  };

  const selection = (
    value: number | null | undefined,
    options: Option[],
    fallback: number,
  ): Option => {
    const current = String(value ?? fallback);
    return options.find((option) => option.value === current) ?? options[0];
  };

  const numericChange = (
    field: keyof ReceiverOptionsFormData,
  ) => (value: string | null) => {
    update({ [field]: value === null ? null : Number.parseInt(value, 10) });
  };

  const select = (
    field: keyof ReceiverOptionsFormData,
    title: string,
    options: Option[],
    fallback: number,
  ) => (
    <ListItem sx={styles.complimentaryItem}>
      <Omnibox
        title={title}
        currentValue={selection(data[field] as number | null, options, fallback)}
        options={options}
        onChange={numericChange(field)}
      />
    </ListItem>
  );

  const sysId = (
    field: 'targetSysId' | 'sourceSysId',
    title: string,
    fallback: number,
  ) => (
    <ListItem sx={styles.complimentaryItem}>
      <TextField
        size="small"
        fullWidth
        type="number"
        label={title}
        value={data[field] ?? ''}
        placeholder={String(fallback)}
        onChange={(event) => {
          const value = event.target.value;
          update({
            [field]: value === '' ? null : Number.parseInt(value, 10) & 0xff,
          });
        }}
      />
    </ListItem>
  );

  const toggle = (
    field: 'enabled' | 'forceTlmOff',
    label: string,
  ) => (
    <ListItemButton
      dense
      selected={Boolean(data[field])}
      onClick={() => update({ [field]: !data[field] })}
    >
      <ListItemIcon sx={styles.icon}>
        <Checkbox
          edge="start"
          checked={Boolean(data[field])}
          tabIndex={-1}
          disableRipple
        />
      </ListItemIcon>
      <ListItemText>{label}</ListItemText>
    </ListItemButton>
  );

  return (
    <List>
      {toggle('enabled', t('ReceiverOptionsForm.Enable'))}
      {data.enabled && (
        <>
          <ListItem sx={styles.complimentaryItem}>
            <Alert severity="info" sx={styles.notice}>
              {(capabilities?.pwmChannelCount ?? 0) > 0
                ? t('ReceiverOptionsForm.ReplacesStoredSettingsWithOutputs', {
                    count: capabilities?.pwmChannelCount ?? 0,
                  })
                : t('ReceiverOptionsForm.ReplacesStoredSettings')}
            </Alert>
          </ListItem>
          {select('serialProtocol', t('ReceiverOptionsForm.SerialProtocol'), serialProtocols, 0)}
          {capabilities?.hasSerial1
            && select(
              'serial1Protocol',
              t('ReceiverOptionsForm.Serial1Protocol'),
              serial1Protocols,
              0,
            )}
          {select('failsafeMode', t('ReceiverOptionsForm.FailsafeMode'), failsafeModes, 0)}
          {/* only a receiver with an antenna switch can be pointed at one,
              which is the condition the firmware puts on its own menu */}
          {capabilities?.dualRadio && (
            <ListItem sx={styles.complimentaryItem}>
              <Alert severity="info" sx={styles.notice}>
                {t('ReceiverOptionsForm.AntennaSetByTransmitter')}
              </Alert>
            </ListItem>
          )}
          {capabilities?.hasAntennaSwitch
            && !capabilities?.dualRadio
            && select(
              'antennaMode',
              t('ReceiverOptionsForm.AntennaMode'),
              antennaModes,
              2, // a target with an antenna switch defaults to diversity
            )}
          {select('modelId', t('ReceiverOptionsForm.ModelMatch'), modelMatchOptions, MODEL_MATCH_OFF)}
          {select('bindStorage', t('ReceiverOptionsForm.BindStorage'), bindStorageModes, 0)}
          {/* the receiver's own menu hides the power selection when the
              amplifier only has a single level */}
          {powerMin !== powerMax
            && select(
              'power',
              t('ReceiverOptionsForm.Power'),
              powerLevels,
              capabilities?.powerDefault ?? POWER_MATCH_TX,
            )}
          {select(
            'teamracePosition',
            t('ReceiverOptionsForm.TeamracePosition'),
            teamracePositions,
            TEAMRACE_DISABLED,
          )}
          {(data.teamracePosition ?? TEAMRACE_DISABLED) !== TEAMRACE_DISABLED
            && select(
              'teamraceChannel',
              t('ReceiverOptionsForm.TeamraceChannel'),
              teamraceChannels,
              TEAMRACE_CHANNEL_DEFAULT,
            )}
          {/* the receiver only uses these when it speaks MAVLink */}
          {data.serialProtocol === PROTOCOL_MAVLINK && (
            <>
              {sysId('targetSysId', t('ReceiverOptionsForm.TargetSysId'), 1)}
              {sysId('sourceSysId', t('ReceiverOptionsForm.SourceSysId'), 255)}
            </>
          )}
          {toggle('forceTlmOff', t('ReceiverOptionsForm.ForceTelemetryOff'))}
        </>
      )}
    </List>
  );
};

export default ReceiverOptionsForm;
