import { Test, TestingModule } from "@nestjs/testing";
import { Parser } from "node-sql-parser";

import { HashService } from "../hash/hash.service";
import { PrismaService } from "../prisma/prisma.service";
import { SqlParserService } from "../sql-parser/sql-parser.service";
import { QueriesController } from "./queries.controller";
import { QueriesService } from "./queries.service";

describe("QueriesController", () => {
	let controller: QueriesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [QueriesController],
			providers: [
				QueriesService,
				PrismaService,
				SqlParserService,
				HashService,
				{
					provide: Parser,
					useClass: Parser,
				},
			],
		}).compile();

		controller = module.get<QueriesController>(QueriesController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
