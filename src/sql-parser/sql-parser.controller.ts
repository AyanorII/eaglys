import { Body, Controller, Post } from "@nestjs/common";

import { CreateSqlParserDto } from "./dto/create-sql-parser.dto";
import { SqlParserService } from "./sql-parser.service";

@Controller("sql-parser")
export class SqlParserController {
	constructor(private readonly sqlParserService: SqlParserService) {}

	@Post()
	extractColumns(@Body() createSqlParserDto: CreateSqlParserDto) {
		const columns = this.sqlParserService.extractColumns(
			createSqlParserDto.query
		);
		return this.sqlParserService.hashColumns(columns);
	}
}