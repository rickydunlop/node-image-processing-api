import Router from 'koa-router';
import { API_VERSION } from '../config';
import jwt from '../middlewares/jwt';
import ImageController from '../controllers/images';

const router = new Router();

router.prefix(`/${API_VERSION}`);

// GET /v1/images
router.get('/images', ImageController.find);

// GET /v1/images/id
// This route is protected, call POST /v1/authenticate to get the token
router.get('/images/:id', ImageController.findById);

// GET /v1/resize/id?width=<width>&height=<height>
router.get('/resize/:id', ImageController.resize);

// GET /v1/resize/id?angle=<angle>
router.get('/rotate/:id', ImageController.rotate);

// POST /v1/images
// This route is protected, call POST /v1/authenticate to get the token
router.post('/upload', jwt, ImageController.add);

// DELETE /v1/images/id
// This route is protected, call POST /v1/authenticate to get the token
router.delete('/images/:id', jwt, ImageController.delete);

export default router;
