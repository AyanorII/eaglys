import * as Joi from "@hapi/joi";

export const configValidationSchema = Joi.object({
	DATABASE_URL: Joi.string().required(),
	CORS_ORIGIN: Joi.string().required(),
	PORT: Joi.number().default(8000),
});
