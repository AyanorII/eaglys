import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { SqlParserModule } from "src/sql-parser/sql-parser.module";

import { QueriesController } from "./queries.controller";
import { QueriesService } from "./queries.service";

@Module({
	imports: [SqlParserModule, PrismaModule],
	controllers: [QueriesController],
	providers: [QueriesService],
})
export class QueriesModule {}
