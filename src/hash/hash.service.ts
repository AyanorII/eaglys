import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class HashService {
	async hash(string: string, rounds = 10): Promise<string> {
		return bcrypt.hash(string, rounds);
	}
}
