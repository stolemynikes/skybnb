const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

//jsonwebtoken
const jwt = require('jsonwebtoken');
const jwtSecret = 'fasefsafsg23542f2hh3gdrgasrrfease2';

//bcrypt for encrypting password
const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);

//cookies middleware
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
require('dotenv').config()

//Import Schemas
const User = require('./models/User.js')
const Place = require('./models/Place.js');

//Image Downloader
const imageDownloader = require('image-downloader');

//multer
const multer = require('multer');

//files system library
const fs = require('fs');
const Booking = require('./models/Booking.js');


//uploading images
app.use('/uploads', express.static(__dirname + '/uploads'))


app.use(express.json());
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: 'https://skybnb.pepijnscheer.nl',
}));

mongoose.connect(process.env.MONGO_URL);

//get userData func
function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData)
        });
    })
}


//Register
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
        });    
        res.json({userDoc})
    } catch(err) {
        res.status(422).json({message: err})
    }
});

//Login
app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const userDoc = await User.findOne({email});
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({
                email:userDoc.email, 
                id:userDoc._id
            }, jwtSecret, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json(userDoc);
            });
        } else {
            res.status(422).json('pass not ok');
        }
    } else {
        res.json('not found');
    }
});

//profile page
app.get('/profile' , (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const {name, email, _id} = await User.findById(userData.id);
            res.json({name, email, _id});
        })
    } else {
        res.json('oops')
    }
  });

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
})

const validUrlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
  
    if (!validUrlRegex.test(link)) {
      res.status(400).json({ error: 'Invalid URL format' });
      return;
    }
  
    try {
      const newName = 'photo_' + Date.now() + '.jpg';
      await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
      });
  
      res.json(newName);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100) , (req,res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const {path, originalName} = req.files[i];
        const parts = originalName.split('.');
        const ext = parts[parts.length - 1]
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/', ''));

    }
    res.json(uploadedFiles);
})

app.post('/places', (req,res) => {
    const {token} = req.cookies;
    const {title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price,} = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;

        const placeDoc = await Place.create({
            Owner: userData.id,
            title,address,photos:addedPhotos,description,
            perks,extraInfo,checkIn,checkOut,maxGuests,price,

        });
        res.json(placeDoc);
    });

});

app.get('/user-places', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {_id} = userData.id;
        res.json( await Place.find({owner:_id}));

    });
});

app.get('/places/:id', async (req,res) => {
    const {id} = req.params;
    res.json( await Place.findById(id))
})

app.put('/places', async (req,res) => {
    const {token} = req.cookies;
    const {id,title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price,} = req.body;


    jwt.verify(token, jwtSecret, {}, async (err, userData) =>  {
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.Owner.toString()) {
            placeDoc.set({
                title,address,photos:addedPhotos,description,
                perks,extraInfo,checkIn,checkOut,maxGuests,price,
            })
            await placeDoc.save();
            res.json('ok');
        }
    })
})

app.get('/places', async (req,res) => {
    res.json( await Place.find())
})

app.post('/bookings', async (req,res) => {
    const userData = await getUserDataFromReq(req);
    const {place,checkIn,checkOut,numberOfGuests,name,phone, price,} = req.body;
    Booking.create({
        place,checkIn,checkOut,numberOfGuests,name,phone, price, user:userData.id,
    }).then((doc) => {
        res.json(doc)
    }).catch((err) => {
        throw err;
    })
})

app.get('/bookings' , async (req,res) => {
    const userData = await getUserDataFromReq(req);
    res.json( await Booking.find({user:userData.id}).populate('place'))
});

app.listen(port)

//wachtwoord: HC0MWqxUAM78Lyla