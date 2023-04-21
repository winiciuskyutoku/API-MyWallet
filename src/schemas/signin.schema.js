import joi from 'joi'

export const signinSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
})