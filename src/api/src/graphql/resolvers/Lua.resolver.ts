import { Arg, Args, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import LuaArgs from '../args/Lua';
import GitRepository from '../inputs/GitRepositoryInput';
import LuaService from '../../services/Lua';
import LuaScript from '../../models/LuaScript';

@Service()
@Resolver()
export default class LuaResolver {
  constructor(private luaService: LuaService) {}

  @Query(() => LuaScript)
  async luaScript(
    @Args(() => LuaArgs) args: LuaArgs,
    @Arg('gitRepository', () => GitRepository) gitRepository: GitRepository
  ): Promise<LuaScript> {
    const fileLocation = await this.luaService.loadLuaScript(
      args,
      gitRepository
    );
    return { fileLocation };
  }
}
