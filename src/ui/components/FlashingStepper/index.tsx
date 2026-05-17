import { FunctionComponent, memo, ReactElement, useMemo } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  LinearProgress,
  Step,
  StepContent,
  StepIconProps,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { SxProps, Theme } from '@mui/system';
import { Trans, useTranslation } from 'react-i18next';
import {
  BuildFirmwareErrorType,
  BuildFirmwareStep,
  BuildFirmwareSubstep,
  BuildFlashFirmwareResult,
  BuildJobType,
  BuildProgressNotification,
  BuildProgressNotificationType,
  FlashingMethod,
} from '../../gql/generated/types';
import DocumentationLink from '../DocumentationLink';

type StepStatus = 'pending' | 'active' | 'completed' | 'error';

interface ReducedStep {
  step: BuildFirmwareStep;
  status: StepStatus;
  currentSubstep?: BuildFirmwareSubstep;
  progress?: number;
}

interface ReducedState {
  steps: ReducedStep[];
  activeIdx: number;
}

const PROGRESSIVE_MESSAGES = new Set<BuildFirmwareSubstep>([
  BuildFirmwareSubstep.WritingFirmware,
  BuildFirmwareSubstep.UploadingFirmware,
]);

const KNOWN_SUBSTEPS = new Set<string>(Object.values(BuildFirmwareSubstep));

function parseSubstep(
  value: string | null | undefined,
): BuildFirmwareSubstep | undefined {
  return value != null && KNOWN_SUBSTEPS.has(value)
    ? (value as BuildFirmwareSubstep)
    : undefined;
}

function highLevelStepsFor(
  jobType: BuildJobType,
  flashingMethod?: FlashingMethod,
): BuildFirmwareStep[] {
  const isBuildOnly
    = jobType === BuildJobType.Build
      || flashingMethod === FlashingMethod.Stock_BL
      || flashingMethod === FlashingMethod.Zip;
  if (isBuildOnly) {
    return [
      BuildFirmwareStep.VERIFYING_BUILD_SYSTEM,
      BuildFirmwareStep.DOWNLOADING_FIRMWARE,
      BuildFirmwareStep.BUILDING_FIRMWARE,
    ];
  }
  return [
    BuildFirmwareStep.VERIFYING_BUILD_SYSTEM,
    BuildFirmwareStep.DOWNLOADING_FIRMWARE,
    BuildFirmwareStep.BUILDING_FIRMWARE,
    BuildFirmwareStep.FLASHING_FIRMWARE,
  ];
}

function reduceNotifications(
  notifications: BuildProgressNotification[],
  jobType: BuildJobType,
  flashingMethod: FlashingMethod | undefined,
): ReducedState {
  const stepOrder = highLevelStepsFor(jobType, flashingMethod);
  const byStep = new Map<BuildFirmwareStep, ReducedStep>();
  for (const step of stepOrder) {
    byStep.set(step, { step, status: 'pending' });
  }

  // Track which steps have received any notification (in order of first arrival).
  const seen: BuildFirmwareStep[] = [];
  for (const n of notifications) {
    if (!n.step) continue;
    const target = byStep.get(n.step);
    if (!target) continue;
    if (!seen.includes(n.step)) {
      seen.push(n.step);
    }
    const substep = parseSubstep(n.substep);
    if (n.type === BuildProgressNotificationType.Error) {
      target.status = 'error';
      if (substep != null) target.currentSubstep = substep;
      if (n.progress != null) target.progress = n.progress;
      continue;
    }
    if (n.type === BuildProgressNotificationType.Success) {
      // Success only overrides if step hasn't already errored.
      if (target.status !== 'error') {
        target.status = 'completed';
      }
      if (substep != null) target.currentSubstep = substep;
      if (n.progress != null) target.progress = n.progress;
      continue;
    }
    // Info: mark this step active (preserve error if already set).
    if (target.status !== 'error' && target.status !== 'completed') {
      target.status = 'active';
    }
    if (substep != null) target.currentSubstep = substep;
    if (n.progress != null) target.progress = n.progress;
  }

  // Any step before the latest-seen that's still 'active' is implicitly complete
  // (we've moved past it). Errors remain errors.
  const lastSeen = seen[seen.length - 1];
  if (lastSeen) {
    const lastIdx = stepOrder.indexOf(lastSeen);
    for (let i = 0; i < lastIdx; i += 1) {
      const step = byStep.get(stepOrder[i])!;
      if (step.status === 'active') step.status = 'completed';
    }
  }

  const reducedSteps = stepOrder.map((s) => byStep.get(s)!);
  let activeIdx = reducedSteps.findIndex(
    (s) => s.status === 'active' || s.status === 'error',
  );
  if (activeIdx === -1) {
    const firstPending = reducedSteps.findIndex((s) => s.status === 'pending');
    activeIdx = firstPending === -1 ? reducedSteps.length : firstPending;
  }
  return { steps: reducedSteps, activeIdx };
}

const StepIcon = ({
  status,
}: {
  status: StepStatus;
}): ReactElement => {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon color="success" fontSize="medium" />;
    case 'error':
      return <ErrorIcon color="error" fontSize="medium" />;
    case 'active':
      return <CircularProgress size={20} />;
    case 'pending':
    default:
      return <RadioButtonUncheckedIcon color="disabled" fontSize="medium" />;
  }
};

const CustomStepIcon = (props: StepIconProps & { status: StepStatus }) => {
  return <StepIcon status={props.status} />;
};

const styles: Record<string, SxProps<Theme>> = {
  stepper: {
    marginTop: 1,
    marginBottom: 2,
  },
  subline: {
    marginTop: 0.5,
    marginBottom: 0.5,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginTop: 0.5,
  },
  doneHint: {
    marginTop: 1,
    fontStyle: 'italic',
  },
  resultBlock: {
    marginTop: 1,
  },
  resultAlert: {
    marginTop: 1,
    marginBottom: 1,
  },
  errorMessage: {
    marginTop: 1,
    marginBottom: 1,
    a: {
      color: (theme: Theme) => theme.palette.custom.alertError.text,
    },
  },
};

type ErrorTitleKey =
  | 'BuildResponse.Error'
  | 'BuildResponse.GitDependencyError'
  | 'BuildResponse.PythonDependencyError'
  | 'BuildResponse.PlatformioDependencyError'
  | 'BuildResponse.BuildError'
  | 'BuildResponse.FlashError'
  | 'BuildResponse.TargetMismatch';

function errorTypeTitleKey(
  errorType: BuildFirmwareErrorType | null | undefined,
): ErrorTitleKey {
  switch (errorType) {
    case BuildFirmwareErrorType.GitDependencyError:
      return 'BuildResponse.GitDependencyError';
    case BuildFirmwareErrorType.PythonDependencyError:
      return 'BuildResponse.PythonDependencyError';
    case BuildFirmwareErrorType.PlatformioDependencyError:
      return 'BuildResponse.PlatformioDependencyError';
    case BuildFirmwareErrorType.BuildError:
      return 'BuildResponse.BuildError';
    case BuildFirmwareErrorType.FlashError:
      return 'BuildResponse.FlashError';
    case BuildFirmwareErrorType.TargetMismatch:
      return 'BuildResponse.TargetMismatch';
    case BuildFirmwareErrorType.GenericError:
    default:
      return 'BuildResponse.Error';
  }
}

interface FlashingStepperProps {
  notifications: BuildProgressNotification[];
  jobType: BuildJobType;
  flashingMethod?: FlashingMethod;
  hasLuaScript?: boolean;
  response?: BuildFlashFirmwareResult;
}

const FlashingStepper: FunctionComponent<FlashingStepperProps> = memo(
  ({ notifications, jobType, flashingMethod, hasLuaScript, response }) => {
    const { t } = useTranslation();

    const { steps, activeIdx } = useMemo(
      () => reduceNotifications(notifications, jobType, flashingMethod),
      [notifications, jobType, flashingMethod],
    );

    const isBuildOnly
      = jobType === BuildJobType.Build
        || flashingMethod === FlashingMethod.Stock_BL
        || flashingMethod === FlashingMethod.Zip;

    const sublineFor = (s: ReducedStep): ReactElement | null => {
      if (s.status !== 'active' && s.status !== 'error') return null;
      const isError = s.status === 'error';
      let text: string | null = null;
      if (isError) {
        text = s.currentSubstep
          ? t(`FlashingStepper.Failed.${s.currentSubstep}`, {
              defaultValue: t('FlashingStepper.Failed.Generic'),
            })
          : t('FlashingStepper.Failed.Generic');
      } else if (s.currentSubstep) {
        text = t(`FlashingStepper.Status.${s.currentSubstep}`);
      }
      const showProgress
        = !isError
          && s.progress != null
          && s.currentSubstep != null
          && PROGRESSIVE_MESSAGES.has(s.currentSubstep);
      let suffix = '';
      if (showProgress) {
        suffix = ` ${Math.round(s.progress!)}%`;
      } else if (!isError) {
        suffix = ' …';
      }

      return (
        <Box>
          {text && (
            <Typography
              variant="body2"
              color={isError ? 'error' : 'text.secondary'}
              sx={styles.subline}
            >
              {text}
              {suffix}
            </Typography>
          )}
          {showProgress && (
            <LinearProgress
              variant="determinate"
              value={Math.max(0, Math.min(100, s.progress!))}
              sx={styles.progressBar}
            />
          )}
        </Box>
      );
    };

    const renderResultBlock = (): ReactElement | null => {
      if (!response) return null;
      if (response.success) {
        return (
          <Box sx={styles.resultBlock}>
            {jobType === BuildJobType.Flash
              && flashingMethod === FlashingMethod.WIFI && (
              <Alert severity="warning" sx={styles.resultAlert}>
                <AlertTitle>{t('ConfiguratorView.Warning')}</AlertTitle>
                {t('ConfiguratorView.WaitForLEDBeforeDisconnectingPower')}
              </Alert>
            )}
            {hasLuaScript && (
              <Alert severity="info" sx={styles.resultAlert}>
                <AlertTitle>{t('ConfiguratorView.UpdateLuaScript')}</AlertTitle>
                {t('ConfiguratorView.UpdateLuaScriptOnRadio')}
              </Alert>
            )}
            {jobType === BuildJobType.Build && (
              <Alert severity="info" sx={styles.resultAlert}>
                <AlertTitle>{t('ConfiguratorView.BuildNotice')}</AlertTitle>
                {t('ConfiguratorView.FirmwareOpenedInFileExplorer')}
              </Alert>
            )}
            {isBuildOnly && (
              <Typography
                variant="body2"
                color="success.main"
                sx={styles.doneHint}
              >
                {flashingMethod === FlashingMethod.Stock_BL
                  ? t('FlashingStepper.StockBlDoneHint')
                  : t('FlashingStepper.BuildOnlyDoneHint')}
              </Typography>
            )}
          </Box>
        );
      }
      const errorType = response.errorType ?? BuildFirmwareErrorType.GenericError;
      return (
        <Box sx={styles.resultBlock}>
          <Alert severity="error" sx={styles.errorMessage}>
            <AlertTitle>{t(errorTypeTitleKey(errorType))}</AlertTitle>
            <p>
              <Trans
                i18nKey="BuildResponse.ErrorDetails"
                components={{
                  ExpresslrsLink: (
                    <DocumentationLink url="https://www.expresslrs.org/" />
                  ),
                  FlashingGuideLink: (
                    <DocumentationLink url="https://www.expresslrs.org/quick-start/getting-started/" />
                  ),
                  TroubleshootingGuideLink: (
                    <DocumentationLink url="https://www.expresslrs.org/quick-start/troubleshooting/#flashingupdating" />
                  ),
                  ExpressLRSDiscordLink: (
                    <DocumentationLink url="https://discord.gg/dS6ReFY" />
                  ),
                }}
              />
            </p>
          </Alert>
        </Box>
      );
    };

    return (
      <Box>
        <Stepper
          orientation="vertical"
          activeStep={Math.min(activeIdx, steps.length)}
          sx={styles.stepper}
        >
          {steps.map((s) => (
            <Step
              key={s.step}
              completed={s.status === 'completed'}
              active={s.status === 'active' || s.status === 'error'}
            >
              <StepLabel
                StepIconComponent={(p) => (
                  <CustomStepIcon {...p} status={s.status} />
                )}
                error={s.status === 'error'}
              >
                {t(`FlashingStepper.Step.${s.step}_${s.status}`, {
                  defaultValue: t(`FlashingStepper.Step.${s.step}`),
                })}
              </StepLabel>
              <StepContent>{sublineFor(s)}</StepContent>
            </Step>
          ))}
        </Stepper>
        {renderResultBlock()}
      </Box>
    );
  },
);

export default FlashingStepper;
