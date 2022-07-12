import joi from 'joi';

const activateCardSchema = joi.object({
  CVC: joi.string()
  .required(),

  password: joi.string()
  .required()
});

export default activateCardSchema;