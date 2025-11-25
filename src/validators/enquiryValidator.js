const Joi = require('joi');

exports.createEnquirySchema = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(20).required(),
  current_location: Joi.string().max(100).allow(null, ''),
  module: Joi.string().max(100).allow(null, ''),
  timing: Joi.string().max(50).allow(null, ''),
  trainingTime: Joi.string().max(50).allow(null, ''),
  startTime: Joi.string().max(50).allow(null, ''),
  
  profession: Joi.string().max(100).allow(null, ''),   
  
  qualification: Joi.string().max(100).allow(null, ''),
  experience: Joi.string().max(50).allow(null, ''),
  referral: Joi.string().max(100).allow(null, ''),
  consent: Joi.boolean().required()
});
