import { IsString } from "class-validator";

export class CreateQueryDto {
	@IsString()
	query: string;
}
