import { Module } from "@nestjs/common";
import { Parser } from "node-sql-parser";
import { HashModule } from "src/hash/hash.module";

import { SqlParserController } from "./sql-parser.controller";
import { SqlParserService } from "./sql-parser.service";

@Module({
	imports: [HashModule],
	controllers: [SqlParserController],
	providers: [
		SqlParserService,
		{
			provide: Parser,
			useClass: Parser,
		},
	],
})
export class SqlParserModule {}
