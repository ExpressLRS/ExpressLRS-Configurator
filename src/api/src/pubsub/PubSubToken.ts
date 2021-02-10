import { Token } from 'typedi';
import { PubSubEngine } from 'graphql-subscriptions';

const PubSubToken = new Token<PubSubEngine>('PUBSUB_TOKEN');

export default PubSubToken;
