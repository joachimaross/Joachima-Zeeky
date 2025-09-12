import express from "express";
import { container } from "tsyringe";
import { Logger } from "@/utils";
import { Core } from "@/core/Core";
import path from "path";

export class WebServer {
  private app: express.Application;
  private logger: Logger;
  private core: Core;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, "..", "web", "public")));
    this.logger = container.resolve(Logger);
    this.core = container.resolve(Core);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.post("/api/command", async (req, res) => {
      const { command } = req.body;
      if (typeof command !== "string") {
        return res.status(400).send({ error: "Invalid command" });
      }
      try {
        const response = await this.core.processCommand(command);
        res.send(response);
      } catch (error: unknown) {
        this.logger.error(`Error processing command: ${command}`, error);
        const message =
          error instanceof Error
            ? error.message
            : "An unknown error has occurred.";
        res.status(500).send({ error: message });
      }
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      this.logger.info(`Web server started on http://localhost:${port}`);
    });
  }
}
