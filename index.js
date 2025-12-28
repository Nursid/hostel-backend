require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const bodyParser = require('body-parser');
const route = require("./routes");

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({  
  extended: true
}));


// Routes section
const port = process.env.PORT || 6000;

app.use("/api",route)
app.get('/', (req, res)=>{
  return res.status(200).json({message: "API Running"})
})



// Start the server
app.listen(port, () => {
  console.log(`Server started at port. ${port}`);
});