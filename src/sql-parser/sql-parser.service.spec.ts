import { Test, TestingModule } from "@nestjs/testing";
import { Parser } from "node-sql-parser";

import { HashService } from "../hash/hash.service";
import { SqlParserService } from "./sql-parser.service";

describe("SqlParserService", () => {
	let service: SqlParserService;
	let mockHashService: Partial<HashService>;

	beforeEach(async () => {
		mockHashService = {
			hash: jest.fn().mockImplementation((value: string) => `hashed_${value}`),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SqlParserService,
				{ provide: HashService, useValue: mockHashService },
			],
		}).compile();

		service = module.get<SqlParserService>(SqlParserService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("#extractColumns", () => {
		it("should extract columns from a simple query", () => {
			const query = "SELECT a, b FROM test WHERE a = 5;";
			const columns = service.extractColumns(query);

			expect(Array.isArray(columns)).toBe(true);
			expect(columns[0]).toBe("a");
			expect(columns[1]).toBe("b");
		});

		it("should extract columns from a complex query", () => {
			const query = `
      SELECT a.id, a.name, SUM(b.amount) as TotalAmount, COUNT(c.id) as CountOfOrders
      FROM users a
      LEFT JOIN transactions b ON a.id = b.user_id
      INNER JOIN orders c ON a.id = c.user_id
      WHERE a.active = 1 AND (b.date BETWEEN '2021-01-01' AND '2021-12-31' OR b.date IS NULL)
      GROUP BY a.id, a.name
      HAVING SUM(b.amount) >= 1000 OR COUNT(c.id) > 10
      ORDER BY TotalAmount DESC, CountOfOrders ASC
      LIMIT 10;
      `;
			const queryColumns = [
				"id",
				"name",
				"amount",
				"user_id",
				"active",
				"date",
				"TotalAmount",
				"CountOfOrders",
			];
			const extractedColumns = service.extractColumns(query);

			expect(extractedColumns).toEqual(queryColumns);
		});
	});

	describe("#hashColumns", () => {
		it("should hash a list of columns", async () => {
			const columns = ["id", "name", "birthday", "(.*)"];
			const columnsMap = await service.hashColumns(columns);

			const expected = {
				id: "hashed_id",
				name: "hashed_name",
				birthday: "hashed_birthday",
				"*": "hashed_*",
			};

			expect(columnsMap).toMatchObject(expected);
		});
	});

	describe("#replaceColumnValues", () => {
		it("should replace the column values in the AST with the hashed values", async () => {
			const parser = new Parser();

			const queries = [
				"SELECT id, name FROM users WHERE id = 5;",
				"UPDATE users SET name = 'John Doe' WHERE id = 5;",
				"DELETE FROM users WHERE id = 5;",
				"INSERT INTO users (name) VALUES ('John Doe');",
				"ALTER TABLE users ADD COLUMN phone VARCHAR(15);",
				"CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL UNIQUE);",
				"ALTER TABLE users ADD COLUMN phone VARCHAR(15);",
				"DROP TABLE users;",
			];

			for (const query of queries) {
				const ast = parser.astify(query);
				const columns = service.extractColumns(query);
				const hashedColumnsMap = await service.hashColumns(columns);

				const newAst = service.replaceColumnValues(ast, hashedColumnsMap);
				const queryWithHashedColumns = parser.sqlify(newAst);
				const hashedColumnsInQuery = service.extractColumns(
					queryWithHashedColumns
				);

				expect(hashedColumnsInQuery).toEqual(Object.values(hashedColumnsMap));
			}
		});
	});

	describe("#buildQueryWithHashedColumns", () => {
		it("should build a query with hashed columns", async () => {
			const query = "SELECT id, name FROM users WHERE id = 5;";
			const hashedQuery = await service.buildQueryWithHashedColumns(query);

			expect(hashedQuery).toBe(
				"SELECT `hashed_id`, `hashed_name` FROM `users` WHERE `hashed_id` = 5"
			);
		});
	});
});
