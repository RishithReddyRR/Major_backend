const { asyncErrorHandler } = require("../middleware/catchAsyncError");
const csv = require("csvtojson");
const Publication = require("../models/publicationModel");
const user = require("../models/userModel");
//upload publications
exports.uploadPublications = asyncErrorHandler(async (req, res) => {
  const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];
  let monthMap = new Map();
  for (let i = 0; i < months.length; i++) {
    monthMap.set(months[i], i + 1);
  }
  csv()
    .fromFile(req.file.path)
    .then((response) => {
      // console.log(response)
      response.forEach((item) => {
        item["listOfAuthors"] = item["listOfAuthors"].split(",");
        item["keywords"] = item["keywords"].split(",");
        const x = item.dateOfPublication.split("-");
        // console.log(x)
        item.date = `${x[2]}-${x[1]}-${x[0]}`;
        item["dateOfPublication"] = new Date(item.dateOfPublication).getTime();
        // console.log(item.dateOfPublication)
        if (isNaN(item.dateOfPublication)) {
          // console.log(`${item.year}--${item.month}`)
          item.dateOfPublication = 0;
        }
      });
      response.sort((a, b) => b.noOfCitations - a.noOfCitations);
      Publication.insertMany(response);
      // for(let i=0;i<response.length;i++){
      //     ({name,age,branch}=response[i])
      // }
    });
  res.status(200).send({
    msg: "success",
    success: true,
  });
});
//upload users

exports.uploadUsers = asyncErrorHandler(async (req, res) => {
  let x = [];
  csv()
    .fromFile(req.file.path)
    .then(async (response) => {
      // console.log(response)
      response.forEach( (item) => {
        item.password = "User@123";
        item.education = [
          item.phd,
          item.postgraduation,
          item.graduation,
          item.inter,
        ];
        item.email = item.email.split(",")[0];
        item.avatar = {
          url: "bhxzjbxzhjczdbbh",
          public_id: "123212321`",
        };
        if (item.email.length == 0) item.email = `${item.name}@vnrvjiet.in`;
        delete item.phd;
        delete item.postgraduation;
        delete item.graduation;
        delete item.inter;
        // if(item.email!="@vnrvjiet.in")
        // console.log(item.email)
        // await user.create(item)
        if (item.name.length != 0) {
          x = [...x, item];
          console.log(item);
        }
      });
      await user.insertMany(x);
      // for(let i=0;i<response.length;i++){
      //     ({name,age,branch}=response[i])
      // }
    });
  res.status(200).send({
    msg: "success",
    success: true,
    
  });
});
