import { ApolloServer, PubSub } from 'apollo-server-express';
import express, { Express } from 'express';
import * as http from 'http';
import getPort from 'get-port';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { ConfigToken, FirmwareParamsLoaderType, IConfig } from './src/config';
import FirmwareService from './src/services/Firmware';
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
import TargetUserDefinesFactory from './src/factories/TargetUserDefinesFactory';
import MulticastDnsService from './src/services/MulticastDns';
import MulticastDnsMonitorResolver from './src/graphql/resolvers/MulticastDnsMonitor.resolver';
import LuaService from './src/services/Lua';
import LuaResolver from './src/graphql/resolvers/Lua.resolver';
import MulticastDnsSimulatorService from './src/services/MulticastDns/MulticastDnsSimulator';
import MulticastDnsNotificationsService from './src/services/MulticastDnsNotificationsService';
import HttpTargetsService from './src/services/TargetsLoader/HttpTargets';
import TargetsLoader from './src/services/TargetsLoader';
import HttpUserDefinesLoader from './src/services/UserDefinesLoader/HttpUserDefinesLoader';
import GitUserDefinesLoader from './src/services/UserDefinesLoader/GitUserDefinesLoader';

export default class ApiServer {
  app: Express | undefined;

  server: http.Server | undefined;

  static async getPort(port: number | undefined): Promise<number> {
    return getPort({ port });
  }

  async start(
    config: IConfig,
    logger: LoggerService,
    port: number
  ): Promise<http.Server> {
    const pubSub = new PubSub();
    Container.set([{ id: ConfigToken, value: config }]);
    Container.set([{ id: PubSubToken, value: pubSub }]);
    Container.set([{ id: LoggerToken, value: logger }]);

    const platformio = new Platformio(
      config.getPlatformioPath,
      config.platformioStateTempStoragePath,
      config.PATH,
      config.env,
      logger
    );
    Container.set(
      FirmwareService,
      new FirmwareService(
        config.PATH,
        config.firmwaresPath,
        platformio,
        new FirmwareBuilder(platformio),
        pubSub,
        logger
      )
    );
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

    const targetUserDefinesFactory = new TargetUserDefinesFactory(
      deviceService
    );

    if (config.userDefinesLoader === FirmwareParamsLoaderType.Git) {
      Container.set(
        UserDefinesBuilder,
        new UserDefinesBuilder(
          targetUserDefinesFactory,
          new GitUserDefinesLoader(
            logger,
            config.PATH,
            config.userDefinesStoragePath
          )
        )
      );
    } else if (config.userDefinesLoader === FirmwareParamsLoaderType.Http) {
      Container.set(
        UserDefinesBuilder,
        new UserDefinesBuilder(
          targetUserDefinesFactory,
          new HttpUserDefinesLoader(logger)
        )
      );
    }

    if (config.targetsLoader === FirmwareParamsLoaderType.Git) {
      Container.set(
        TargetsLoader,
        new GitTargetsService(
          logger,
          deviceService,
          config.PATH,
          config.targetsStoragePath
        )
      );
    } else if (config.targetsLoader === FirmwareParamsLoaderType.Http) {
      Container.set(
        TargetsLoader,
        new HttpTargetsService(logger, deviceService)
      );
    } else {
      throw new Error('FirmwareTargetsLoaderType is not set');
    }

    Container.set(LuaService, new LuaService(logger));

    const schema = await buildSchema({
      resolvers: [
        FirmwareResolver,
        SourcesResolver,
        UpdatesResolver,
        SerialMonitorResolver,
        MulticastDnsMonitorResolver,
        LuaResolver,
      ],
      container: Container,
      pubSub,
    });
    const server = new ApolloServer({
      schema,
      introspection: true,
    });
    this.app = express();
    server.applyMiddleware({
      app: this.app,
    });

    this.server = this.app.listen({ port });

    /*
      I know, crazy. It is 45 minutes, but on slower network connection it might take a while to download
      and install all Platformio dependencies and build firmware.
     */
    this.server.setTimeout(45 * 60 * 1000);
    server.installSubscriptionHandlers(this.server);

    return this.server;
  }

  async stop(): Promise<void> {
    if (this.server === undefined) {
      throw new Error('server was not started');
    }
    return new Promise((resolve, reject) => {
      this.server?.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
