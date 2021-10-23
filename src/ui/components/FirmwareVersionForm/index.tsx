import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  FormControlLabel,
  makeStyles,
  Tab,
  Tabs,
  TextField,
} from '@material-ui/core';
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { ipcRenderer } from 'electron';
import debounce from 'lodash.debounce';
import Loader from '../Loader';
import ShowAlerts from '../ShowAlerts';
import Omnibox from '../Omnibox';
import {
  FirmwareSource,
  FirmwareVersionDataInput,
  useGetBranchesLazyQuery,
  useGetReleasesLazyQuery,
  useGetPullRequestsLazyQuery,
  PullRequestInput,
} from '../../gql/generated/types';
import { ChooseFolderResponseBody, IpcRequest } from '../../../ipc';
import ApplicationStorage from '../../storage';
import GitRepository from '../../models/GitRepository';

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
  preReleaseCheckbox: {
    marginLeft: theme.spacing(0),
    marginBottom: theme.spacing(2),
  },
  chooseFolderButton: {
    marginTop: `${theme.spacing(1)} !important`,
  },
  firmwareVersionAlert: {
    marginTop: theme.spacing(2),
  },
}));

interface FirmwareVersionCardProps {
  data: FirmwareVersionDataInput | null;
  onChange: (data: FirmwareVersionDataInput) => void;
  gitRepository: GitRepository;
}

const FirmwareVersionForm: FunctionComponent<FirmwareVersionCardProps> = (
  props
) => {
  const { onChange, data, gitRepository } = props;
  const styles = useStyles();

  const [firmwareSource, setFirmwareSource] = useState<FirmwareSource>(
    data?.source || FirmwareSource.GitTag
  );
  const handleFirmwareSourceChange = (
    _event: React.SyntheticEvent,
    value: FirmwareSource
  ) => {
    setFirmwareSource(value);
  };

  const [showPreReleases, setShowPreReleases] = useState<boolean>(false);
  useEffect(() => {
    new ApplicationStorage()
      .getShowPreReleases(false)
      .then((value) => {
        setShowPreReleases(value);
      })
      .catch((err: Error) => {
        console.error('failed to get show pre-releases from storage', err);
      });
  }, []);
  const onShowPreReleases = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setShowPreReleases(checked);
    new ApplicationStorage().setShowPreReleases(checked).catch((err: Error) => {
      console.error('failed to set show pre-releases in storage', err);
    });
  };

  const [
    queryGitTags,
    { loading: gitTagsLoading, data: gitTagsResponse, error: tagsError },
  ] = useGetReleasesLazyQuery();

  const [
    queryGitBranches,
    {
      loading: gitBranchesLoading,
      data: gitBranchesResponse,
      error: branchesError,
    },
  ] = useGetBranchesLazyQuery();

  const [
    queryGitPullRequests,
    {
      loading: gitPullRequestsLoading,
      data: gitPullRequestsResponse,
      error: pullRequestsError,
    },
  ] = useGetPullRequestsLazyQuery();

  const loading =
    gitTagsLoading || gitBranchesLoading || gitPullRequestsLoading;
  const gitTags = gitTagsResponse?.releases ?? [];
  const gitBranches = gitBranchesResponse?.gitBranches ?? [];
  const gitPullRequests = gitPullRequestsResponse?.pullRequests;

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

  /*
    We need to make sure that a valid value is selected
   */
  useEffect(() => {
    if (firmwareSource === FirmwareSource.GitTag) {
      if (
        !showPreReleases &&
        gitTagsResponse?.releases?.length &&
        gitTagsResponse?.releases?.length > 0 &&
        gitTagsResponse?.releases
          ?.filter(({ preRelease }) => !preRelease)
          .filter(({ tagName }) => !gitRepository.tagExcludes.includes(tagName))
          .find((item) => item.tagName === currentGitTag) === undefined
      ) {
        setCurrentGitTag(gitTagsResponse.releases[0].tagName);
      }
    }
  }, [showPreReleases, currentGitTag, gitTagsResponse, firmwareSource]);

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

  const [currentGitCommit, setCurrentGitCommit] = useState<string>(
    data?.gitCommit || ''
  );
  const [debouncedGitCommit, setDebouncedGitCommit] = useState<string>(
    data?.gitCommit || ''
  );

  const debouncedGitCommitHandler = useMemo(
    () => debounce(setDebouncedGitCommit, 1000),
    [setDebouncedGitCommit]
  );

  // Stop the invocation of the debounced function
  // after unmounting
  useEffect(() => {
    return () => {
      debouncedGitCommitHandler.cancel();
    };
  }, [debouncedGitCommitHandler]);

  const setGitCommit = (value: string) => {
    setCurrentGitCommit(value);
    debouncedGitCommitHandler(value);
  };

  const onGitCommit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGitCommit(event.target.value);
  };

  const [localPath, setLocalPath] = useState<string>(data?.localPath || '');
  const onLocalPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalPath(event.target.value);
  };

  const [
    currentGitPullRequest,
    setCurrentGitPullRequest,
  ] = useState<PullRequestInput | null>(data?.gitPullRequest || null);

  /*
    Make sure that a valid pull request is selected
   */
  useEffect(() => {
    if (gitPullRequestsResponse?.pullRequests && currentGitPullRequest) {
      const pullRequest =
        gitPullRequestsResponse.pullRequests.find(
          (item) => item.number === currentGitPullRequest.number
        ) || null;
      // if we have a list of pull requests and the current pull request is not
      // part of that list, then set current pull request to null
      if (!pullRequest) {
        setCurrentGitPullRequest(null);
      }
    }
  }, [gitPullRequestsResponse, currentGitPullRequest]);

  const onGitPullRequest = (value: string | null) => {
    if (value === null) {
      setCurrentGitPullRequest(null);
      return;
    }
    const iValue = parseInt(value, 10);
    const pullRequest = gitPullRequests?.find((item) => item.number === iValue);
    if (pullRequest) {
      setCurrentGitPullRequest({
        id: pullRequest.id,
        number: pullRequest.number,
        title: pullRequest.title,
        headCommitHash: pullRequest.headCommitHash,
      });
    }
  };

  useEffect(() => {
    const storage = new ApplicationStorage();
    storage
      .getFirmwareSource()
      .then((result) => {
        if (result !== null) {
          if (result.source) setFirmwareSource(result.source);
          if (result.gitTag) setCurrentGitTag(result.gitTag);
          if (result.gitCommit) setGitCommit(result.gitCommit);
          if (result.gitBranch) setCurrentGitBranch(result.gitBranch);
          if (result.localPath) setLocalPath(result.localPath);
          if (result.gitPullRequest)
            setCurrentGitPullRequest(result.gitPullRequest);
        }
      })
      .catch((err) => {
        console.error('failed to get firmware source', err);
      });
  }, []);

  const onChooseFolder = () => {
    ipcRenderer
      .invoke(IpcRequest.ChooseFolder)
      .then((result: ChooseFolderResponseBody) => {
        if (result.success) {
          setLocalPath(result.directoryPath);
        }
      })
      .catch((err) => {
        console.log('failed to get local directory path: ', err);
      });
  };

  useEffect(() => {
    switch (firmwareSource) {
      case FirmwareSource.GitTag:
        queryGitTags({
          variables: {
            owner: gitRepository.owner,
            repository: gitRepository.repositoryName,
          },
        });
        break;
      case FirmwareSource.GitBranch:
        queryGitBranches({
          variables: {
            owner: gitRepository.owner,
            repository: gitRepository.repositoryName,
          },
        });
        break;
      case FirmwareSource.GitCommit:
        break;
      case FirmwareSource.Local:
        break;
      case FirmwareSource.GitPullRequest:
        queryGitPullRequests({
          variables: {
            owner: gitRepository.owner,
            repository: gitRepository.repositoryName,
          },
        });
        break;
      default:
        throw new Error(`unknown firmware source: ${firmwareSource}`);
    }
  }, [firmwareSource]);

  useEffect(() => {
    const updatedData = {
      source: firmwareSource,
      gitBranch: currentGitBranch,
      gitTag: currentGitTag,
      gitCommit: debouncedGitCommit,
      localPath,
      gitPullRequest: currentGitPullRequest,
    };
    onChange(updatedData);
    const storage = new ApplicationStorage();
    storage.setFirmwareSource(updatedData).catch((err) => {
      console.error('failed to set firmware source', err);
    });
  }, [
    firmwareSource,
    currentGitBranch,
    currentGitTag,
    debouncedGitCommit,
    localPath,
    currentGitPullRequest,
  ]);

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
        <Tab label="Git Pull Request" value={FirmwareSource.GitPullRequest} />
      </Tabs>

      {firmwareSource === FirmwareSource.GitTag && gitTags !== undefined && (
        <>
          <div className={styles.tabContents}>
            {!loading && (
              <>
                <FormControlLabel
                  className={styles.preReleaseCheckbox}
                  control={
                    <Checkbox
                      checked={showPreReleases}
                      onChange={onShowPreReleases}
                    />
                  }
                  label="Show pre-releases"
                />
                <Omnibox
                  title="Releases"
                  options={gitTags
                    .filter((item) => {
                      if (!showPreReleases) {
                        return item.preRelease === false;
                      }
                      return true;
                    })
                    .map((item) => ({
                      label: item.tagName,
                      value: item.tagName,
                    }))}
                  currentValue={
                    currentGitTag === ''
                      ? null
                      : { label: currentGitTag, value: currentGitTag }
                  }
                  onChange={onGitTag}
                />
                {currentGitTag &&
                  gitTags.filter((item) => {
                    if (!showPreReleases) {
                      return item.preRelease === false;
                    }
                    return true;
                  })[0]?.tagName !== currentGitTag && (
                    <Alert
                      className={styles.firmwareVersionAlert}
                      severity="info"
                    >
                      There is a newer version of the firmware available
                    </Alert>
                  )}
              </>
            )}
          </div>
        </>
      )}

      {firmwareSource === FirmwareSource.GitBranch &&
        gitBranches !== undefined && (
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
              value={currentGitCommit}
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

            <Button
              color="secondary"
              size="small"
              variant="contained"
              className={styles.chooseFolderButton}
              onClick={onChooseFolder}
            >
              Choose folder
            </Button>
          </div>
        </>
      )}

      {firmwareSource === FirmwareSource.GitPullRequest &&
        gitPullRequests !== undefined && (
          <>
            <Alert severity="warning" className={styles.dangerZone}>
              <AlertTitle>DANGER ZONE</AlertTitle>
              Use these sources only if you know what you are doing or was
              instructed by project developers
            </Alert>
            <div className={styles.tabContents}>
              {!loading && (
                <Omnibox
                  title="Git pull Requests"
                  options={gitPullRequests.map((pullRequest) => ({
                    label: `${pullRequest.title} #${pullRequest.number}`,
                    value: `${pullRequest.number}`,
                  }))}
                  currentValue={
                    !currentGitPullRequest
                      ? null
                      : {
                          label: `${currentGitPullRequest.title} #${currentGitPullRequest.number}`,
                          value: `${currentGitPullRequest.number}`,
                        }
                  }
                  onChange={onGitPullRequest}
                />
              )}
            </div>
          </>
        )}

      <Loader loading={loading} />
      <ShowAlerts severity="error" messages={branchesError} />
      <ShowAlerts severity="error" messages={tagsError} />
      <ShowAlerts severity="error" messages={pullRequestsError} />
    </>
  );
};
export default FirmwareVersionForm;
