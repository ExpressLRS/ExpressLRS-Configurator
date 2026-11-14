import 'reflect-metadata';
import LuaService from './index';
import LuaArgs from '../../graphql/args/Lua';
import FirmwareSource from '../../models/enum/FirmwareSource';
import { LoggerService } from '../../logger';

// @octokit/rest ships ESM only; each test swaps in its own client.
jest.mock('@octokit/rest', () => ({ Octokit: jest.fn() }));

const luaArgs = (source: FirmwareSource, gitTag = ''): LuaArgs => ({
  source,
  gitTag,
});

const releaseUrl = 'https://github.com/ExpressLRS/Lua/releases/download/v1.1.0';
const legacyFallbackUrl = 'https://github.com/ExpressLRS/Lua/releases/latest/download/expresslrs-lua-legacy.zip';

const createService = (getLatestRelease: jest.Mock) => {
  const logger = { log: jest.fn() } as unknown as LoggerService;
  const service = new LuaService(logger);
  service.client = { repos: { getLatestRelease } } as never;
  return service;
};

const release = (names: string[]) => ({
  data: {
    assets: names.map((name) => ({
      name,
      browser_download_url: `${releaseUrl}/${name}`,
    })),
  },
});

describe('LuaService.firmwareSupported', () => {
  it.each(['3.5.4', '3.6.0', '4.0.0-RC1', '4.1.0'])('accepts tag %s', (tag) => {
    expect(
      LuaService.firmwareSupported(luaArgs(FirmwareSource.GitTag, tag)),
    ).toBe(true);
  });

  it.each(['2.5.0', '3.0.0', '3.5.3'])('rejects tag %s', (tag) => {
    expect(
      LuaService.firmwareSupported(luaArgs(FirmwareSource.GitTag, tag)),
    ).toBe(false);
  });

  it.each([
    FirmwareSource.GitBranch,
    FirmwareSource.GitCommit,
    FirmwareSource.GitPullRequest,
    FirmwareSource.Local,
  ])('accepts %s sources', (source) => {
    expect(LuaService.firmwareSupported(luaArgs(source))).toBe(true);
  });
});

describe('LuaService.loadLuaScript', () => {
  it('returns the release and legacy zips', async () => {
    const getLatestRelease = jest
      .fn()
      .mockResolvedValue(
        release(['expresslrs-lua-legacy.zip', 'expresslrs-lua-v1.1.0.zip']),
      );
    const service = createService(getLatestRelease);

    expect(
      await service.loadLuaScript(luaArgs(FirmwareSource.GitTag, '3.5.3')),
    ).toEqual({
      version: '1.1.0',
      fileLocation: `${releaseUrl}/expresslrs-lua-v1.1.0.zip`,
      legacyFileLocation: `${releaseUrl}/expresslrs-lua-legacy.zip`,
      firmwareSupported: false,
    });
  });

  it('falls back to the latest legacy zip URL when the release has none', async () => {
    const service = createService(
      jest.fn().mockResolvedValue(release(['expresslrs-lua-v1.0.0.zip'])),
    );

    const luaScript = await service.loadLuaScript(
      luaArgs(FirmwareSource.GitBranch),
    );
    expect(luaScript.legacyFileLocation).toBe(legacyFallbackUrl);
  });

  it('reuses a successful lookup', async () => {
    const getLatestRelease = jest
      .fn()
      .mockResolvedValue(release(['expresslrs-lua-v1.1.0.zip']));
    const service = createService(getLatestRelease);

    await service.loadLuaScript(luaArgs(FirmwareSource.GitBranch));
    await service.loadLuaScript(luaArgs(FirmwareSource.GitBranch));
    expect(getLatestRelease).toHaveBeenCalledTimes(1);
  });

  it('keeps the legacy zip available and retries after a failed lookup', async () => {
    const getLatestRelease = jest
      .fn()
      .mockRejectedValueOnce(new Error('rate limited'))
      .mockResolvedValue(release(['expresslrs-lua-v1.1.0.zip']));
    const service = createService(getLatestRelease);

    expect(
      await service.loadLuaScript(luaArgs(FirmwareSource.GitBranch)),
    ).toEqual({
      version: null,
      fileLocation: null,
      legacyFileLocation: legacyFallbackUrl,
      firmwareSupported: true,
    });
    const retried = await service.loadLuaScript(
      luaArgs(FirmwareSource.GitBranch),
    );
    expect(retried.version).toBe('1.1.0');
  });
});
