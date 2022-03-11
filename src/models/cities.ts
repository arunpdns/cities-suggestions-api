import mongoose from'mongoose';
const Schema = mongoose.Schema;

const citiesSchema = new Schema({
  
    name:{
        type:String
    },
    country:{
        type:String
    },
    state:{
        type:String
    },
    location:{
        type:{
            type:String,
            enum:['Point']
        },
        coordinates:{
            type: [Number]
        }
        
    }
  },
  {
    timestamps: true,
  });



citiesSchema.index({ location: '2dsphere' });
const cities = mongoose.model('cities', citiesSchema);

export default cities;
