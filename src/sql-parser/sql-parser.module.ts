import { Module } from "@nestjs/common";
import { HashModule } from "src/hash/hash.module";

import { SqlParserController } from "./sql-parser.controller";
import { SqlParserService } from "./sql-parser.service";

@Module({
	imports: [HashModule],
	controllers: [SqlParserController],
	providers: [SqlParserService],
})
export class SqlParserModule {}
