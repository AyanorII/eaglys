import { Test, TestingModule } from "@nestjs/testing";

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
			const columns = ["id", "name", "birthday"];
			const columnsMap = await service.hashColumns(columns);

			columns.forEach((column) => {
				expect(columnsMap).toHaveProperty(column);
				expect(columnsMap[column]).toBe(`hashed_${column}`);
			});
		});
	});
});
