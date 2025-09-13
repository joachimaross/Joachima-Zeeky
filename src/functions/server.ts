import serverless from "serverless-http";
import { ZeekyApplication } from "../ZeekyApplication";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { Application } from "express";

let expressApp: Application;

async function bootstrap(): Promise<Application> {
  if (!expressApp) {
    const app = new ZeekyApplication();
    await app.start({ listen: false });
    expressApp = app.getExpressApp();
  }
  return expressApp;
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  const app = await bootstrap();
  return serverless(app)(event, context);
};
