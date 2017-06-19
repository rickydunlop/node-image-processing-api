import jwt from 'koa-jwt';
import { secretKey } from '../config';

export default jwt({
  secret: secretKey,
});
