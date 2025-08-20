const express = require('express');  // import express 
const cors = require('cors') // import cors module
require('./db/config');   // get db connection
const Auth = require('./db/auth');  // auth schema for db
const Client = require('./db/client');  // client schema for db
const User = require('./db/user');  // user schema for db
require("dotenv").config();  // loads .env

const upload = require("./multer");
const cloudinary = require("./cloudinary");
const streamifier = require("streamifier");


const jwt = require("jsonwebtoken");   // import jsonwebtoken module

const app = express();   // use executed express
app.use(express.json()); // it is necessary to use req.body
app.use(cors()); // to resolve cors error

// register by client api -> add client to auth and client collection
app.post("/register", async (req,res) =>{
    let auth = new Auth(req.body);
    let result = await auth.save();
    result = result.toObject();
    addToClientsCollection(result)  // after register also add client data in clients collection
    delete result.pass;

           // generate token
            jwt.sign({ result }, process.env.JWTKEY, { expiresIn: '2h' }, (err, token) => {
                if(err){
                    res.send(undefined);
                }
                // token pass to front end and this token again send by frontend in header of other api
                result.token = token;
                res.send(result);
            })

})

// login  -> check client and admin both in auth collection
app.post("/login", async (req, res) => {
    if (req.body.usrnm && req.body.pass) {
        let auth = await Auth.findOne(req.body).select("-pass");
        if (auth) {
            // generate token
            jwt.sign({ auth }, process.env.JWTKEY, { expiresIn: '2h' }, (err, token) => {
                if(err){
                    res.send(undefined);
                }
                // token pass to front end and this token again send by frontend in header of other api
                let authObj = auth.toObject();  // plain JS object from mongoose object to add token
                authObj.token = token;
                res.send(authObj);
            })
        } else {
            res.send(undefined)
        }
    } else {
        res.send(undefined)
    }
})

// add client to clients collection
function addToClientsCollection(data){
    let param = {
        usrnm: data.usrnm,
        name: data.name,
        pass: data.pass,
        email: data.email,
        location: data.location,
        cltId: data.cltId,
        role: data.role
    }
    let client = new Client(param);
    client.save();
}

// ---------------- Client module api s ----------------

// addClientByUser api -> add client to auth and client collection
app.post("/addClientByUser", async (req,res) =>{
    let auth = new Auth(req.body);
    let resultAuth = await auth.save();
    let client = new Client(req.body);
    let resultClient = await client.save();
    res.send(resultAuth);
})

// get client list
app.get("/getClientsList",verifyToken, async (req,res) =>{
    let data = await Client.find();
    res.send(data);
})

// to delete client
app.delete("/deleteClient/:id", async (req,res) =>{
    let data = await Client.deleteOne({ cltId: req.params.id });
    await Auth.deleteOne({ cltId: req.params.id }); // also delete from auth collection
    res.send(data);
})

// update client
app.put("/updateClient/:id", async (req,res) =>{
    let data = await Client.updateOne({ cltId: req.params.id },{$set: req.body});
    await Auth.updateOne({ cltId: req.params.id },{$set: req.body});  // also update from auth collection
    if(data.acknowledged && data.modifiedCount == 1){
        res.send(req.body);
    }else{
        res.send(undefined)
    }
})


// get client detail
app.post("/getClientDetail", async (req,res) =>{
    let data = await Client.findOne(req.body);
    res.send(data);
})

// -----end

// ---------------- user module api s ----------------

// add admin
app.post("/addUser", async (req,res) =>{
    let auth = new Auth(req.body);
    let resultAuth = await auth.save();
    let user = new User(req.body);
    let resultUser = await user.save();
    res.send(resultAuth);
})

// get admin list
app.get("/getUsersList",verifyToken, async (req,res) =>{
    let data = await User.find();
    res.send(data);
})

// to delete user
app.delete("/deleteUser/:id", async (req,res) =>{
    let data = await User.deleteOne({ usrId: req.params.id });
    await Auth.deleteOne({ usrId: req.params.id }); // also delete from auth collection
    res.send(data);
})

// update user
app.put("/updateUser/:id", async (req,res) =>{
    let data = await User.updateOne({ usrId: req.params.id },{$set: req.body});
    await Auth.updateOne({ usrId: req.params.id },{$set: req.body});  // also update from auth collection
    if(data.acknowledged && data.modifiedCount == 1){
        res.send(req.body);
    }else{
        res.send(undefined)
    }
})

// ------end

// Upload image API
app.post("/upload/:id", upload.single("image"), async (req, res) => {
  try {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "uplodedImg" },
      async (error, result) => {
        if (error) {
          return res.status(500).send(error);
        }

        // ✅ WAIT for DB update
        await addImgDataToCltColl(req.params.id, result);

        res.json({
          message: "Image uploaded successfully",
          imageUrl: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

async function addImgDataToCltColl(id, result) {
  const updated = await Client.updateOne(
    { cltId: id },
    { $set: { image1Url: result.secure_url,image1publicId: result.public_id} }
  );
  return updated;
}

// Update image API
app.put("/updateImage/:id", verifyToken ,upload.single("image"), async (req, res) => {
  try {
    const client = await Client.findOne({ cltId: req.params.id });
    if (!client) return res.status(404).send("Client not found");

    // If old image exists, delete it first
    if (client.image1publicId) {
      await cloudinary.uploader.destroy(client.image1publicId, { resource_type: "image",invalidate: true });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "uplodedImg" },
      async (error, result) => {
        if (error) {
          return res.status(500).send(error);
        }

        await addImgDataToCltColl(req.params.id, result);

        res.json({
          message: "Image updated successfully",
          imageUrl: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Delete image API
app.delete("/deleteImage/:id", async (req, res) => {
  try {
    const client = await Client.findOne({ cltId: req.params.id });
    if (!client) return res.status(404).send("Client not found");

    if (client.image1publicId) {
      await cloudinary.uploader.destroy(client.image1publicId, { resource_type: "image", invalidate: true });

      await Client.updateOne(
        { cltId: req.params.id },
        { $unset: { image1Url: "", image1publicId: "" } }
      );

      res.json({ message: "Image deleted successfully" });
    } else {
      res.status(400).send("No image found for this client");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ---------------------
// Upload file API
app.post("/uploadFile/:id", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "uploadedFiles",
        resource_type: "auto", // auto-detect image/pdf/doc/video etc.
      },
      async (error, result) => {
        if (error) return res.status(500).send(error);

        // Save file data in DB against client (pseudo function)
        await addFileDataToCltColl(req.params.id, result);

        res.json({
          message: "File uploaded successfully",
          fileUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    // pipe buffer to cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

async function addFileDataToCltColl(id, result) {
  const updated = await Client.updateOne(
    { cltId: id },
    { $set: { uploadedFileUrl: result.secure_url,uploadedFilePublicId: result.public_id} }
  );
  return updated;
}

// Update image API
app.put("/updateFile/:id", verifyToken ,upload.single("file"), async (req, res) => {
  try {
    const client = await Client.findOne({ cltId: req.params.id });
    if (!client) return res.status(404).send("Client not found");

    // If old image exists, delete it first
    if (client.uploadedFilePublicId) {
      await cloudinary.uploader.destroy(client.uploadedFilePublicId, { resource_type: "image",invalidate: true });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "uplodedImg" },
      async (error, result) => {
        if (error) {
          return res.status(500).send(error);
        }

       // Save file data in DB against client (pseudo function)
        await addFileDataToCltColl(req.params.id, result);

        res.json({
          message: "File updated successfully",
          fileUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// delete file api
app.delete("/deleteFile/:id", async (req, res) => {
  try {
    const client = await Client.findOne({ cltId: req.params.id });
    if (!client) return res.status(404).send("Client not found");

    if (client.uploadedFilePublicId) {
      await cloudinary.uploader.destroy(client.uploadedFilePublicId, { resource_type: "image", invalidate: true });
      // at the time of upload we got resource_type and other thing 

      await Client.updateOne(
        { cltId: req.params.id },
        { $unset: { uploadedFileUrl: "", uploadedFilePublicId: "" } }
      );

      res.json({ message: "file deleted successfully" });
    } else {
      res.status(400).send("No file found for this client");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//------ middleware to verify token --------
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  // console.log(bearerHeader)
  if (bearerHeader) {
    const token = bearerHeader.split(" ")[1];
    jwt.verify(token, process.env.JWTKEY, (err, valid) => {
      if (err) {
        res.status(401).send({ result: "invalid token" })
      } else {
        next()
      }
    })
  } else {
    res.status(403).send({ result: 'please provide token' })
  }
}


app.listen(process.env.PORT, () => {
    console.log("app is running on 5000 port");
});

