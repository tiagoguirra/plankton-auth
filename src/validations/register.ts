import Joi from 'joi'

const schema = Joi.object({
  email: Joi.string().required(),
  name: Joi.string().required(),
  password: Joi.string().min(4).required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .options({ messages: { 'any.only': '{{#label}} does not match' } })
})

export default schema
