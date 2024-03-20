import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import semver from 'semver';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
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
import useDeveloperMode from '../../hooks/useDeveloperMode';

const styles: Record<string, SxProps<Theme>> = {
  tabs: {
    marginBottom: 2,
  },
  dangerZone: {
    marginBottom: 2,
  },
  tabContents: {
    marginTop: 3,
    marginBottom: 2,
  },
  preReleaseCheckbox: {
    marginLeft: 0,
    marginBottom: 2,
  },
  chooseFolderButton: {
    marginTop: 1,
  },
  releaseNotes: {
    marginTop: 1,
  },
  firmwareVersionAlert: {
    marginTop: 2,
  },
  betaFpvAlert: {
    marginTop: 2,
    marginBottom: 1,
  },
};

interface FirmwareVersionCardProps {
  data: FirmwareVersionDataInput | null;
  onChange: (data: FirmwareVersionDataInput) => void;
  gitRepository: GitRepository;
}

const FirmwareVersionForm: FunctionComponent<FirmwareVersionCardProps> = (
  props
) => {
  const { onChange, data, gitRepository } = props;

  const { t } = useTranslation();

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
      gitTagsResponse?.releases.filter(({ tagName }) => {
        for (let i = 0; i < gitRepository.tagExcludes.length; i++) {
          const tagExclude = gitRepository.tagExcludes[i];
          if (
            semver.satisfies(tagName, tagExclude, { includePrerelease: true })
          ) {
            return false;
          }
        }
        return true;
      }) ?? []
    ).sort((a, b) => semver.rcompare(a.tagName, b.tagName));
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

  const [currentGitPullRequest, setCurrentGitPullRequest] =
    useState<PullRequestInput | null>(data?.gitPullRequest || null);

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
      // prevent stale head commit hash cache
      if (
        pullRequest &&
        pullRequest.headCommitHash !== currentGitPullRequest.headCommitHash
      ) {
        setCurrentGitPullRequest({
          id: pullRequest.id,
          number: pullRequest.number,
          title: pullRequest.title,
          headCommitHash: pullRequest.headCommitHash,
        });
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
    window.electron.ipcRenderer
      .invoke(IpcRequest.ChooseFolder)
      .then((result: ChooseFolderResponseBody) => {
        if (result.success) {
          setLocalPath(result.directoryPath);
        }
      })
      .catch((err) => {
        console.error('failed to get local directory path: ', err);
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

  const showBetaFpvAlert =
    localPath?.toLocaleLowerCase()?.indexOf('betafpv') > -1;

  const { isDeveloperModeEnabled } = useDeveloperMode();

  return (
    <>
      <Tabs
        sx={styles.tabs}
        defaultValue={FirmwareSource.GitTag}
        value={firmwareSource}
        onChange={handleFirmwareSourceChange}
      >
        <Tab
          label={t('FirmwareVersionForm.OfficialReleases')}
          value={FirmwareSource.GitTag}
        />
        {isDeveloperModeEnabled && (
          <Tab
            label={t('FirmwareVersionForm.GitBranch')}
            value={FirmwareSource.GitBranch}
          />
        )}
        {isDeveloperModeEnabled && (
          <Tab
            label={t('FirmwareVersionForm.GitCommit')}
            value={FirmwareSource.GitCommit}
          />
        )}
        {isDeveloperModeEnabled && (
          <Tab
            label={t('FirmwareVersionForm.Local')}
            value={FirmwareSource.Local}
          />
        )}
        {isDeveloperModeEnabled && (
          <Tab
            label={t('FirmwareVersionForm.GitPullRequest')}
            value={FirmwareSource.GitPullRequest}
          />
        )}
      </Tabs>
      {firmwareSource === FirmwareSource.GitTag && gitTags !== undefined && (
        <Box sx={styles.tabContents}>
          {!loading && (
            <>
              <FormControlLabel
                sx={styles.preReleaseCheckbox}
                control={
                  <Checkbox
                    checked={showPreReleases}
                    onChange={onShowPreReleases}
                  />
                }
                label={t('FirmwareVersionForm.ShowPreRreleases')}
              />
              <Omnibox
                title={t('FirmwareVersionForm.Releases')}
                options={gitTagOptions}
                currentValue={
                  gitTagOptions.find((item) => item.value === currentGitTag) ??
                  null
                }
                onChange={onGitTag}
              />
              <Button
                size="small"
                sx={styles.releaseNotes}
                target="_blank"
                rel="noreferrer noreferrer"
                href={`${gitRepository.url}/releases/tag/${currentGitTag}`}
              >
                {t('FirmwareVersionForm.ReleaseNotes')}
              </Button>
              {currentGitTag &&
                gitTagOptions.length > 0 &&
                gitTagOptions[0]?.value !== currentGitTag && (
                  <Alert sx={styles.firmwareVersionAlert} severity="info">
                    {t('FirmwareVersionForm.NewerVersionAvailable')}
                  </Alert>
                )}
              {(currentGitTag === '2.5.0' || currentGitTag === '2.5.1') &&
                gitRepository.repositoryName === 'ExpressLRS' && (
                  <Alert sx={styles.firmwareVersionAlert} severity="warning">
                    {t('FirmwareVersionForm.UpgradeToV3')}
                  </Alert>
                )}
            </>
          )}
        </Box>
      )}
      {firmwareSource === FirmwareSource.GitBranch &&
        gitBranches !== undefined && (
          <>
            <Alert severity="warning" sx={styles.dangerZone}>
              <AlertTitle>
                {t('FirmwareVersionForm.DangerZoneTitle')}
              </AlertTitle>
              {t('FirmwareVersionForm.DangerZoneContent')}
            </Alert>
            <Box sx={styles.tabContents}>
              {!loading && (
                <Omnibox
                  title={t('FirmwareVersionForm.GitBranches')}
                  options={gitBranchOptions}
                  currentValue={
                    gitBranchOptions.find(
                      (item) => item.value === currentGitBranch
                    ) ?? null
                  }
                  onChange={onGitBranch}
                />
              )}
            </Box>
          </>
        )}
      {firmwareSource === FirmwareSource.GitCommit && (
        <>
          <Alert severity="warning" sx={styles.dangerZone}>
            <AlertTitle>{t('FirmwareVersionForm.DangerZoneTitle')}</AlertTitle>
            {t('FirmwareVersionForm.DangerZoneContent')}
          </Alert>
          <Box sx={styles.tabContents}>
            <TextField
              id="git-commit-hash"
              label={t('FirmwareVersionForm.GitCommitHash')}
              fullWidth
              value={currentGitCommit}
              onChange={onGitCommit}
            />
          </Box>
        </>
      )}
      {firmwareSource === FirmwareSource.Local && (
        <>
          <Alert severity="warning" sx={styles.dangerZone}>
            <AlertTitle>{t('FirmwareVersionForm.DangerZoneTitle')}</AlertTitle>
            {t('FirmwareVersionForm.DangerZoneContent')}
          </Alert>
          <Box sx={styles.tabContents}>
            <TextField
              id="local-path"
              label={t('FirmwareVersionForm.LocalPath')}
              fullWidth
              value={localPath}
              onChange={onLocalPath}
            />

            {showBetaFpvAlert && (
              <Alert severity="error" sx={styles.betaFpvAlert}>
                <AlertTitle>
                  {t('FirmwareVersionForm.AttentionTitle')}
                </AlertTitle>
                {t('FirmwareVersionForm.AttentionContent')}
              </Alert>
            )}

            <Button
              color="secondary"
              size="small"
              variant="contained"
              sx={styles.chooseFolderButton}
              onClick={onChooseFolder}
            >
              {t('FirmwareVersionForm.ChooseFolder')}
            </Button>
          </Box>
        </>
      )}
      {firmwareSource === FirmwareSource.GitPullRequest &&
        gitPullRequests !== undefined && (
          <>
            <Alert severity="warning" sx={styles.dangerZone}>
              <AlertTitle>
                {t('FirmwareVersionForm.DangerZoneTitle')}
              </AlertTitle>
              {t('FirmwareVersionForm.DangerZoneContent')}
            </Alert>
            <Box sx={styles.tabContents}>
              {!loading && (
                <Omnibox
                  title={t('FirmwareVersionForm.GitPullRequests')}
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
            </Box>
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
