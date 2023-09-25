import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configValidationSchema } from "config/configuration.schema";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HashModule } from "./hash/hash.module";
import { PrismaModule } from "./prisma/prisma.module";
import { QueriesModule } from "./queries/queries.module";
import { SqlParserModule } from "./sql-parser/sql-parser.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env",
			validationSchema: configValidationSchema,
		}),
		SqlParserModule,
		HashModule,
		PrismaModule,
		QueriesModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
