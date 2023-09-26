import { Injectable } from "@nestjs/common";
import { Prisma, Query } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { SqlParserService } from "../sql-parser/sql-parser.service";
import { CreateQueryDto } from "./dto/create-query.dto";

@Injectable()
export class QueriesService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly sqlParserService: SqlParserService
	) {}

	async create(createQueryDto: CreateQueryDto): Promise<Query> {
		const { query } = createQueryDto;

		const columns = this.sqlParserService.extractColumns(query);
		const hashedColumns = await this.sqlParserService.hashColumns(columns);

		const ast = this.sqlParserService.parse(query);
		const astWithHashedColumns = this.sqlParserService.replaceColumnValues(
			ast,
			hashedColumns
		);

		const hashedQuery = this.sqlParserService.sqlify(astWithHashedColumns);
		const newQuery = await this.prisma.query.create({
			data: {
				original: query,
				hashed: hashedQuery,
				columns: hashedColumns,
			},
		});

		return newQuery;
	}

	async findAll(options?: Prisma.QueryFindManyArgs): Promise<Query[]> {
		return this.prisma.query.findMany(options);
	}
}
