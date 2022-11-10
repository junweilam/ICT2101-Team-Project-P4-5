const knex = require("../database.js");

exports.allUnavailabilities = async (req, res) => {
    knex.select("*").from("Unavailabilities").then(data =>{
        res.json({success:true, data, message: "Unavailabilities fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.allUnavailabilitiesForUser = async (req, res) => {
    const {uid} = req.body;
    knex.select("*").from("Unavailabilities").where({uid: uid}).then(data =>{
        res.json({success:true, data, message: "Unavailabilities fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.create = async (req, res) => {
    const {uid, unavailableOn} = req.body;
    knex.insert({uid: uid, unavailableOn: unavailableOn}).into("Unavailabilities").then(data =>{
        knex.select("*").from("Unavailabilities").where({uid:uid}).then(data =>{
        res.json({success:true, data, message: "Unavailability created!"});
        }).catch(err => {
            res.json({success:false, message: err.message});
        })
    }).catch(err => {
        res.json({success:false, message: err.message});
    });

}

exports.toggle = async (req, res) => {
    const {uid, unavailableOn} = req.body;

    knex.select("*").from("Unavailabilities").where({uid: uid, unavailableOn: unavailableOn}).then(data =>{
        if(data.length > 0){
            knex.delete().from("Unavailabilities").where({uid: uid, unavailableOn: unavailableOn}).then(data =>{
                res.json({success:true, data, message: "Unavailability deleted!"});
            }).catch(err => {
                res.json({success:false, message: err.message});
            });
        }else{
            knex.insert({uid: uid, unavailableOn: unavailableOn}).into("Unavailabilities").then(data =>{
                res.json({success:true, data, message: "Unavailability created!"});
            }).catch(err => {
                res.json({success:false, message: err.message});
            });
        }
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.delete = async (req, res) => {
    const {uid, unavailableOn} = req.body;
    knex.delete().from("Unavailabilities").where({uid: uid, unavailableOn: unavailableOn}).then(data =>{
        res.json({success:true, data, message: "Unavailability deleted!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.update = async (req, res) => {
    const {uid, unavailableOn} = req.body;

    knex.update({
        uid: uid, 
        unavailableOn: unavailableOn, 
        }).from("Unavailabilities").where({uid: uid, unavailableOn: unavailableOn}).then(data =>{
        knex.select("*").from("Unavailabilities").then(data =>{ 
            return res.json({success:true, data, message: "Unavailabilities fetched!"});
        })
    }).catch(err => {
        return res.json({success:false, message: err.message});
    });
}

exports.settings = async (req, res) => {
    var staff = [];

    knex.select("*").from("Users").where({role: "staff"}).then(data =>{
        data.map((item) => {
            staff.push({value : item.uid, label : item.name});
        })
    })

    const columnSettings = {
        headers:{
            
            uid: {
                displayHeader: "Staff",
            },
            unavailableOn: {
                displayHeader: "Unavailable On",
            },
        }
    }

    const fieldSettings = {
        uid: {
            type: "dropdown",
            options: staff,
            editable: true,
            primaryKey: true,
        },
        unavailableOn: {
            type: "datetime",
            editable: true,
            primaryKey: true,
        },
    }

    const settings = {
        columnSettings: columnSettings,
        fieldSettings: fieldSettings,
    }

    res.json({success:true, settings, message: "Settings fetched!"});
}