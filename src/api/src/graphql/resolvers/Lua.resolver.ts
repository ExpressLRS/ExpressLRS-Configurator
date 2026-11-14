import { Args, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import LuaArgs from '../args/Lua';
import LuaService from '../../services/Lua';
import LuaScript from '../../models/LuaScript';

@Service()
@Resolver()
export default class LuaResolver {
  constructor(private luaService: LuaService) {}

  @Query(() => LuaScript)
  async luaScript(@Args(() => LuaArgs) args: LuaArgs): Promise<LuaScript> {
    return this.luaService.loadLuaScript(args);
  }
}
