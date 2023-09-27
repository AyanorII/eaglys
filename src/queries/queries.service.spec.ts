import { Test, TestingModule } from "@nestjs/testing";
import { Query } from "@prisma/client";
import { Parser } from "node-sql-parser";

import { HashService } from "../hash/hash.service";
import { PrismaService } from "../prisma/prisma.service";
import { SqlParserService } from "../sql-parser/sql-parser.service";
import { QueriesService } from "./queries.service";

describe("QueriesService", () => {
	let service: QueriesService;
	let queries: Query[];

	beforeEach(async () => {
		queries = [
			{
				id: 1,
				original: "SELECT id, name FROM users WHERE id = 1",
				hashed:
					"SELECT `hashed_id`, `hashed_name` FROM `users` WHERE `hashed_id` = 1",
				columns: {
					id: "hashed_id",
					name: "hashed_name",
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: 2,
				original: "UPDATE users SET name = 'John Doe' WHERE id = 5;",
				hashed:
					"UPDATE users SET `hashed_name` = 'John Doe' WHERE `hashed_id` = 5;",
				columns: {
					id: "hashed_id",
					name: "hashed_name",
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		const prismaMock = {
			query: {
				create: jest.fn().mockResolvedValue(queries[0]),
				findMany: jest.fn().mockResolvedValue(queries),
			},
		};

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
				{
					provide: PrismaService,
					useValue: prismaMock,
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

			expect(newQuery).toMatchObject(queries[0]);
		});
	});

	describe("#findAll", () => {
		it("should return all queries", async () => {
			const allQueries = await service.findAll();

			expect(allQueries).toEqual(queries);
		});
	});
});
