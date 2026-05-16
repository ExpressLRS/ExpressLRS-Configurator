import { FunctionComponent, memo, ReactElement, useMemo } from 'react';
import {
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
import { useTranslation } from 'react-i18next';
import {
  BuildFirmwareStep,
  BuildFirmwareSubstep,
  BuildJobType,
  BuildProgressNotification,
  BuildProgressNotificationType,
  FlashingMethod,
} from '../../gql/generated/types';

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
    const allCompleted = reducedSteps.every((s) => s.status === 'completed');
    activeIdx = allCompleted ? reducedSteps.length : 0;
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
};

interface FlashingStepperProps {
  notifications: BuildProgressNotification[];
  jobType: BuildJobType;
  flashingMethod?: FlashingMethod;
}

const FlashingStepper: FunctionComponent<FlashingStepperProps> = memo(
  ({ notifications, jobType, flashingMethod }) => {
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

    const lastStepIdx = steps.length - 1;
    const lastStepIsCompleted = steps[lastStepIdx]?.status === 'completed';

    return (
      <Stepper
        orientation="vertical"
        activeStep={Math.min(activeIdx, steps.length)}
        sx={styles.stepper}
      >
        {steps.map((s, idx) => (
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
              {t(`FlashingStepper.Step.${s.step}`)}
            </StepLabel>
            <StepContent>
              {sublineFor(s)}
              {idx === lastStepIdx && isBuildOnly && lastStepIsCompleted && (
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
            </StepContent>
          </Step>
        ))}
      </Stepper>
    );
  },
);

export default FlashingStepper;
