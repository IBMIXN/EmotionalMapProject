import mongoose from 'mongoose'
let toJsonPlugin = function (schema) {
    let transform;
    if (schema.options.toJSON && schema.options.toJSON.transform) {
      transform = schema.options.toJSON.transform;
    }
    schema.options.toJSON = {
      transform(doc, ret) {
  
        // Delete version and remove ID since we don't need them
        delete ret.__v;
        delete ret._id;
  
        // Call custom transform if present
        if (transform) {
          transform(doc, ret);
        }
      }
    };
  };
  
mongoose.plugin(toJsonPlugin)