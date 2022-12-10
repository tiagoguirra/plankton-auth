import Joi from 'joi'

const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

export default schema
