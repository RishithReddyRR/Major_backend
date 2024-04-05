const mongoose=require('mongoose')
exports.connect=async ()=>{
    try {
        const data=await mongoose.connect(process.env.DB_URL)
        console.log(`mongodb connected with the server ${data.connection.host}`)
        } 
    catch (error) {
      console.log(error)   
    }
}