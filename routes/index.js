import images from './images';
import authenticate from './authenticate';

const routes = [images, authenticate];

export default function (app) {
  routes.forEach((route) => {
    app
      .use(route.routes())
      .use(route.allowedMethods({
        throw: true,
      }));
  });
}
