const knex = require("../database.js");

exports.allPreferences = async (req, res) => {
    knex.select("*").from("JobPreferences").then(data =>{
        res.json({success:true, data, message: "JobPreferences fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.allPreferencesForUser = async (req, res) => {
    const {uid} = req.body;

    knex.select("*").from("JobPreferences").where({uid: uid}).then(data =>{
        res.json({success:true, data, message: "JobPreferences fetched!"});
    }
    ).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.create = async (req, res) => {
    const {uid, type, date} = req.body;
    //check if exist first
    knex.select("*").from("JobPreferences").where({uid: uid, type: type, date: date}).then(data =>{
        if(data.length > 0){
            knex.update({type: type}).from("JobPreferences").where({uid: uid, type: type, date: date}).then(data =>{
                res.json({success:true, data, message: "JobPreferences updated!"});
            }).catch(err => {
                res.json({success:false, message: err.message});
            })    
        }else{
            knex.insert({uid: uid, type: type, date: date}).into("JobPreferences").then(data =>{
                knex.select("*").from("JobPreferences").where({uid: uid, type: type, date: date}).then(data =>{
                res.json({success:true, data, message: "JobPreferences created!"});
                }).catch(err => {
                    res.json({success:false, message: err.message});
                })
            }).catch(err => {
                res.json({success:false, message: err.message});
            });
        }
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.delete = async (req, res) => {
        const {uid, type, date} = req.body;
        knex.delete().from("JobPreferences").where({uid: uid, type: type, date: date}).then(data =>{
            res.json({success:true, data, message: "JobPreferences deleted!"});
        }).catch(err => {
            res.json({success:false, message: err.message});
        });
    }

exports.update = async (req, res) => {
    const {uid, type, date} = req.body;
    knex("JobPreferences").where({uid: uid, type: type, date: date}).update({type: type
    }).then(data =>{
        knex.select("*").from("JobPreferences").then(data =>{
        res.json({success:true, data, message: "JobPreferences updated!"});
        }).catch(err => {
            res.json({success:false, message: err.message});
        })
    }
    ).catch(err => {
        res.json({success:false, message: err.message});
    })
}
