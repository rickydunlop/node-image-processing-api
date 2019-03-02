import jwt from 'koa-jwt';
import { SECRET_KEY } from '../config';

export default jwt({
  secret: SECRET_KEY,
});
