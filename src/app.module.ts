import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SqlParserModule } from "./sql-parser/sql-parser.module";

@Module({
	imports: [SqlParserModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
