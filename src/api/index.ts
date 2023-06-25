import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express, { Express } from 'express';
import * as http from 'http';
import getPort from 'get-port';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import path from 'path';
import { ConfigToken, IConfig } from './src/config';
import PlatformioFlashingStrategyService from './src/services/PlatformioFlashingStrategy';
import Platformio from './src/library/Platformio';
import FirmwareBuilder from './src/library/FirmwareBuilder';
import PubSubToken from './src/pubsub/PubSubToken';
import { LoggerService } from './src/logger';
import LoggerToken from './src/logger/LoggerToken';
import FirmwareResolver from './src/graphql/resolvers/Firmware.resolver';
import SourcesResolver from './src/graphql/resolvers/Sources.resolver';

// importing for side effects
// eslint-disable-next-line import/extensions
import './src/graphql/enum/UserDefineKey';
import UserDefinesBuilder from './src/services/UserDefinesBuilder';
import UpdatesService from './src/services/Updates';
import UpdatesResolver from './src/graphql/resolvers/Updates.resolver';
import SerialMonitorResolver from './src/graphql/resolvers/SerialMonitor.resolver';
import SerialMonitorService from './src/services/SerialMonitor';
import GitTargetsService from './src/services/TargetsLoader/GitTargets';
import DeviceService from './src/services/Device';
import MulticastDnsService from './src/services/MulticastDns';
import MulticastDnsMonitorResolver from './src/graphql/resolvers/MulticastDnsMonitor.resolver';
import LuaService from './src/services/Lua';
import LuaResolver from './src/graphql/resolvers/Lua.resolver';
import LogFileService from './src/services/LogFile';
import LogFileResolver from './src/graphql/resolvers/LogFile.resolver';
import MulticastDnsSimulatorService from './src/services/MulticastDns/MulticastDnsSimulator';
import MulticastDnsNotificationsService from './src/services/MulticastDnsNotificationsService';
import TargetsLoader from './src/services/TargetsLoader';
import GitUserDefinesLoader from './src/services/UserDefinesLoader/GitUserDefinesLoader';
import FlashingStrategyLocatorService from './src/services/FlashingStrategyLocator';
import Python from './src/library/Python';
import BinaryFlashingStrategyService from './src/services/BinaryFlashingStrategy';
import DeviceDescriptionsLoader from './src/services/BinaryFlashingStrategy/DeviceDescriptionsLoader';
import BinaryConfigurator from './src/services/BinaryFlashingStrategy/BinaryConfigurator';
import CloudBinariesCache from './src/services/BinaryFlashingStrategy/CloudBinariesCache';

export default class ApiServer {
  app: Express | undefined;

  httpServer: http.Server | undefined;

  static async getPort(port: number | undefined): Promise<number> {
    return getPort({ port });
  }

  async buildContainer(config: IConfig, logger: LoggerService): Promise<void> {
    const pubSub = new PubSub();
    Container.set([{ id: ConfigToken, value: config }]);
    Container.set([{ id: PubSubToken, value: pubSub }]);
    Container.set([{ id: LoggerToken, value: logger }]);

    const python = new Python(config.PATH, config.env, logger);

    Container.set(Python, python);

    const platformio = new Platformio(
      config.getPlatformioPath,
      config.platformioStateTempStoragePath,
      config.env,
      logger,
      python
    );

    Container.set(Platformio, platformio);

    Container.set(
      UpdatesService,
      new UpdatesService(
        config.configuratorGit.owner,
        config.configuratorGit.repositoryName
      )
    );
    Container.set(
      SerialMonitorService,
      new SerialMonitorService(pubSub, logger)
    );

    const mDnsNotifications = new MulticastDnsNotificationsService(
      pubSub,
      logger
    );
    if (config.multicastDnsSimulatorEnabled) {
      Container.set(
        MulticastDnsService,
        new MulticastDnsSimulatorService(mDnsNotifications)
      );
    } else {
      Container.set(
        MulticastDnsService,
        new MulticastDnsService(mDnsNotifications, logger)
      );
    }

    const deviceService = new DeviceService(logger);
    await deviceService.loadFromFileSystemAt(config.devicesPath);

    Container.set(DeviceService, deviceService);

    const userDefinesBuilder = new UserDefinesBuilder(
      new GitUserDefinesLoader(
        logger,
        config.PATH,
        config.userDefinesStoragePath
      ),
      deviceService
    );

    Container.set(UserDefinesBuilder, userDefinesBuilder);

    const targetsLoader = new GitTargetsService(
      logger,
      deviceService,
      config.PATH,
      config.targetsStoragePath
    );
    Container.set(TargetsLoader, targetsLoader);

    const firmwareBuilder = new FirmwareBuilder(platformio, logger);
    const platformioFlashingStrategyService =
      new PlatformioFlashingStrategyService(
        config.PATH,
        config.firmwaresPath,
        platformio,
        firmwareBuilder,
        pubSub,
        logger,
        userDefinesBuilder,
        targetsLoader
      );

    const deviceDescriptionsLoader = new DeviceDescriptionsLoader(
      logger,
      config.PATH,
      path.join(config.userDataPath, 'firmwares', 'binary-targets'),
      path.join(config.userDataPath, 'firmwares', 'device-options')
    );
    const cloudBinariesCache = new CloudBinariesCache(
      config.cloudCacheServer,
      config.firmwareCloudCachePath
    );
    const binaryConfigurator = new BinaryConfigurator(python, logger);
    const binaryFlashingStrategyService = new BinaryFlashingStrategyService(
      config.PATH,
      path.join(config.userDataPath, 'firmwares', 'binary'),
      pubSub,
      binaryConfigurator,
      platformio,
      firmwareBuilder,
      deviceDescriptionsLoader,
      cloudBinariesCache,
      logger
    );

    Container.set(
      FlashingStrategyLocatorService,
      new FlashingStrategyLocatorService(
        [binaryFlashingStrategyService, platformioFlashingStrategyService],
        logger
      )
    );

    Container.set(LuaService, new LuaService(logger));
    Container.set(LogFileService, new LogFileService(logger));
  }

  async start(
    config: IConfig,
    logger: LoggerService,
    port: number
  ): Promise<http.Server> {
    await this.buildContainer(config, logger);
    this.app = express();

    this.app.use('/locales', express.static(config.localesPath));

    this.httpServer = createServer(this.app);
    /*
          I know, crazy. It is 45 minutes, but on slower network connection it might take a while to download
          and install all Platformio dependencies and build firmware.
         */
    this.httpServer.setTimeout(45 * 60 * 1000);

    const wsServer = new WebSocketServer({
      server: this.httpServer,
      path: '/graphql',
    });

    const schema = await buildSchema({
      resolvers: [
        FirmwareResolver,
        SourcesResolver,
        UpdatesResolver,
        SerialMonitorResolver,
        MulticastDnsMonitorResolver,
        LuaResolver,
        LogFileResolver,
      ],
      container: Container,
      pubSub: Container.get<PubSub>(PubSubToken),
    });

    // not a React component
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer({
      schema,
      introspection: true,
      plugins: [
        {
          async serverWillStart() {
            return {
              async drainServer() {
                serverCleanup?.dispose();
              },
            };
          },
        },
      ],
    });

    // You must `await server.start()` before calling `server.applyMiddleware()
    await server.start();

    server.applyMiddleware({
      app: this.app,
    });

    this.httpServer = this.httpServer.listen({ port });

    return this.httpServer;
  }

  async stop(): Promise<void> {
    if (this.httpServer === undefined) {
      throw new Error('server was not started');
    }
    return new Promise((resolve, reject) => {
      this.httpServer?.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
