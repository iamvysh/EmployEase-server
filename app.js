
const express = require('express')
const mongoose=require("mongoose")
const app = express()
const port = 3000
const cors=require("cors")



app.use(express.json())
app.use(express.urlencoded())
app.use(cors())






const mongoDB = "mongodb://127.0.0.1/employEase";

// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err))
async function main() {
  await mongoose.connect(mongoDB);
  console.log("db connected");
}

const employeeRoute=require("./Routers/EmployeeRoute")
app.use(employeeRoute)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})