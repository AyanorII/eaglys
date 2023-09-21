import { BadRequestException, Injectable } from "@nestjs/common";
import { Parser } from "node-sql-parser";

import { HashService } from "../hash/hash.service";

@Injectable()
export class SqlParserService {
	private parser: Parser;

	constructor(private readonly hashService: HashService) {
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

	async hashColumns(columns: string[]) {
		const map = {};

		for (const column of columns) {
			const hash = await this.hashService.hash(column);
			map[column] = hash;
		}

		return map;
	}
}
