import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const searchParams = new URLSearchParams(window.location.search.slice(1));
const authorization = `Bearer ${window.electron.apiAuthToken}`;
const httpLink = new HttpLink({
  uri: searchParams.get('api_url') ?? 'http://127.0.0.1:3500/graphql',
  headers: {
    'Accept-Language': 'en',
    Authorization: authorization,
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: searchParams.get('subscriptions_url') ?? 'ws://127.0.0.1:3500/graphql',
    connectionParams: { authorization },
  }),
);

// Send query request based on the type definition
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default client;
