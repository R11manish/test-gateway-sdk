import express from "express";
const serverless = require("serverless-http");
import { Request, Response } from "express";
import { Gateway } from "@gateway-dao/sdk";
const app = express();
import "dotenv/config";

const port = process.env.PORT || 3000;

const gateway = new Gateway({
  apiKey: process.env.ACCESS_KEY as string,
  token: process.env.TOKEN as string,
  url: "https://develop.protocol.mygateway.xyz/graphql",
});

app.get("/", async function (req: Request, res: Response) {
  try {
    const { PDAs } = await gateway.pda.getPDAs({
      filter: { owner: { type: "GATEWAY_ID", value: "r11manish" } },
    });
    const hello = await gateway.pda.getPDACount({
      filter: { owner: { type: "GATEWAY_ID", value: "nuno" } },
    });
    res.send({ hello, PDAs });
  } catch (error) {
    res.send({ error });
  }
});

app.get("/pda-test", function (req: Request, res: Response) {});

if (process.env.ENVIRONMENT === "production") {
  exports.handler = serverless(app);
} else {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
  });
}
