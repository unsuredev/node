const express = require("express");
const multer = require("multer");
const Post = require("../models/post");
const router = express.Router();


const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('destination file :' , file)
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "./../node/public/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    cb(null,Date.now() + "_" + name);
  }
});



router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    console.log('file :', req.file);
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      status :1,
   
      imagePath: 'http://localhost:3000/file/images/'+ req.file.filename
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    });
  }
);

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    console.log(req.file);

    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      status : 0,
      date:Date.now(),
      imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id }, post).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);
// Post fetched here
router.get("", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});


// get post by id 
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

// delete post
router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

// post make in active or Inactive post 
 router.post("/changeStatus", (req, res, next) => {   
  let s = req.body.status;
  let id = req.body.id;                                                                                
  Post.updateOne({ _id: id },{$set:{status:s}}).then(result => {
   res.status(200).json({ message: "success" ,res: result});
 });});


/*file upload */

var storage1 = multer.diskStorage({
  destination: (req, file, cb) => {  
    cb(null, './../node/public/upload');
  },
  filename: (req, file, cb) => {
    console.log('file ::', file);
    cb(null, Date.now() + '-' + file.originalname);
  }
});
var upload = multer({storage: storage1}, function(err, res) {
  console.log('err :',err, res);
})
router.post('/upload', upload.single('upload'), (req, res, next) => {
  console.log('====>',req);
  console.log('in upload');
  let filepath = 'https://localhost:3000/public/upload/' + req.file.filename;
  console.log('file is stored at :', filepath);


 res.json({'message': 'File uploaded successfully', path: filepath});
});

    router.get('/fetch/:title', function(req, res) {
      let t = req.params.title;
      console.log('title ::',t);
      Post.find({title: t}).then(data => {
        res.send({data: data});
      }).catch(e =>{
        res.send({err: e});
      })
    })


module.exports = router;
