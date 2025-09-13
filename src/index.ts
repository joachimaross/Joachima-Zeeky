import "module-alias/register";
import "reflect-metadata";
import * as functions from "firebase-functions";
import { container } from "tsyringe";
import { ZeekyApplication } from "@/ZeekyApplication";

// Initialize the application via DI container
const app = container.resolve(ZeekyApplication);

// Start the application once
app.start().catch((error) => {
  console.error("Failed to start the application:", error);
});

// Expose the Express app as a Cloud Function
export const webApi = functions.https.onRequest(app.getExpressApp());
