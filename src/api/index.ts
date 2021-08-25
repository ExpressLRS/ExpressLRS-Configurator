import { ApolloServer, PubSub } from 'apollo-server-express';
import express, { Express } from 'express';
import * as http from 'http';
import getPort from 'get-port';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { ConfigToken, IConfig } from './src/config';
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
import './src/graphql/enum/DeviceTarget';
// eslint-disable-next-line import/extensions
import './src/graphql/enum/UserDefineKey';
import UserDefinesBuilder from './src/services/UserDefinesBuilder';
import UpdatesService from './src/services/Updates';
import UpdatesResolver from './src/graphql/resolvers/Updates.resolver';
import SerialMonitorResolver from './src/graphql/resolvers/SerialMonitor.resolver';
import SerialMonitorService from './src/services/SerialMonitor';
import TargetsService from './src/services/Targets';

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

    const rawRepoUrl = `https://raw.githubusercontent.com/${config.git.owner}/${config.git.repositoryName}`;
    Container.set(
      UserDefinesBuilder,
      new UserDefinesBuilder(rawRepoUrl, logger)
    );

    Container.set(TargetsService, new TargetsService(logger));

    const schema = await buildSchema({
      resolvers: [
        FirmwareResolver,
        SourcesResolver,
        UpdatesResolver,
        SerialMonitorResolver,
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
