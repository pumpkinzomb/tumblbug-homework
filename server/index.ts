import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
  console.error(err.stack);
  res.status(500).send("Server is something wrong!");
});

const address = require("./routes/address");
app.use("/api", address);
app.use(express.static(__dirname));
app.listen(port, () => console.log(`Listening on port ${port}`));
