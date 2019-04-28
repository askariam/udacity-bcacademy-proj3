/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/
// importing the module (level)
const level = require('level');
// Declare the data store path (folder)
const chainDB = './chaindata';

class LevelSandbox {

  constructor() {
    this.db = level(chainDB);
  }

  // Get data from levelDB with key (Promise)
  //------------------------
  // if an error encountered, we check its type.
  // if the key is not found, we ((resolve)) with undefined
  // for any other error type, we reject after printing error msg.
  getLevelDBData(key){
    let self = this;
    return new Promise(function(resolve, reject) {
      self.db.get(key, (err, value) => {
        if(err){
          if (err.type == 'NotFoundError') {
            resolve(undefined);
          }else {
            console.log('Block ' + key + ' get failed', err);
            reject(err);
          }
        }else {
          resolve(JSON.parse(value));
        }
      });
    });
  }

  // Add data to levelDB with key and value (Promise)
  //-------------------------
  // if an error encountered while adding data, we reject with the error msg.
  // otherwise, we resolve with 'value'
  addLevelDBData(key, value) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.db.put(key, value, function(err) {
        if (err) {
          console.log('Block ' + key + ' submission failed', err);
          reject(err);
        }
        resolve(value);
      });
    });
  }

  // Method that return the height
  //------------------------
  // read all the records using readStream. Keep counting as we read
  // until close event is triggered and resolve with counter value.
  // in case of error reject after displaying proper msg.
  // important note: returning the count will be good for knowing the
  // height of the next block (block being added). since we are starting from
  // height (0) for the Genesis block.
  getBlocksCount() {
    let self = this;
    let count = 0;
    return new Promise(function(resolve, reject){
      self.db.createReadStream().on('data', function (data) {
        count ++;
      })
      .on('error', function (err){
        console.log('Error in reading stream. Iteration number: ' + count);
        reject(err);
      })
      .on('close', function () {
        resolve(count);
      });
    });
  }


}

module.exports.LevelSandbox = LevelSandbox;
