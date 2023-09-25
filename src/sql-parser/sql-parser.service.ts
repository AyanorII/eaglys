import { BadRequestException, Injectable } from "@nestjs/common";
import { AST, Insert_Replace, Parser } from "node-sql-parser";

import { isPlainObject } from "../../lib/helpers";
import { HashService } from "../hash/hash.service";
import { HashedColumn } from "./types";

@Injectable()
export class SqlParserService {
	constructor(
		private readonly hashService: HashService,
		private readonly parser: Parser
	) {}

	extractColumns(query: string): string[] {
		if (!query.trim())
			throw new BadRequestException("Please provide a SQL query.");

		try {
			const parsedColumnsList = this.parser.columnList(query);

			const columns = parsedColumnsList
				// I couldn't find a way to manipulate the AST's columns when the query type is "delete"
				.filter((column) => !column.includes("delete"))
				.map((column) => column.split("::").at(-1));

			const uniqueColumns = [...new Set(columns)];

			return uniqueColumns;
		} catch (error) {
			throw new BadRequestException("Please provide a valid SQL query.");
		}
	}

	async hashColumns(columns: string[]): Promise<HashedColumn> {
		const map = {};

		for (const column of columns) {
			const col = column === "(.*)" ? "*" : column;
			const hash = await this.hashService.hash(col);
			map[col] = hash;
		}

		return map;
	}

	async buildQueryWithHashedColumns(query: string) {
		const columns = this.extractColumns(query);
		const hashedColumns = await this.hashColumns(columns);
		const astArray = this.parser.astify(query) as AST[];
		const astWithHashedColumns = this.replaceColumnValues(
			astArray,
			hashedColumns
		);

		const hashedQuery = this.parser.sqlify(astWithHashedColumns);
		return hashedQuery;
	}

	/**
	 * Recursively replace the column values in the AST with the hashed values.
	 * @param ast
	 * @param hashedColumnsMap
	 * @returns A new AST with the hashed columns.
	 */
	replaceColumnValues(
		ast: AST | AST[],
		hashedColumnsMap: HashedColumn
	): AST | AST[] {
		if (Array.isArray(ast)) {
			return ast.map((node) =>
				this.replaceColumnValues(node, hashedColumnsMap)
			) as AST[];
		}

		if (isPlainObject(ast)) {
			// Prevent mutation of the original AST
			const astCopy = { ...ast };

			for (const [key, value] of Object.entries(astCopy)) {
				// When the AST type is "create", the "column" key is an object which contains
				// another "column" property with the column name.
				// If the "column" key is a string, then it's the actual column name.
				if (key === "column" && typeof value === "string") {
					const hashedColumn = hashedColumnsMap[value as keyof HashedColumn];
					astCopy[key] = hashedColumn;
				} else if (ast.type === "insert") {
					(astCopy as Insert_Replace).columns = ast.columns.map((column) => {
						const hashedColumn = hashedColumnsMap[column as keyof HashedColumn];
						return hashedColumn;
					});
				} else if (isPlainObject(value) || Array.isArray(value)) {
					astCopy[key] = this.replaceColumnValues(
						value as AST | AST[],
						hashedColumnsMap
					);
				} else {
					astCopy[key] = value as (typeof astCopy)[keyof AST];
				}
			}
			return astCopy;
		}

		return ast;
	}
}
