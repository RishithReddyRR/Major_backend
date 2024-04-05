class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;

    this.queryStr = queryStr;
    this.months = [
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
    this.monthMap = new Map();

    for (let i = 0; i < this.months.length; i++) {
      this.monthMap.set(this.months[i], i);
    }
    this.monthMap.set("", 0);
    this.monthMap.set("s",11);
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            {
              listOfAuthors: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              title: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              keywords: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              typeOfPublication: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              abstract: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};
    // console.log(keyword)
    this.query = this.query.find({ ...keyword });
    // this.queryC = this.queryC.find({ ...keyword });
    // this.queryJ = this.queryJ.find({ ...keyword });
    return this;
  }

  filter() {
    this.query = this.query.find({
      $or: [
        {
          typeOfPublication: {
            $regex: this.queryStr.typeOfPublication,
            $options: "i",
          },
          noOfCitations: {
            $gte: this.queryStr.citations.gte,
            $lte: this.queryStr.citations.lte,
          },
          year: {
            $gte:Number(this.queryStr.fYear)+1,
            $lte:Number(this.queryStr.tYear)-1,
          },
        },
        {
          $or:[
            {
              year:this.queryStr.fYear,
              month:{
                $in:this.months.slice(this.monthMap.get(this.queryStr.fMonth))
              }
            },
            {
              year:this.queryStr.tYear,
              month:{
                $in:this.months.slice(0,this.monthMap.get(this.queryStr.eMonth))
              }
            },
          ]
        }
      ],
    });
    // console.log(this.months.slice(0,this.monthMap.get(this.queryStr.eMonth)))
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;