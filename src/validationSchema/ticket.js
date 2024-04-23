import Joi from "joi";

const ticketValidationSchema = Joi.object({
  title: Joi.string().required(),
  ticket_price: Joi.string().required(),
  from_location: Joi.string().required(),
  to_location: Joi.string().required(),
  to_location_photo_url: Joi.string().required(),
});

export default ticketValidationSchema;
