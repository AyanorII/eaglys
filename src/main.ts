import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.enableCors({
		origin: configService.get("CORS_ORIGIN"),
	});
	app.useGlobalPipes(new ValidationPipe());

	const swagger = new DocumentBuilder()
		.setTitle("Eaglys test API")
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, swagger);
	SwaggerModule.setup("api", app, document);

	await app.listen(configService.get("PORT"));
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
