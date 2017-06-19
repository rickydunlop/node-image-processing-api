import jwt from 'jsonwebtoken';
import { secretKey } from '../config';

export default (ctx) => {
  /* eslint-disable no-param-reassign*/
  if (ctx.request.body.password === 'bynd') {
    ctx.status = 200;
    ctx.body = {
      token: jwt.sign({
        role: 'admin',
      }, secretKey),
      message: 'Authentication Successful',
    };
  } else {
    ctx.status = 401;
    ctx.body = {
      message: 'Authentication Failed',
    };
  }
  return ctx;
  /* eslint-enable no-param-reassign */
};
