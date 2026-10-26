import { Octokit } from '@octokit/rest';
import { Service } from 'typedi';
import semver from 'semver';
import FirmwareSource from '../../models/enum/FirmwareSource';
import LuaArgs from '../../graphql/args/Lua';
import LuaScript from '../../models/LuaScript';
import { LoggerService } from '../../logger';

const owner = 'ExpressLRS';
const repo = 'Lua';
const legacyZipName = 'expresslrs-lua-legacy.zip';
const legacyZipFallbackUrl = `https://github.com/${owner}/${repo}/releases/latest/download/${legacyZipName}`;
const releaseZipRegexp = /^expresslrs-lua-v(\d+\.\d+\.\d+)\.zip$/;
// Older modules are rejected by the scripts in the release zip
const minimumFirmwareVersion = '3.5.4';

interface LatestRelease {
  version: string | null;
  fileLocation: string | null;
  legacyFileLocation: string;
}

@Service()
export default class LuaService {
  client: Octokit;

  private latestRelease: Promise<LatestRelease> | null = null;

  constructor(private logger: LoggerService) {
    this.client = new Octokit();
  }

  private async fetchLatestRelease(): Promise<LatestRelease> {
    const { data } = await this.client.repos.getLatestRelease({ owner, repo });
    let version: string | null = null;
    let fileLocation: string | null = null;
    let legacyFileLocation = legacyZipFallbackUrl;
    data.assets.forEach((asset) => {
      const match = asset.name.match(releaseZipRegexp);
      if (match) {
        [, version] = match;
        fileLocation = asset.browser_download_url;
      } else if (asset.name === legacyZipName) {
        legacyFileLocation = asset.browser_download_url;
      }
    });
    return { version, fileLocation, legacyFileLocation };
  }

  // Unauthenticated GitHub API calls are rate limited, so a successful lookup
  // is reused for the rest of the session.
  private async loadLatestRelease(): Promise<LatestRelease> {
    if (this.latestRelease === null) {
      this.latestRelease = this.fetchLatestRelease().catch((err) => {
        this.latestRelease = null;
        throw err;
      });
    }
    return this.latestRelease;
  }

  static firmwareSupported(args: LuaArgs): boolean {
    if (args.source !== FirmwareSource.GitTag) {
      return true;
    }
    const version = semver.coerce(args.gitTag);
    return version === null || semver.gte(version, minimumFirmwareVersion);
  }

  async loadLuaScript(args: LuaArgs): Promise<LuaScript> {
    const firmwareSupported = LuaService.firmwareSupported(args);
    try {
      const release = await this.loadLatestRelease();
      return { ...release, firmwareSupported };
    } catch (err) {
      this.logger?.log('failed to load the latest Lua release', {
        error: err,
      });
      return {
        version: null,
        fileLocation: null,
        legacyFileLocation: legacyZipFallbackUrl,
        firmwareSupported,
      };
    }
  }
}
