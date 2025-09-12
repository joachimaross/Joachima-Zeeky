import 'reflect-metadata';
import { container } from 'tsyringe';
import { ZeekyApplication } from '@/ZeekyApplication';
import { Logger } from '@/utils/Logger';

// Main entry point
async function bootstrap() {
  const app = container.resolve(ZeekyApplication);
  try {
    await app.start();
  } catch (error) {
    const logger = container.resolve(Logger);
    logger.error('Unhandled exception during bootstrap:', error);
    process.exit(1);
  }
}

bootstrap();
