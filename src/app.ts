import express from "express";

import tasks from './routes/tasks.router';
import { notFoundHandler } from "./middleware/notFound";
import { finalErrorHandler } from "./middleware/finalErrorHandler";

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({message: "Todo API is running"})
});

app.use('/tasks', tasks);

app.use(notFoundHandler);
app.use(finalErrorHandler);

export default app;