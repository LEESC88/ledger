import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

/**
 * Bootstrap function
 * The entry point of the NestJS application.
 * Configures global pipes, OpenAPI (Swagger) documentation, and starts the HTTP server.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Global ValidationPipe
  // Enforces DTO validation rules across all incoming requests.
  // - whitelist: true -> Strips out any properties not explicitly defined in the DTO
  // - forbidNonWhitelisted: true -> Rejects requests with HTTP 400 if extra unexpected properties are sent
  // - transform: true -> Automatically deserializes plain request body objects into typed DTO instances
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 2. Swagger / OpenAPI Configuration
  // Configures the interactive API documentation available at /api-docs.
  const config = new DocumentBuilder()
    .setTitle('Simple Ledger API')
    .setDescription(
      'Personal expense and income Ledger RESTful API documentation',
    )
    .setVersion('1.0')
    .addTag('Records', 'Transaction management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // 3. Start HTTP Server
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`[*] Application is running on: http://localhost:${port}`);
  console.log(
    `[*] Swagger API Docs available at: http://localhost:${port}/api-docs`,
  );
}

await bootstrap();
