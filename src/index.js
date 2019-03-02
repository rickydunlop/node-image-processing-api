import path from 'path';
import koaBody from 'koa-body';
import serve from 'koa-static';
import Koa from 'koa';
import logger from 'koa-logger';
import mongoose from 'mongoose';
import helmet from 'koa-helmet';
import { middleware as paginationMiddleware } from 'koa-ctx-paginate';
import routing from './routes';
import { PORT, DB_URL } from './config';

mongoose.set('useCreateIndex', true);
mongoose.connect(DB_URL, { useNewUrlParser: true });
mongoose.connection.on('error', console.error);

const app = new Koa();

app
  .use(logger())
  .use(serve(path.join(__dirname, 'public')))
  .use(koaBody({
    multipart: true,
    formLimit: '5mb',
    formidable: {
      keepExtensions: true,
      uploadDir: path.join(__dirname, 'public/uploads'),
    },
  }))
  .use(paginationMiddleware())
  .use(helmet());

routing(app);

if (!module.parent) {
  app.listen(PORT, () => console.log(`✅  The server is running at http://localhost:${PORT}/`));
}

export default app;
