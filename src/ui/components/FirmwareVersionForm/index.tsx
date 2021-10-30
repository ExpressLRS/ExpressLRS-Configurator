import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  FormControlLabel,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
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

const PREFIX = 'FirmwareVersionForm';

const classes = {
  tabs: `${PREFIX}-tabs`,
  dangerZone: `${PREFIX}-dangerZone`,
  tabContents: `${PREFIX}-tabContents`,
  loader: `${PREFIX}-loader`,
  preReleaseCheckbox: `${PREFIX}-preReleaseCheckbox`,
  chooseFolderButton: `${PREFIX}-chooseFolderButton`,
  firmwareVersionAlert: `${PREFIX}-firmwareVersionAlert`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.tabs}`]: {
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.dangerZone}`]: {
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.tabContents}`]: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.loader}`]: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.preReleaseCheckbox}`]: {
    marginLeft: theme.spacing(0),
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.chooseFolderButton}`]: {
    marginTop: `${theme.spacing(1)} !important`,
  },

  [`& .${classes.firmwareVersionAlert}`]: {
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

  const gitTags = useMemo(() => {
    return (
      gitTagsResponse?.releases.filter(
        ({ tagName }) => !gitRepository.tagExcludes.includes(tagName)
      ) ?? []
    );
  }, [gitRepository.tagExcludes, gitTagsResponse?.releases]);

  const gitBranches = useMemo(() => {
    return gitBranchesResponse?.gitBranches ?? [];
  }, [gitBranchesResponse?.gitBranches]);

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
        gitTags?.length &&
        gitTags?.length > 0 &&
        gitTags
          ?.filter(({ preRelease }) => !preRelease)
          .find((item) => item.tagName === currentGitTag) === undefined
      ) {
        setCurrentGitTag(gitTags[0].tagName);
      }
    }
  }, [showPreReleases, currentGitTag, gitTags, firmwareSource]);

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
      .getFirmwareSource(gitRepository)
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
  }, [
    gitRepository,
    firmwareSource,
    queryGitTags,
    queryGitBranches,
    queryGitPullRequests,
  ]);

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
    storage.setFirmwareSource(updatedData, gitRepository).catch((err) => {
      console.error('failed to set firmware source', err);
    });
  }, [
    firmwareSource,
    currentGitBranch,
    currentGitTag,
    debouncedGitCommit,
    localPath,
    currentGitPullRequest,
    onChange,
    gitRepository,
  ]);

  const gitTagOptions = useMemo(() => {
    return gitTags
      .filter((item) => {
        if (!showPreReleases) {
          return item.preRelease === false;
        }
        return true;
      })
      .map((item) => ({
        label: item.tagName,
        value: item.tagName,
      }));
  }, [gitTags, showPreReleases]);

  const gitBranchOptions = useMemo(() => {
    return gitBranches.map((branch) => ({
      label: branch,
      value: branch,
    }));
  }, [gitBranches]);

  const gitPullRequestOptions = useMemo(() => {
    return gitPullRequests?.map((pullRequest) => ({
      label: `${pullRequest.title} #${pullRequest.number}`,
      value: `${pullRequest.number}`,
    }));
  }, [gitPullRequests]);

  return (
    <Root>
      <Tabs
        className={classes.tabs}
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
          <div className={classes.tabContents}>
            {!loading && (
              <>
                <FormControlLabel
                  className={classes.preReleaseCheckbox}
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
                  options={gitTagOptions}
                  currentValue={
                    gitTagOptions.find(
                      (item) => item.value === currentGitTag
                    ) ?? null
                  }
                  onChange={onGitTag}
                />
                {currentGitTag &&
                  gitTagOptions.length > 0 &&
                  gitTagOptions[0]?.value !== currentGitTag && (
                    <Alert
                      className={classes.firmwareVersionAlert}
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
            <Alert severity="warning" className={classes.dangerZone}>
              <AlertTitle>DANGER ZONE</AlertTitle>
              Use these sources only if you know what you are doing or was
              instructed by project developers
            </Alert>
            <div className={classes.tabContents}>
              {!loading && (
                <Omnibox
                  title="Git branches"
                  options={gitBranchOptions}
                  currentValue={
                    gitBranchOptions.find(
                      (item) => item.value === currentGitBranch
                    ) ?? null
                  }
                  onChange={onGitBranch}
                />
              )}
            </div>
          </>
        )}
      {firmwareSource === FirmwareSource.GitCommit && (
        <>
          <Alert severity="warning" className={classes.dangerZone}>
            <AlertTitle>DANGER ZONE</AlertTitle>
            Use these sources only if you know what you are doing or was
            instructed by project developers
          </Alert>
          <div className={classes.tabContents}>
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
          <Alert severity="warning" className={classes.dangerZone}>
            <AlertTitle>DANGER ZONE</AlertTitle>
            Use these sources only if you know what you are doing or was
            instructed by project developers
          </Alert>
          <div className={classes.tabContents}>
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
              className={classes.chooseFolderButton}
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
            <Alert severity="warning" className={classes.dangerZone}>
              <AlertTitle>DANGER ZONE</AlertTitle>
              Use these sources only if you know what you are doing or was
              instructed by project developers
            </Alert>
            <div className={classes.tabContents}>
              {!loading && (
                <Omnibox
                  title="Git pull Requests"
                  options={gitPullRequestOptions ?? []}
                  currentValue={
                    gitPullRequestOptions?.find(
                      (item) =>
                        item.value === `${currentGitPullRequest?.number}`
                    ) ?? null
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
    </Root>
  );
};
export default FirmwareVersionForm;
