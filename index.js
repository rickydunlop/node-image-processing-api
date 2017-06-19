import app from './server';
import { port } from './config';

app.listen(port, () => console.log(`✅  The server is running at http://localhost:${port}/`));
