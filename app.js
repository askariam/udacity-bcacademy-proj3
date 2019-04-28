// Importing Express Module
// Rubric Criteria # 1 (I used express framework)
const express = require('express');

// Importing BodyParser Module
const bodyParser = require('body-parser');

// Importing BlockChain module
const myBlockChain = require('./BlockChain');

// Importing Block Module
const Block = require('./Block.js');

// Selecting port number 8000
// Rubric Criteria # 2 (using port 8000)
const port = 8000;

// initializing my private blockchain
const BChain = new myBlockChain.Blockchain();

// initialize express app
const app = new express;
// use body parser to enable JSON body to be presented in request object
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); //like intercept to the server requests.



// Creating GET endpoint
// Rubric Criteria # 3 (GET Endpoint)
app.get('/block/:height', (req, res) =>
{
  // if height is not specified, the framework itself retursn
  // message: Cannot GET /block/ (no need to handle this case).
  let height = req.params.height;   //get the height
  let p = BChain.getBlock(height);  //get the block (promise)
  p.then((b) => {
    // the getBlock promise will resolve with undefined if block not found.
    if (b === undefined)
    {
      res.status(404).json({
      "status": 404,
      "message": "Block not found"
      });
    }
    else {
      // if the block is found, return the block object.
      res.status(201).send(b);
    }

  })
});

// add end-point to add block   POST /block
// Rubric Criteria # 4 (POST Endpoint)
app.post('/block/', (req, res) => {
  let body = req.body;
  // check if payload has not content!
  // Rubric Criteria # 5 (Error handling)
  if (body.data === "" || typeof body.data === 'undefined' || typeof body === 'undefined')
  {
    res.status(404).json({
    "status": 404,
    "message": "Cannot create a block without data!"
    });
  }
  else {
    let toAddBlock = new Block.Block(body.data);
    let p = BChain.addBlock(toAddBlock); // get the promise resolve value
    p.then((b) => {
      res.status(201).send(b);
    });
  }

});

// start express app
app.listen(port, () => console.log(`Server Listening for port: ${port}`)) ;
