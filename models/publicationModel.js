const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const publicationSchema = new mongoose.Schema({
  nameOfAuthor: {
    type: String,
    // ref: "user",
    // required: [true, "please enter name of author"],
  },
  listOfAuthors: [
    {
      // type: mongoose.Schema.ObjectId, ref: "user"
      type: String,
    },
  ],
  studentPublication: {
    type: String,
    default: "no",
  },
  title: {
    type: String,
    unique:true
  },
  typeOfPublication: {
    type: String,
    lowercase:true
  },
  nameOfPublicationPlatform: {
    type: String,
    // required: [true, "enter journal name"],
  },
  scopus: { type: String, default: "no" },
  wos: { type: String, default: "no" },
  publicationDetails: {
    type: String,
  },
  year: Number,
  month: {type:String,uppercase:true},
  academicYear: String,
  url: {
    type: String,
    // required: [true, "url of your publication is required"]
  },
  doi: String,
  identificationNumber: String,
  //   journalHomePage:String,
  indexing: String,
  noOfCitations: {
    type: Number,
    default: 0,
  },
  abstract: {
    type: String,
    // required:[true,"enter abstract"]
  },
  keywords: [String],
  specialization: String,
  status: {
    type: String,
    // enum:["active","inactive"]
  },
  //   clarivateImpactFactor:{
  //     type:Number,
  //     default:0
  //   },
  specialization: String,
  comments: [String],
  link: String,
  dateOfPublication:Number,
  date:String,
  department:String
});

// publicationSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Publication", publicationSchema);
