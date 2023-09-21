import { Test, TestingModule } from "@nestjs/testing";

import { HashService } from "./hash.service";

describe("HashService", () => {
	let service: HashService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [HashService],
		}).compile();

		service = module.get<HashService>(HashService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("#hash", () => {
		it("should hash a string", async () => {
			const input = "test";
			const hash = await service.hash(input);

			expect(hash).not.toBe(input);
		});
	});
});
