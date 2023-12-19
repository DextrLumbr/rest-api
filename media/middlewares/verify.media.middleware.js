const config = require('../../common/config/env.config');
const multer = require("multer");
const multerS3 = require("multer-s3");
const request = require("request");
const { S3Client } = require("@aws-sdk/client-s3");
const AWS = require('aws-sdk');
var fs = require('fs');
AWS.config.update({ region: "us-east-2" });
const promisify = require('util').promisify;
var path = require('path');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// const upload = multer({ storage: storage, fileFilter: fileFilter });
exports.upload = multer({ storage: storage, fileFilter: fileFilter });
// module.exports = uploadImage;

// Create S3 service object
var s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_KEY, // store it in .env file to keep it safe
    secretAccessKey: process.env.AWS_SECRET
}
});

// Get file stream
const fileStream = fs.createReadStream('/Users/Timbr/Downloads/IMG_20231025_190618778.jpg');

/*const s3Storage = multerS3({
    s3: s3, // s3 instance
    bucket: "my-images", // change it as per your project requirement
    acl: "public-read", // storage access type
    metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});

// function to sanitize files and send error for unsupported files
function sanitizeFile(file, cb) {
    // Define the allowed extension
    const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

    // Check allowed extensions
    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );

    // Mime type must be an image
    const isAllowedMimeType = file.mimetype.startsWith("image/");

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true); // no errors
    } else {
        // pass error msg to callback, which can be displaye in frontend
        cb("Error: File type not allowed!");
    }
}

// our middleware
const uploadImage = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback)
    },
    limits: {
        fileSize: 1024 * 1024 * 10 // 10mb file size
    }
})*/
const BUCKET_NAME = 'mtp-announcements'
// const FILE_NAME_LOCAL = './test-file.gif'
const FILE_NAME_S3 = 'this-will-be-the-new-file-name-on-s3.jpg'
const FILE_PERMISSION = 'public-read'

const uploadParams = {
  Bucket: BUCKET_NAME,
  Key: FILE_NAME_S3,
  Body: fileStream,
  ContentType: 'image/jpeg',
  // ACL: FILE_PERMISSION
};

function addByUrl(url,callback) {
  request({
      // url: 'https://www.simplyrecipes.com/thmb/20YogL0tqZKPaNft0xfsrldDj6k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2010__01__cinnamon-toast-horiz-a-1800-5cb4bf76bb254da796a137885af8cb09.jpg',
      url: url,
      encoding: null
  }, function(err, res, body) {
      if (err)
          return callback(err, res);

        // console.log(res)
        // res.status(201).send({id: 'result._id'});

      s3.putObject({
          Bucket: BUCKET_NAME,
          Key: 'testing.' + res.headers['content-type'].split('/')[1],
          ContentType: res.headers['content-type'],
          ContentLength: res.headers['content-length'],
          Body: body // buffer
      }, callback)/*function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data);
            return data
            // res.status(201).send(data);
        }
    });*/
  })
}

const readFile = promisify(fs.readFile);

const uploadToS3 = async(idKey, modifiers, data) => {
  return s3.upload({
    Bucket: BUCKET_NAME,
    Key: `${process.env.APP_ENV}/${idKey}/${modifiers}`,
    Body: data,
    ContentType: 'image/png',
    ACL: 'public-read',
    CacheControl: 'max-age=0',
  }).promise();
};

const uploadImage = async(path) => {
  const data = await readFile(imagePath);
  // Wait until the file is read
  return uploadToS3('key', 'modifier', data);
};

exports.put_from_file = (req, res, next) => {
  fs.readFile('/Users/Timbr/Downloads/tix-1png.png', (err, data) => {
      if (err) throw err;
      var params = {
        Bucket: BUCKET_NAME,
        Key: path.basename('/Users/Timbr/Downloads/tix-1png.png'),
        Body: data,
        ContentType: 'image/png',
        // ACL: "public-read"
      };
      s3.upload(params, (s3Error, data) => {
        if (s3Error) throw s3Error;
        console.log(`File uploaded successfully at ${data.Location}`);
        res.json({
          image: data.key,
          location: data.Location
        });
      });
    });
}

// exports.multer =

exports.local_media = (req, res, next) => {
  console.log(req)
  var file = req.file;
  console.log(file)
  var params = {
    Bucket: BUCKET_NAME,
    // Key: "newFold/" + file.originalname,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    /*Metadata: {
      'userId': req.params.userId,
    },*/
  };

  s3.upload(params, (s3Error, data) => {
    if (s3Error) throw s3Error;
    console.log(`File uploaded successfully at ${data.Location}`);
    res.json({
      image: data.key,
      location: data.Location
    });
  });


}

exports.createFolder = (req, res, next) => {
  s3.putObject({
      Bucket: BUCKET_NAME,
      Key: 'newFold/',
  }, function (err, data) {
    if (err) {
        console.log("Error", err);
    } if (data) {
        console.log("Foler create Success", data);
        return res.status(201).send(data);
        // res.status(201).send(data);
    }
})
}

exports.put_from_url = (req, res, next) => {
  /*s3.upload(uploadParams, function (err, data) {
    if (err) {
        console.log("Error", err);
    } if (data) {
        console.log("Upload Success", data.Location);
        res.status(201).send(data);
    }
});*/

  /*request('https://www.simplyrecipes.com/thmb/20YogL0tqZKPaNft0xfsrldDj6k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2010__01__cinnamon-toast-horiz-a-1800-5cb4bf76bb254da796a137885af8cb09.jpg', { encoding : null })
  .on('response', function(response,body) {
    console.log(response)
    s3.putObject({
        Bucket: "test-bucket",
        Key: 'test.jpg',
        ContentType: response.headers['content-type'],
        ContentLength: response.headers['content-length'],
        Body: body // buffer
    }, next);
    // res.status(201).send({id: 'result._id'});
  })
  .on("error", function(err){
      console.log("Problem reaching URL: ", err);
      res.status(400).send({id: 'bad url'});
   })*/
    request({
        url: 'https://www.simplyrecipes.com/thmb/20YogL0tqZKPaNft0xfsrldDj6k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2010__01__cinnamon-toast-horiz-a-1800-5cb4bf76bb254da796a137885af8cb09.jpg',
        encoding: null
    }, function(err, res, body) {
        if (err)
            return callback(err, res);

          console.log(res)
          // res.status(201).send({id: 'result._id'});

        s3.putObject({
            Bucket: BUCKET_NAME,
            Key: 'test.jpg',
            ContentType: res.headers['content-type'],
            ContentLength: res.headers['content-length'],
            Body: body // buffer
        }, function (err, data) {
          if (err) {
              console.log("Error", err);
          } if (data) {
              console.log("Upload Success", data);
              return res.status(201).send(data);
              // res.status(201).send(data);
          }
      });
    })
}
/*exports.put_from_url = (req, res, next) => {
  res.status(201).send({id: 'result._id'});
}*/

exports.from_url = (req, res) => {
  console.log(req.body.url)
  // console.log(res)
  addByUrl(req.body.url,function(err, resp) {
    if (err)
        throw err;

    console.log('Uploaded data successfully!');
    res.status(201).send(resp);
})
  // res.status(201).send({id: 'result._id'});
}


// module.exports = uploadImage;
