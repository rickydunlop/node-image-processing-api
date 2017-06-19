import path from 'path';
import koaBody from 'koa-body';
import serve from 'koa-static';
import Koa from 'koa';
import logger from 'koa-logger';
import mongoose from 'mongoose';
import helmet from 'koa-helmet';
import routing from './routes/';
import { port, dbConfig } from './config';

mongoose.connect(dbConfig);
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
  .use(helmet());

routing(app);

// Start the application
app.listen(port, () => console.log(`✅  The server is running at http://localhost:${port}/`));

export default app;
