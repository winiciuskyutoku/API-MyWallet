import joi from "joi"

export const balanceSchema = joi.object({
    value: joi.number().required().positive(),
    description: joi.string().required()
})