import { BadRequestException, Injectable } from "@nestjs/common";
import { Parser } from "node-sql-parser";

@Injectable()
export class SqlParserService {
	private parser: Parser;

	constructor() {
		this.parser = new Parser();
	}

	extractColumns(query: string): string[] {
		if (!query.trim())
			throw new BadRequestException("Please provide a SQL query.");

		try {
			const parsedColumnsList = this.parser.columnList(query);

			const columns = parsedColumnsList.map((column) =>
				column.split("::").at(-1)
			);

			const uniqueColumns = [...new Set(columns)];

			return uniqueColumns;
		} catch (error) {
			throw new BadRequestException("Please provide a valid SQL query.");
		}
	}
}
