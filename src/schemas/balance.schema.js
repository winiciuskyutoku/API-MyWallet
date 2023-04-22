import joi from "joi"

export const balanceSchema = joi.object({
    value: joi.number().positive().required(),
    description: joi.string().required()
})