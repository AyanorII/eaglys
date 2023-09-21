import { IsString } from "class-validator";

export class CreateSqlParserDto {
	@IsString()
	query: string;
}
