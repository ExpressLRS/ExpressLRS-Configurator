import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RadioIcon from '@mui/icons-material/SettingsInputAntenna';
import { FunctionComponent, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { LuaScript } from '../../gql/generated/types';

const styles: Record<string, SxProps<Theme>> = {
  paper: {
    maxWidth: 760,
  },
  title: {
    paddingTop: 3,
    paddingX: { xs: 3, sm: 4 },
    paddingRight: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  content: {
    paddingX: { xs: 3, sm: 4 },
    paddingBottom: 4,
  },
  options: {
    paddingTop: 2,
  },
  option: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 3,
  },
  recommendedOption: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 3,
    position: 'relative',
    overflow: 'visible',
    borderColor: 'primary.main',
    backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
  },
  optionHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 1,
  },
  // Sits on the top border so it takes no room from the card's content
  badge: {
    position: 'absolute',
    top: 0,
    left: 20,
    transform: 'translateY(-50%)',
  },
  optionBody: {
    flexGrow: 1,
    marginTop: 1.5,
    marginBottom: 3,
  },
  requirement: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.75,
    marginTop: 2,
  },
  hints: {
    display: 'flex',
    gap: 1,
    marginTop: 3,
    color: 'text.secondary',
  },
};

interface OptionProps {
  name: string;
  version?: string | null;
  features: string;
  requirement: ReactNode;
  recommended: boolean;
  action: ReactNode;
}

const Option: FunctionComponent<OptionProps> = ({
  name,
  version,
  features,
  requirement,
  recommended,
  action,
}) => {
  const { t } = useTranslation();
  return (
    <Card
      variant="outlined"
      sx={recommended ? styles.recommendedOption : styles.option}
    >
      {recommended && (
        <Chip
          sx={styles.badge}
          label={t('LuaDownloadDialog.Recommended')}
          color="primary"
          size="small"
        />
      )}
      <Box sx={styles.optionHeader}>
        <Typography variant="h6">{name}</Typography>
        {version && (
          <Typography variant="body2" color="text.secondary">
            {`v${version}`}
          </Typography>
        )}
      </Box>
      <Box sx={styles.optionBody}>
        <Typography variant="body2">{features}</Typography>
        {requirement}
      </Box>
      {action}
    </Card>
  );
};

interface LuaDownloadDialogProps {
  open: boolean;
  luaScript: Pick<
    LuaScript,
    'version' | 'fileLocation' | 'legacyFileLocation' | 'firmwareSupported'
  >;
  releasesUrl: string;
  onDownload: (url: string) => void;
  onClose: () => void;
}

const LuaDownloadDialog: FunctionComponent<LuaDownloadDialogProps> = ({
  open,
  luaScript,
  releasesUrl,
  onDownload,
  onClose,
}) => {
  const { t } = useTranslation();
  const { version, fileLocation, legacyFileLocation, firmwareSupported }
    = luaScript;

  const onLatestDownload = () => {
    if (fileLocation) {
      onDownload(fileLocation);
    } else {
      // The release lookup failed; let the browser show the release instead.
      window.open(releasesUrl);
      onClose();
    }
  };

  const requirement = (text: string, error = false) => (
    <Typography
      variant="body2"
      sx={styles.requirement}
      color={error ? 'error' : 'text.secondary'}
    >
      {error
        ? <ErrorOutlineIcon fontSize="small" />
        : <RadioIcon fontSize="small" />}
      {text}
    </Typography>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slotProps={{ paper: { sx: styles.paper } }}
      aria-labelledby="lua-download-dialog-title"
    >
      <DialogTitle id="lua-download-dialog-title" sx={styles.title}>
        {t('LuaDownloadDialog.Title')}
      </DialogTitle>
      <IconButton
        sx={styles.closeButton}
        aria-label={t('ConfiguratorView.Close')}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={styles.content}>
        <Stack
          sx={styles.options}
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
        >
          <Option
            name={t('LuaDownloadDialog.LatestName')}
            version={version}
            features={t('LuaDownloadDialog.LatestFeatures')}
            requirement={
              firmwareSupported
                ? requirement(t('LuaDownloadDialog.LatestRequirement'))
                : requirement(
                    t('LuaDownloadDialog.LatestUnsupportedFirmware'),
                    true,
                  )
            }
            recommended={firmwareSupported}
            action={(
              <Button
                variant="contained"
                fullWidth
                startIcon={<DownloadIcon />}
                disabled={!firmwareSupported}
                onClick={onLatestDownload}
              >
                {t('LuaDownloadDialog.Download')}
              </Button>
            )}
          />
          <Option
            name={t('LuaDownloadDialog.LegacyName')}
            features={t('LuaDownloadDialog.LegacyFeatures')}
            requirement={requirement(t('LuaDownloadDialog.LegacyRequirement'))}
            recommended={!firmwareSupported}
            action={(
              <Button
                variant={firmwareSupported ? 'outlined' : 'contained'}
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={() => onDownload(legacyFileLocation)}
              >
                {t('LuaDownloadDialog.Download')}
              </Button>
            )}
          />
        </Stack>
        <Box sx={styles.hints}>
          <InfoOutlinedIcon fontSize="small" />
          <Box>
            <Typography variant="body2">
              {t('LuaDownloadDialog.InstallHint')}
            </Typography>
            <Typography variant="body2">
              {t('LuaDownloadDialog.VersionHint')}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LuaDownloadDialog;
