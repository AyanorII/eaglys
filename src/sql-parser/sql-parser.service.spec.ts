import { Test, TestingModule } from "@nestjs/testing";

import { SqlParserService } from "./sql-parser.service";

describe("SqlParserService", () => {
	let service: SqlParserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [SqlParserService],
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
			const selectQuery = "SELECT a, b FROM test WHERE a = 5;";
			const deleteQuery = "DELETE FROM test WHERE a = 5;";
			const query = `${selectQuery} ${deleteQuery}`;

			const columns = service.extractColumns(query);

			expect(Array.isArray(columns)).toBe(true);
			expect(columns.length).toBe(3);
			expect(columns[0]).toBe("a");
			expect(columns[1]).toBe("b");
			expect(columns[2]).toBe("(.*)");
		});
	});
});
