const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { User } = require('./../models/user');
const { Exercise } = require('./../models/exercise');

before((done) => {
    User.remove({}).then(() => done());
});

before((done) => {
    Exercise.remove({}).then(() => done());
});


// Test that new user addition works
describe('POST /api/exercise/new-user', () => {
    it('should create a new user', (done) => {
        var username = 'special-agent-johnson';
        request(app)
            .post('/api/exercise/new-user')
            .send({ username })
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('_id');
                expect(res.body.username).toBe(username);
            }).end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.find({ username }).then((users) => {
                    expect(users.length).toBe(1);
                    expect(users[0].username).toBe(username);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    // Test that adding an existing user fails
    it('should not create a new user', (done) => {
        var username = 'special-agent-johnson';
        request(app)
            .post('/api/exercise/new-user')
            .send({ username })
            .expect(400)
            .expect((res) => {
                expect(res.text).toBe('username already taken');
            }).end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.find({ username }).then((users) => {
                    expect(users.length).toBe(1);
                    expect(users[0].username).toBe(username);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});

// Test that new exercise addition works
// Test that getting exercise log works



// Test that adding exercise to non-existing user fails
