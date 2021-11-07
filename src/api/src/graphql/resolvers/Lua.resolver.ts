import { Arg, Args, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import TargetArgs from '../args/Target';
import GitRepository from '../inputs/GitRepositoryInput';
import LuaService from '../../services/Lua';
import LuaScript from '../../models/luaScript';

@Service()
@Resolver()
export default class LuaResolver {
  constructor(private luaService: LuaService) {}

  @Query(() => LuaScript)
  async luaScript(
    @Args() args: TargetArgs,
    @Arg('gitRepository') gitRepository: GitRepository
  ): Promise<LuaScript> {
    const fileLocation = this.luaService.loadLuaScript(args, gitRepository);
    return { fileLocation };
  }
}
