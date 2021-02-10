import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const searchParams = new URLSearchParams(window.location.search.slice(1));
const httpLink = new HttpLink({
  uri: searchParams.get('api_url') ?? 'http://localhost:3500/graphql',
  credentials: 'include',
  headers: () => ({
    'Accept-Language': 'en',
  }),
});

const wsLink = new WebSocketLink({
  uri: searchParams.get('subscriptions_url') ?? 'ws://localhost:3500/graphql',
  options: {
    reconnect: true,
    lazy: true,
  },
});

// Send query request based on the type definition
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = () =>
  new ApolloClient({
    connectToDevTools: process.env.NODE_ENV === 'development',
    ssrForceFetchDelay: 100,
    cache: new InMemoryCache(),
    link,
  });

export default client();
