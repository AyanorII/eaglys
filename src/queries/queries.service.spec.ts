import { Test, TestingModule } from "@nestjs/testing";
import { Parser } from "node-sql-parser";

import { HashService } from "../hash/hash.service";
import { PrismaService } from "../prisma/prisma.service";
import { SqlParserService } from "../sql-parser/sql-parser.service";
import { QueriesService } from "./queries.service";

describe("QueriesService", () => {
	let service: QueriesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				QueriesService,
				PrismaService,
				SqlParserService,
				{
					provide: HashService,
					useValue: {
						hash: jest
							.fn()
							.mockImplementation((value: string) => `hashed_${value}`),
					},
				},
				{
					provide: Parser,
					useClass: Parser,
				},
			],
		}).compile();

		service = module.get<QueriesService>(QueriesService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("#create", () => {
		it("should create a query record", async () => {
			const query = "SELECT id, name FROM users WHERE id = 1";
			const newQuery = await service.create({ query });

			expect(newQuery).toHaveProperty("id");
			expect(newQuery.original).toEqual(query);
			expect(newQuery.hashed).toEqual(
				"SELECT `hashed_id`, `hashed_name` FROM `users` WHERE `hashed_id` = 1"
			);
			expect(newQuery.columns).toMatchObject({
				id: "hashed_id",
				name: "hashed_name",
			});
		});
	});
});
