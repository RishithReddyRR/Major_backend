const { asyncErrorHandler } = require("../middleware/catchAsyncError");
// const journal = require("../models/journalModel");
// const conference = require("../models/conferenceModel");
// const bookChapter = require("../models/bookChapterModel");
const publication = require("../models/publicationModel");
const ApiFeatures = require("../utils/apiFeatures");
const { utils, writeFile } = require("xlsx");
const axios = require("axios");

//user publication details

exports.getPublicationsOfUser = asyncErrorHandler(async (req, res, next) => {
  const { name } = req.body;
  const resultPerPage = 10;

  const currentPage = Number(req.query.page) || 1;

  const skip = resultPerPage * (currentPage - 1);
  let publications = await publication.find({ nameOfAuthor: name });
  // console.log(publications)
  let publicationsCount = publications.length;
  let tPub = [...publications];
  publications = await publication
    .find({ nameOfAuthor: name })
    .limit(resultPerPage)
    .skip(skip);
  let tempP;
  let countArray = [];
  tempP = await publication.find({
    nameOfAuthor: name,
    typeOfPublication: {
      $regex: "journal",
      $options: "i",
    },
  });
  countArray.push(tempP.length);
  tempP = await publication.find({
    nameOfAuthor: name,
    typeOfPublication: {
      $regex: "book chapter",
      $options: "i",
    },
  });
  countArray.push(tempP.length);
  tempP = await publication.find({
    nameOfAuthor: name,
    typeOfPublication: {
      $regex: "conference",
      $options: "i",
    },
  });
  countArray.push(tempP.length);
  tempP = await publication.find({
    nameOfAuthor: name,
    typeOfPublication: {
      $regex: "patent",
      $options: "i",
    },
  });
  countArray.push(tempP.length);
  tempP = await publication.find({
    nameOfAuthor: name,
    typeOfPublication: {
      $regex: "copyright",
      $options: "i",
    },
  });
  countArray.push(tempP.length);

  //year wise count
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const yearCount = [];
  for (let i = 0; i < 15; i++) {
    const x = await publication.find({
      nameOfAuthor: name,
      year: currentYear - i,
    });
    let ob = {
      year: currentYear - i,
      count: x.length,
    };
    yearCount.unshift(ob);
  }
  //year wise count
  const yearCitationsCount = [];
  for (let i = 0; i < 15; i++) {
    const x = await publication.find({
      nameOfAuthor: name,
      year: currentYear - i,
    });
    let c = 0;
    x.forEach((ele) => (c += ele.noOfCitations));
    let ob = {
      year: currentYear - i,
      count: c,
    };
    yearCitationsCount.unshift(ob);
  }
  // console.log(publications)
  res.status(200).json({
    success: "true",
    publications,
    publicationsCount,
    resultPerPage,
    tPub,
    countArray,
    yearCount,
    yearCitationsCount,
  });
});

//get publications

// exports.getPublications = asyncErrorHandler(async (req, res, next) => {
//   const resultPerPage = req.query.ppp;
//   const publicationsCount = await publication.countDocuments();
//   const apiFeatures = new ApiFeatures(publication.find(), req.query)
//     .search()
//     .filter();
//   let pub = await apiFeatures.query;
//   let filteredPublicationsCount = pub.length;
//   // const pubJ=await apiFeatures.queryJ
//   // const pubC=await apiFeatures.queryC
//   // const pub=[...pubB,...pubJ,...pubC]
//   const tPub = [...pub];
//   apiFeatures.pagination(resultPerPage);
//   pub = await apiFeatures.query.clone();
//   res.status(200).json({
//     success: true,
//     publications: pub,
//     publicationsCount,
//     resultPerPage,
//     filteredPublicationsCount,
//     tPub,
//   });
// });

//get publications for home page
exports.getPublicationHome = asyncErrorHandler(async (req, res, next) => {
  const publications = await publication.find({}).limit(8);
  let pubs = await publication.find({});
  const map1 = new Map();
  for (let i = 0; i < pubs.length; i++) {
    if (map1.has(pubs[i].year)) {
      map1.set(pubs[i].year, map1.get(pubs[i].year) + 1);
    } else {
      map1.set(pubs[i].year, 1);
    }
  }
  const sortedMap = new Map(
    Array.from(map1.entries()).sort((a, b) => a[0] - b[0])
  );
  console.log(map1);
  console.log(sortedMap);
  const arrayOfObjects = Array.from(sortedMap).map(
    ([year, noOfPublications]) => ({
      year: `${year}-01-01`,
      noOfPublications,
    })
  );

  console.log(arrayOfObjects);
  const ws = utils.json_to_sheet(arrayOfObjects);
  /* create workbook and append worksheet */
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "publications");
  /* export to XLSX */
  writeFile(wb, "IT.xlsx");
  res.status(200).json({
    success: true,
    publications,
  });
});

//get publication details

exports.getPublicationDetails = asyncErrorHandler(async (req, res, next) => {
  const publicationDetails = await publication.findById(req.params.id);
  res.status(200).json({
    success: true,
    publicationDetails,
  });
});

//get publications counts for @admin

exports.getPublicationsAdmin = asyncErrorHandler(async (req, res, next) => {
  const pub = await publication.find({});
  const publicationsCount = pub.length;
  let countArray = [];
  tempP = await publication.find({
    typeOfPublication: {
      $regex: "journal",
      $options: "i",
    },
  });
  countArray.push(tempP.length);
  tempP = await publication.find({
    $or: [
      {
        typeOfPublication: {
          $regex: "book chapter",
          $options: "i",
        },
      },
      {
        typeOfPublication: {
          $regex: "bookchapter",
          $options: "i",
        },
      },
    ],
  });
  countArray.push(tempP.length);
  tempP = await publication.find({
    typeOfPublication: {
      $regex: "conference",
      $options: "i",
    },
  });
  countArray.push(tempP.length);
  tempP = await publication.find({
    typeOfPublication: {
      $regex: "patent",
      $options: "i",
    },
  });
  countArray.push(tempP.length);
  tempP = await publication.find({
    typeOfPublication: {
      $regex: "copyright",
      $options: "i",
    },
  });
  countArray.push(tempP.length);
  //year wise count
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const yearCount = [];
  for (let i = 0; i < 15; i++) {
    const x = await publication.find({ year: currentYear - i });
    let ob = {
      year: currentYear - i,
      count: x.length,
    };
    yearCount.unshift(ob);
  }
  const yearCountEach = [];
  for (let i = 0; i < 10; i++) {
    const cJ = await publication.find({
      $and: [
        { year: currentYear - i },
        {
          typeOfPublication: {
            $regex: "journal",
            $options: "i",
          },
        },
      ],
    });
    const cB = await publication.find({
      $and: [
        { year: currentYear - i },
        {
          typeOfPublication: {
            $regex: "Book chapter",
            $options: "i",
          },
        },
      ],
    });
    const cC = await publication.find({
      $and: [
        { year: currentYear - i },
        {
          typeOfPublication: {
            $regex: "conference",
            $options: "i",
          },
        },
      ],
    });
    const cP = await publication.find({
      $and: [
        { year: currentYear - i },
        {
          typeOfPublication: {
            $regex: "patent",
            $options: "i",
          },
        },
      ],
    });
    const cCR = await publication.find({
      $and: [
        { year: currentYear - i },
        {
          typeOfPublication: {
            $regex: "copyright",
            $options: "i",
          },
        },
      ],
    });
    let ob = {
      year: currentYear - i,
      countJ: cJ.length,
      countB: cB.length,
      countC: cC.length,
      countP: cP.length,
      countCR: cCR.length,
    };
    yearCountEach.unshift(ob);
  }
  res.status(200).json({
    success: true,
    // publications: pub,
    publicationsCount,
    countArray,
    yearCount,
    yearCountEach,
  });
});
//get publications counts for @admin

exports.getPublicationsHome = asyncErrorHandler(async (req, res, next) => {
  const pub = await publication.find({});
  const publicationsCount = pub.length;
  let countArray = [];
  tempP = await publication.find({
    typeOfPublication: {
      $regex: "journal",
      $options: "i",
    },
  });
  countArray.push(tempP.length);
  tempP = await publication.find({
    $or: [
      {
        typeOfPublication: {
          $regex: "book chapter",
          $options: "i",
        },
      },
      {
        typeOfPublication: {
          $regex: "bookchapter",
          $options: "i",
        },
      },
    ],
  });
  countArray.push(tempP.length);
  tempP = await publication.find({
    typeOfPublication: {
      $regex: "conference",
      $options: "i",
    },
  });
  countArray.push(tempP.length);
  tempP = await publication.find({
    typeOfPublication: {
      $regex: "patent",
      $options: "i",
    },
  });
  countArray.push(tempP.length);
  tempP = await publication.find({
    typeOfPublication: {
      $regex: "copyright",
      $options: "i",
    },
  });
  countArray.push(tempP.length);
  //year wise count
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const yearCount = [];
  for (let i = 0; i < 15; i++) {
    const x = await publication.find({ year: currentYear - i });
    let ob = {
      year: currentYear - i,
      count: x.length,
    };
    yearCount.unshift(ob);
  }
  const yearCountEach = [];
  for (let i = 0; i < 10; i++) {
    const cJ = await publication.find({
      $and: [
        { year: currentYear - i },
        {
          typeOfPublication: {
            $regex: "journal",
            $options: "i",
          },
        },
      ],
    });
    const cB = await publication.find({
      $and: [
        { year: currentYear - i },
        {
          typeOfPublication: {
            $regex: "Book chapter",
            $options: "i",
          },
        },
      ],
    });
    const cC = await publication.find({
      $and: [
        { year: currentYear - i },
        {
          typeOfPublication: {
            $regex: "conference",
            $options: "i",
          },
        },
      ],
    });
    const cP = await publication.find({
      $and: [
        { year: currentYear - i },
        {
          typeOfPublication: {
            $regex: "patent",
            $options: "i",
          },
        },
      ],
    });
    const cCR = await publication.find({
      $and: [
        { year: currentYear - i },
        {
          typeOfPublication: {
            $regex: "copyright",
            $options: "i",
          },
        },
      ],
    });
    let ob = {
      year: currentYear - i,
      countJ: cJ.length,
      countB: cB.length,
      countC: cC.length,
      countP: cP.length,
      countCR: cCR.length,
    };
    yearCountEach.unshift(ob);
  }
  res.status(200).json({
    success: true,
    // publications: pub,
    publicationsCount,
    countArray,
    yearCount,
    yearCountEach,
  });
});

//delete publication @admin
exports.deletePublication = asyncErrorHandler(async (req, res, next) => {
  const publicationDetails = await publication.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    // publicationDetails,
  });
});

//delete all publication @admin
exports.deleteAllPublication = asyncErrorHandler(async (req, res, next) => {
  await publication.deleteMany();
  const publications = await publication.find({});
  res.status(200).json({
    success: true,
    publications,
  });
});
//update publication @admin
exports.updatePublication = asyncErrorHandler(async (req, res, next) => {
  await publication.findByIdAndUpdate(req.params.id, req.body);
  const publicationDetails = await publication.findById(req.params.id);
  // console.log(req.body)
  res.status(200).json({
    success: true,
    publicationDetails,
  });
});

//update publication @admin
exports.getPublications = asyncErrorHandler(async (req, res, next) => {
  // console.log("in dup");
  const resultPerPage = Number(req.query.ppp);
  const publicationsCount = await publication.countDocuments();
  // console.log(req.body.keyword)
  let arK = req.body.keyword.split(" ");
  if (arK.length > 16) {
    arK = arK.slice(0, 17);
  }
  req.body.keyword = arK.join(" ");
  // console.log(req.body.keyword)
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
    monthMap.set(months[i], i);
  }
  monthMap.set("", 0);
  monthMap.set("s", 11);
  let top =
    req.query.typeOfPublication == ""
      ? ["All", "Journal", "Book Chapter", "Conference", "Patent", "Copyright"]
      : req.query.typeOfPublication;
  const agexp = [
    {
      $search: {
        index: "publications_search",
        compound: {
          must: [
            {
              text: {
                query: top,
                path: "typeOfPublication",
                fuzzy: {},
              },
            },
          ],
          filter: [
            {
              range: {
                path: "noOfCitations",
                gte: Number(req.query.citations.gte),
                lte: Number(req.query.citations.lte),
              },
            },
            {
              range: {
                path: "dateOfPublication",
                gte: Number(new Date(req.query.fYear).getTime()),
                lte: Number(new Date(req.query.tYear).getTime()),
              },
            },
          ],
        },
      },
    },
    {
      $addFields: {
        score: { $meta: "searchScore" },
        search: req.body.keyword == "" ? false : true,
      },
    },
  ];
  if (req.body.keyword != "") {
    agexp[0].$search.compound.must = [
      {
        text: {
          query: req.body.keyword,
          // path: {
          //   wildcard: "*",
          // },
          path: [
            "abstract",
            "title",
            "keywords",
            "listOfAuthors",
            "typeOfPublication",
          ],
          fuzzy: {},
        },
      },
      ...agexp[0].$search.compound.must,
    ];
  }
  // console.log(agexp[0].$search.compound.must)
  let pub = await publication.aggregate(agexp);



  let temp = [];
  for (let i = 0; i < pub.length; i++) {
    if (req.query.department.includes(pub[i].department)) {
      temp = [...temp, pub[i]];
    }
  }
  pub = [...temp];
  temp = [];
  const currentPage = Number(req.query.page) || 1;
  let filteredPublicationsCount = pub.length;

  const skip = resultPerPage * (currentPage - 1);
  pub.sort((a, b) => b.noOfCitations - a.noOfCitations);
  temp = pub;

  temp.forEach((entry) => {
    entry.keywords = entry.keywords.join(", "); // Convert array to comma-separated string
    entry.listOfAuthors = entry.listOfAuthors.join(", ");
  });
  pub = pub.slice(skip, skip + resultPerPage);

  res.status(200).json({
    success: true,
    publications: pub,
    publicationsCount,
    resultPerPage,
    filteredPublicationsCount,
    tPub: temp,
  });
});

//get NOC of it year wise
exports.getItData = asyncErrorHandler(async (req, res, next) => {
  let pubs = await publication.find({});
  const map1 = new Map();
  for (let i = 0; i < pubs.length; i++) {
    if (map1.has(pubs[0].year)) {
      map1.set(
        pubs[i].year,
        map1.get(pubs[i].year) + Number(pubs[i].noOfCitations)
      );
    } else {
      map1.set(pubs[i].year, Number(pubs[i].noOfCitations));
    }
  }
  // console.log(map1);
  res.status(200).json({
    success: true,
  });
});

//period wise analytics of publications
exports.getPeriodAnalytics = asyncErrorHandler(async (req, res, next) => {
  let span = Number(req.query.span);
  let today = new Date();
  let year = today.getFullYear();
  let analytics = [];
  let departments = req.body.departments;
  // let departments = ["IT"];
  let pubs;
  let temp = [];
  for (let i = 0; i < span; i++) {
    let ob = {};
    ob.periodS = year - i - 1;
    let yearInSecE = Number(new Date(`${ob.periodS}-12-31`).getTime());
    let yearInSecS = Number(new Date(`${ob.periodS}-01-01`).getTime());
    pubs = await publication.find({
      $and: [
        {
          dateOfPublication: { $gte: yearInSecS, $lte: yearInSecE },
        },
        {
          department: departments,
        },
      ],
    });
    ob.publications = pubs.length;
    pubs = await publication.find({
      $and: [
        {
          dateOfPublication: { $gte: yearInSecS, $lte: yearInSecE },
        },
        {
          typeOfPublication: {
            $regex: "journal",
            $options: "i",
          },
        },
        {
          department: departments,
        },
      ],
    });
    ob.journals = pubs.length;
    pubs = await publication.find({
      $and: [
        {
          dateOfPublication: { $gte: yearInSecS, $lte: yearInSecE },
        },
        {
          typeOfPublication: {
            $regex: "book",
            $options: "i",
          },
        },
        {
          department: departments,
        },
      ],
    });
    ob.books = pubs.length;
    pubs = await publication.find({
      $and: [
        {
          dateOfPublication: { $gte: yearInSecS, $lte: yearInSecE },
        },
        {
          typeOfPublication: {
            $regex: "conference",
            $options: "i",
          },
        },
        {
          department: departments,
        },
      ],
    });
    ob.conferences = pubs.length;
    pubs = await publication.find({
      $and: [
        {
          dateOfPublication: { $gte: yearInSecS, $lte: yearInSecE },
        },
        {
          typeOfPublication: {
            $regex: "patent",
            $options: "i",
          },
        },
        {
          department: departments,
        },
      ],
    });
    ob.patents = pubs.length;
    pubs = await publication.find({
      $and: [
        {
          dateOfPublication: { $gte: yearInSecS, $lte: yearInSecE },
        },
        {
          typeOfPublication: {
            $regex: "copy",
            $options: "i",
          },
        },
        {
          department: departments,
        },
      ],
    });
    ob.copyrights = pubs.length;
    temp = [...temp, ob];
  }
  let {data} = await axios.get("http://127.0.0.1:5000/predict");
  let {predictions}=data
  console.log(predictions)
  let ob={}
  ob.publications=predictions[5]
  ob.journals=predictions[0]
  ob.conferences=predictions[1]
  ob.books=predictions[2]
  ob.patents=predictions[3]
  ob.copyrights=predictions[4]
  ob.periodS=2025
  temp=[ob,...temp]
  analytics = [{ department: departments, data: temp }];
  for (let j = 0; j < departments.length; j++) {
    temp = [];
    for (let i = 0; i < span; i++) {
      let ob = {};
      ob.periodS = year - i - 1;
      ob.periodE = year - i;
      let yearInSecE = Number(new Date(`${ob.periodE}-01-01`).getTime());
      let yearInSecS = Number(new Date(`${ob.periodS}-01-01`).getTime());
      pubs = await publication.find({
        $and: [
          {
            dateOfPublication: { $gte: yearInSecS, $lte: yearInSecE },
          },
          {
            department: departments[j],
          },
        ],
      });
      ob.publications = pubs.length;
      pubs = await publication.find({
        $and: [
          {
            dateOfPublication: { $gte: yearInSecS, $lte: yearInSecE },
          },
          {
            typeOfPublication: {
              $regex: "journal",
              $options: "i",
            },
          },
          {
            department: departments[j],
          },
        ],
      });
      ob.journals = pubs.length;
      pubs = await publication.find({
        $and: [
          {
            dateOfPublication: { $gte: yearInSecS, $lte: yearInSecE },
          },
          {
            typeOfPublication: {
              $regex: "book",
              $options: "i",
            },
          },
          {
            department: departments[j],
          },
        ],
      });
      ob.books = pubs.length;
      pubs = await publication.find({
        $and: [
          {
            dateOfPublication: { $gte: yearInSecS, $lte: yearInSecE },
          },
          {
            typeOfPublication: {
              $regex: "conference",
              $options: "i",
            },
          },
          {
            department: departments[j],
          },
        ],
      });
      ob.conferences = pubs.length;
      pubs = await publication.find({
        $and: [
          {
            dateOfPublication: { $gte: yearInSecS, $lte: yearInSecE },
          },
          {
            typeOfPublication: {
              $regex: "patent",
              $options: "i",
            },
          },
          {
            department: departments[j],
          },
        ],
      });
      ob.patents = pubs.length;
      pubs = await publication.find({
        $and: [
          {
            dateOfPublication: { $gte: yearInSecS, $lte: yearInSecE },
          },
          {
            typeOfPublication: {
              $regex: "copy",
              $options: "i",
            },
          },
          {
            department: departments[j],
          },
        ],
      });
      ob.copyrights = pubs.length;
      temp = [...temp, ob];
    }
    analytics = [...analytics, { department: departments[j], data: temp }];
  }
  res.status(200).json({
    success: true,
    analytics,
  });
});
