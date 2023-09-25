import { Body, Controller, Get, Post } from "@nestjs/common";

import { CreateQueryDto } from "./dto/create-query.dto";
import { QueriesService } from "./queries.service";

@Controller("queries")
export class QueriesController {
	constructor(private readonly queriesService: QueriesService) {}

	@Post()
	create(@Body() createQueryDto: CreateQueryDto) {
		return this.queriesService.create(createQueryDto);
	}

	@Get()
	findAll() {
		return this.queriesService.findAll();
	}
}
