import Router from 'koa-router';
import { baseApi } from '../config';
import jwt from '../middlewares/jwt';
import ImageController from '../controllers/images';

const router = new Router();

router.prefix(`/${baseApi}`);

// GET /v1/images
router.get('/images', ImageController.find);

// GET /v1/images/id
// This route is protected, call POST /v1/authenticate to get the token
router.get('/images/:id', ImageController.findById);

// GET /v1/resize/id/width/height
router.get('/resize/:id/:width/:height', ImageController.resize);

// GET /v1/resize/id/angle
router.get('/rotate/:id/:angle', ImageController.rotate);

// POST /v1/images
// This route is protected, call POST /v1/authenticate to get the token
router.post('/upload', jwt, ImageController.add);

// DELETE /v1/images/id
// This route is protected, call POST /v1/authenticate to get the token
router.delete('/images/:id', jwt, ImageController.delete);

export default router;
