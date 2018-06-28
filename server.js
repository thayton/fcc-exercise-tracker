require('./config/config');

const mongoose = require('./db/mongoose')
const port = process.env.PORT || 3000;
const _ = require('lodash');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

const { User } = require('./models/user');
const { Exercise } = require('./models/exercise');

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Create new user
app.post('/api/exercise/new-user', (req, res) => {
    let body = _.pick(req.body, ['username']);
    let user = new User({
        username: body.username
    });

    // {"username":"a-new-user","_id":"BJRJV-eMQ"} or 400 username already taken
    user.save().then((user) => {
        res.send(_.pick(user, ['_id', 'username']));
    }).catch((e) => {
        if (e.code === 11000) {
            res.status(400).send('username already taken');
        } else {
            res.status(400).send(e);
        }
    });
});

// Add exercise for user and then return added exercise
// {
//    "username": "fcc-test-user",
//    "description": "pullups",
//    "duration": 1,
//    "_id": "H14YKglfQ",
//    "date": "Tue Jun 26 2018"
// }
app.post('/api/exercise/add', (req, res) => {
    let body = _.pick(req.body, ['userId', 'description', 'duration', 'date']);

    User.findOne({ _id: body.userId }).then((user) => {
        if (!user) {
            return res.status(404).send('User not found');
        }
        
        let exercise = new Exercise({
            _user: user._id,
            description: body.description,
            duration: body.duration,
            date: body.date
        });

        return exercise.save().then((exercise) => {
            user.exercises.push(exercise);
            
            return user.save().then((user) => {
                res.send({
                    '_id': user._id,                
                    'username': user.username,
                    'description': exercise.description,
                    'duration': exercise.duration,
                    'date': exercise.dateString
                });
            });
        });
    }).catch((e) => {
        res.status(400).send(e.message);
    });
});

/*
 *  /api/exercise/log?{userId}[&from][&to][&limit]
 *  /api/exercise/log?userId=H14YKglfQ
 */
app.get('/api/exercise/log', (req, res) => {
    // {
    //   "_id":"H14YKglfQ","username":"fcc-test-user","count":2,
    //   "log":[
    //     {"description":"situps","duration":2,"date":"Tue Jun 26 2018"},
    //     {"description":"pushups","duration":2,"date":"Tue Jun 26 2018"}
    //   ]
    // }
    User.findById(req.query.userId)
        .populate('exercises')
        .then((user) => {
            if (!user) {
                return res.status(404).send('User not found');
            }

            res.send({
                '_id': user.id,
                'username': user.username,
                'count': user.exercises.length,
                'log': user.exercises
            });
        }).catch((e) => {
            res.status(400).send(e);
        });
});

// Get the id associated with the username
app.get('/api/exercise/user/:username', (req, res) => {
    User.findOne({ username: req.params.username }).then((user) => {
        if (!user) {
            // return Promise.reject('User not found');
            return res.status(400).send('User not found');
        }
        res.send({ 'id': user._id });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
