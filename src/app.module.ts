import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HashModule } from "./hash/hash.module";
import { SqlParserModule } from "./sql-parser/sql-parser.module";

@Module({
	imports: [SqlParserModule, HashModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
