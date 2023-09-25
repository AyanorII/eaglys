import { Module } from "@nestjs/common";
import { Parser } from "node-sql-parser";
import { HashModule } from "src/hash/hash.module";

import { SqlParserService } from "./sql-parser.service";

@Module({
	imports: [HashModule],
	providers: [
		SqlParserService,
		{
			provide: Parser,
			useClass: Parser,
		},
	],
	exports: [SqlParserService],
})
export class SqlParserModule {}
