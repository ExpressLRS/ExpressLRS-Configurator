import { Token } from 'typedi';
import { type PubSub } from 'type-graphql';

const PubSubToken = new Token<PubSub>('PUBSUB_TOKEN');

export default PubSubToken;
