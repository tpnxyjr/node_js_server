var bcrypt = require('bcryptjs'),
    Q = require('q'),
    db = require('seriate');

var config = require('../../config').config;
db.setDefaultConfig( config );

var sqlFile = '../sql/signup.sql';
//used in local-signup strategy
exports.localReg = function (username, password) {
    var deferred = Q.defer();
    var hash = bcrypt.hashSync(password, 8);
    var user = {
        "username": username,
        "password": hash,
        "avatar": "../image/small_avatar.jpg"
    }
    //check if username is already assigned in our database
    sqlFile = '../sql/login.sql';
    db.execute({
            query: db.fromFile(sqlFile),
            params: {username: username  }
    }).then(function (result) {
        if (result[0] != null) {
            console.log("username already exists");
            deferred.resolve(false);
        }
        else{
            if (result[0] == null){
                console.log('Username is free for use');
                console.log(username);
                console.log(hash);
                sqlFile = '../sql/signup.sql';
                db.execute({
                    query:db.fromFile(sqlFile),
                    params: {username: username,
                        password: hash}
                }).then(function () {
                        console.log("USER: " + user);
                        deferred.resolve(user);
                    },function (err) {
                        console.log("PUT FAIL:" + err.body);
                        deferred.reject(new Error(err.body));
                    });
            } else {
                deferred.reject(new Error(result[0]));
            }
        }
    },function (err) {
            console.log(err);
    });
    return deferred.promise;
};


//check if user exists
//if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
//if password matches take into website
//if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = function (username, password) {
    var deferred = Q.defer();
    sqlFile = '../sql/login.sql';
    db.execute({
        query: db.fromFile(sqlFile),
        params: {username: username}
    }).then(function (result) {
        if(result[0]!= null) {
            console.log("FOUND USER");
            console.log(result);
            var hash = result[0].user_password;
            console.log(hash);
            console.log(bcrypt.compareSync(password, hash));
            if (bcrypt.compareSync(password, hash)) {
                deferred.resolve(result[0]);
            } else {
                console.log("PASSWORDS NOT MATCH");
                deferred.resolve(false);
            }
        }
        else{
            console.log("COULD NOT FIND USER IN DB FOR SIGNIN");
            deferred.resolve(false);
        }
        },function (err) {
            deferred.reject(new Error(err));
        });
    return deferred.promise;
}

/*
exports.changePassword = function(username, password, newpassword){
    var deferred = Q.defer();
    sqlFile = '../sql/login.sql';
    db.execute({
        query: db.fromFile(sqlFile),
        params: {username: username}
    }).then(function (result) {
        if(result[0]!= null) {
            console.log("FOUND USER");
            console.log(result);
            var hash = result[0].user_password;
            console.log(hash);
            console.log(bcrypt.compareSync(password, hash));
            if (bcrypt.compareSync(password, hash)) {
                var hash = bcrypt.hashSync(newpassword, 8);
                var sqlFile = '../sql/changePassword';
                db.execute({
                    query:db.fromFile(sqlFile),
                    params: {username: username,
                        password: hash}
                }).then(function () {
                    console.log("PASSWORD CHANGED " + newpassword);
                    deferred.resolve(user);
                },function (err) {
                    console.log("UPDATE FAIL:" + err.body);
                    deferred.reject(new Error(err.body));
                });
                deferred.resolve(result[0]);
            } else {
                console.log("PASSWORDS NOT MATCH");
                deferred.resolve(false);
            }
        }
        else{
            console.log("COULD NOT FIND USER IN DB FOR SIGNIN");
            deferred.resolve(false);
        }
    },function (err) {
        deferred.reject(new Error(err));
    });
    return deferred.promise;
}
    */