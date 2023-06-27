import { GraphQLScalarType, Kind } from 'graphql';

const JSONObjectScalar = new GraphQLScalarType({
  name: 'JSONObject',
  description: 'JSON object',
  parseValue: (value) => {
    if (typeof value === 'object') {
      return value;
    }
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return null;
  },
  serialize: (value) => {
    if (typeof value === 'object') {
      return value;
    }
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return null;
  },
  parseLiteral: (ast) => {
    switch (ast.kind) {
      case Kind.STRING:
        return JSON.parse(ast.value);
      case Kind.OBJECT:
        throw new Error(`Not sure what to do with OBJECT for ObjectScalarType`);
      default:
        return null;
    }
  },
});

export default JSONObjectScalar;
