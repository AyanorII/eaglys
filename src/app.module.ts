import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HashModule } from "./hash/hash.module";
import { PrismaModule } from "./prisma/prisma.module";
import { QueriesModule } from "./queries/queries.module";
import { SqlParserModule } from "./sql-parser/sql-parser.module";

@Module({
	imports: [SqlParserModule, HashModule, PrismaModule, QueriesModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
