/** This is helper function where we can uoload fiels of every modules also file path will set where
 * Developer : NILMONI PATRA @Bluehorse
 */
const formidable = require('formidable');
const glob = require("glob");
const fs = require("fs-extra");
const path = require('path');
const ds = path.sep;

module.exports = {

  /**
   * Create folder
  */
  createDirectory: function(folder_path) {
    var str = __dirname;
    var n = str.lastIndexOf('\\');
    var path = str.substring(0, n+1);
    var dir = path + folder_path; 
    if (!fs.existsSync(dir)){  
      fs.mkdirSync(dir, { recursive: true });              
    }
  },

  /**
   * This function returns the base path of this js file
   */
  getBasePath: function() {
    var str = __dirname;
    var n = str.lastIndexOf('\\');
    var path = str.substring(0, n+1);
    return path;
  },

  /**
   * Admin file upload start here
   * also check the file is present in folder or not
  */
  uploadFiles: async function (temp_path, target_path) {
    var str = __dirname;
    var n = str.lastIndexOf("\\");
    var path = str.substring(0, n + 1);
    var new_location = path + "public" + ds + "admin" +ds+ "web-contents" +ds+ target_path;
    var result = await new Promise((resolve, reject) => {
      fs.copy(temp_path, new_location, function (err, res) {
        if (!err) {
          resolve("yes");
        } else {
          reject("NO");
        }
      });
    });
    return result;
  },

  isFileExistsIn: function(filename) {
    const directoryPath = this.getBasePath() + "public" + ds + "admin" +ds+ "web-contents" + ds + filename;
    if(fs.existsSync(directoryPath)) return true;
    else return false;
  },
  /**
   * Admin file upload ends here
  */  
 


}