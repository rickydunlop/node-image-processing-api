import Router from 'koa-router';
import { API_VERSION } from '../config';

import authenticate from '../middlewares/authenticate';

const api = 'authenticate';

const router = new Router();

router.prefix(`/${API_VERSION}/${api}`);

// POST /v1/authenticate
router.post('/', authenticate);

export default router;
