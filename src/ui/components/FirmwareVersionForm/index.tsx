import {
  Alert,
  AlertTitle,
  makeStyles,
  Tab,
  Tabs,
  TextField,
} from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import Loader from '../Loader';
import ShowAlerts from '../ShowAlerts';
import OctopusGitHubClient from '../../library/GitHubClient';
import Omnibox from '../Omnibox';
import {
  FirmwareSource,
  FirmwareVersionData,
} from '../../../main/handlers/BuildFirmwareHandler';

const useStyles = makeStyles((theme) => ({
  tabs: {
    marginBottom: theme.spacing(2),
  },
  dangerZone: {
    marginBottom: theme.spacing(2),
  },
  tabContents: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  loader: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
}));

interface FirmwareVersionCardProps {
  repositoryOwner: string;
  repositoryName: string;
  data: FirmwareVersionData | null;
  onChange: (data: FirmwareVersionData) => void;
}

const FirmwareVersionForm: FunctionComponent<FirmwareVersionCardProps> = (
  props
) => {
  const { onChange, repositoryOwner, repositoryName, data } = props;
  const styles = useStyles();

  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<string>('');

  const [firmwareSource, setFirmwareSource] = useState<FirmwareSource>(
    data?.source || FirmwareSource.GitTag
  );
  const handleFirmwareSourceChange = (
    _event: React.SyntheticEvent,
    value: FirmwareSource
  ) => {
    setFirmwareSource(value);
  };

  const [gitTags, setGitTags] = useState<string[]>([]);
  const [currentGitTag, setCurrentGitTag] = useState<string>(
    data?.gitTag || ''
  );
  const onGitTag = (name: string | null) => {
    if (name === null) {
      setCurrentGitTag('');
      return;
    }
    setCurrentGitTag(name);
  };

  const [gitBranches, setGitBranches] = useState<string[]>([]);
  const [currentGitBranch, setCurrentGitBranch] = useState<string>(
    data?.gitBranch || ''
  );
  const onGitBranch = (name: string | null) => {
    if (name === null) {
      setCurrentGitBranch('');
      return;
    }
    setCurrentGitBranch(name);
  };

  const [gitCommit, setGitCommit] = useState<string>(data?.gitCommit || '');
  const onGitCommit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGitCommit(event.target.value);
  };
  const [localPath, setLocalPath] = useState<string>(data?.localPath || '');
  const onLocalPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalPath(event.target.value);
  };

  useEffect(() => {
    setGitTags([]);
    setGitBranches([]);
    setGitCommit('');
    setLocalPath('');

    switch (firmwareSource) {
      case FirmwareSource.GitTag:
        setLoading(true);
        new OctopusGitHubClient()
          .loadTags(repositoryOwner, repositoryName)
          .then((tags) => {
            setLoading(false);
            if (tags.length === 0) {
              setErrors('No releases found');
            } else {
              setGitTags(tags);
            }
          })
          .catch((errs) => {
            setLoading(false);
            setErrors(errs);
          });
        break;
      case FirmwareSource.GitBranch:
        setLoading(true);
        new OctopusGitHubClient()
          .loadBranches(repositoryOwner, repositoryName)
          .then((branches) => {
            setLoading(false);
            if (branches.length === 0) {
              setErrors('No releases found');
              return;
            }
            setGitBranches(branches);
          })
          .catch((errs) => {
            setLoading(false);
            setErrors(errs);
          });
        break;
      case FirmwareSource.GitCommit:
        setLoading(false);
        break;
      case FirmwareSource.Local:
        setLoading(false);
        break;
      default:
        throw new Error(`unknown firmware source: ${firmwareSource}`);
    }
  }, [firmwareSource, repositoryName, repositoryOwner]);

  useEffect(() => {
    onChange({
      source: firmwareSource,
      gitBranch: currentGitBranch,
      gitTag: currentGitTag,
      gitCommit,
      localPath,
    });
  }, [firmwareSource, currentGitBranch, currentGitTag, gitCommit, localPath]);

  return (
    <>
      <Tabs
        className={styles.tabs}
        defaultValue={FirmwareSource.GitTag}
        value={firmwareSource}
        onChange={handleFirmwareSourceChange}
      >
        <Tab label="Official releases" value={FirmwareSource.GitTag} />
        <Tab label="Git branch" value={FirmwareSource.GitBranch} />
        <Tab label="Git commit" value={FirmwareSource.GitCommit} />
        <Tab label="Local" value={FirmwareSource.Local} />
      </Tabs>

      {firmwareSource === FirmwareSource.GitTag && (
        <>
          <div className={styles.tabContents}>
            {!loading && (
              <Omnibox
                title="Releases"
                options={gitTags.map((tag) => ({ label: tag, value: tag }))}
                currentValue={
                  currentGitTag === ''
                    ? null
                    : { label: currentGitTag, value: currentGitTag }
                }
                onChange={onGitTag}
              />
            )}
          </div>
        </>
      )}

      {firmwareSource === FirmwareSource.GitBranch && (
        <>
          <Alert severity="warning" className={styles.dangerZone}>
            <AlertTitle>DANGER ZONE</AlertTitle>
            Use these sources only if you know what you are doing or was
            instructed by project developers
          </Alert>
          <div className={styles.tabContents}>
            {!loading && (
              <Omnibox
                title="Git branches"
                options={gitBranches.map((branch) => ({
                  label: branch,
                  value: branch,
                }))}
                currentValue={
                  currentGitBranch === ''
                    ? null
                    : { label: currentGitBranch, value: currentGitBranch }
                }
                onChange={onGitBranch}
              />
            )}
          </div>
        </>
      )}

      {firmwareSource === FirmwareSource.GitCommit && (
        <>
          <Alert severity="warning" className={styles.dangerZone}>
            <AlertTitle>DANGER ZONE</AlertTitle>
            Use these sources only if you know what you are doing or was
            instructed by project developers
          </Alert>
          <div className={styles.tabContents}>
            <TextField
              id="git-commit-hash"
              label="Git commit hash"
              fullWidth
              value={gitCommit}
              onChange={onGitCommit}
            />
          </div>
        </>
      )}

      {firmwareSource === FirmwareSource.Local && (
        <>
          <Alert severity="warning" className={styles.dangerZone}>
            <AlertTitle>DANGER ZONE</AlertTitle>
            Use these sources only if you know what you are doing or was
            instructed by project developers
          </Alert>
          <div className={styles.tabContents}>
            <TextField
              id="local-path"
              label="Local path"
              fullWidth
              value={localPath}
              onChange={onLocalPath}
            />
          </div>
        </>
      )}

      <Loader loading={loading} />
      <ShowAlerts severity="error" messages={errors} />
    </>
  );
};

export default FirmwareVersionForm;
