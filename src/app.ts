import config from "config";
import dotenv from "dotenv";
import express from "express";
import responseTime from "response-time";
import deserializeUser from "./middleware/deserializeUser";
import routes from "./routes";
import connect from "./utils/connect";
import logger from "./utils/logger";
import { restResponseTimeHistogram, startMetricsServer } from "./utils/metrics";
const port = config.get<number>("port");
dotenv.config();

const app = express();

app.use(express.json());
app.use(deserializeUser);

app.use(
  responseTime((req: Request, res: Response, time: number) => {
    if (req?.route?.path) {
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time * 1000
      );
    }
  })
);

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);
  await connect();
  startMetricsServer();
  routes(app);
});
