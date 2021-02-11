import { Token } from 'typedi';
import { LoggerService } from './index';

const LoggerToken = new Token<LoggerService>('LOGGER_TOKEN');

export default LoggerToken;
