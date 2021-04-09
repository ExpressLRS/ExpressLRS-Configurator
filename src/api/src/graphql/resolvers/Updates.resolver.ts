import { Arg, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import UpdatesAvailability from '../../models/UpdatesAvailability';
import UpdatesService from '../../services/Updates';

@Service()
@Resolver()
export default class UpdatesResolver {
  constructor(private updatesService: UpdatesService) {}

  @Query(() => UpdatesAvailability)
  async checkForUpdates(@Arg('currentVersion') currentVersion: string) {
    return this.updatesService.checkForNewerReleases(currentVersion);
  }
}
