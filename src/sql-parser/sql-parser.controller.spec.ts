import { Test, TestingModule } from "@nestjs/testing";

import { SqlParserController } from "./sql-parser.controller";
import { SqlParserService } from "./sql-parser.service";

describe("SqlParserController", () => {
	let controller: SqlParserController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SqlParserController],
			providers: [SqlParserService],
		}).compile();

		controller = module.get<SqlParserController>(SqlParserController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
