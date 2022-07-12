import express, {json} from 'express';
import cors from 'cors';
import chalk from 'chalk';
import 'express-async-errors';
import router from './routers/index.js';
import handleErrorsMiddleware from './middlewares/handleErrorsMiddleware.js';

const server = express();
server.use(json());
server.use(cors());
server.use(router);
server.use(handleErrorsMiddleware);


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(chalk.bold.green(`Listening on ${PORT}`));
})