const knex = require("../database.js");

exports.allStudio = async (req, res) => {
    knex.select("*").from("Studio").then(data =>{
        res.json({success:true, data, message: "Studio fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.create = async (req, res) => {
    const {sid, studioName} = req.body;
    knex.insert({sid: sid,studioName: studioName}).into("Studio").then(data =>{
        knex.select("*").from("Studio").where({sid:sid}).then(data =>{
        res.json({success:true, data, message: "Studio created!"});
        }).catch(err => {
            res.json({success:false, message: err.message});
        })
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.getAllInstrumentsInStudios = async (req, res) => {
    knex.select("*").from("Studio").join("Instruments",function(){
        this.on("Instruments.studioID", "=", "Studio.sid")
    }).orderBy("Studio.sid").then(data =>{
        res.json({success:true, data, message: "Studio fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.delete = async (req, res) => {

    const {sid} = req.body;
    knex.delete().from("Studio").where({sid: sid}).then(data =>{
        res.json({success:true, data, message: "Studio deleted!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.update = async (req, res) => {
    const {sid, studioName} = req.body;

    knex.update({
        sid: sid, 
        studioName:studioName, 
        }).from("Studio").where({sid: sid}).then(data =>{
        knex.select("*").from("Studio").then(data =>{ 
            return res.json({success:true, data, message: "Studio fetched!"});
        })
    }).catch(err => {
        return res.json({success:false, message: err.message});
    });
}

exports.settings = async (req, res) => {

    const columnSettings = {
        // Configures the headers of the table
        // Pls match header names with column names (case sensitive!)
        headers: {
            "sid": {
                displayHeader: "Studio ID",
            },
            "studioName": {
                displayHeader: "Studio Name",
            },
        }
    }

    const fieldSettings = {
        // Configures the datatype of the fields and their editablility
        "sid":{
            type: "number",
            editable:false,
            displayLabel: "Studio ID",
            primaryKey: true
        },
        "studioName":{
            type: "text",
            editable:true,
            displayLabel: "Studio Name",
        }
    }

    const listViewSettings = {
        "InstrumentList" : {
            fieldSettings:{
                "name":{
                    displayLabel: "Name",
                }
            }
        }
    }

    const settings = {
        columnSettings: columnSettings,
        fieldSettings: fieldSettings,
        listViewSettings: listViewSettings
    }

    res.json({success : true, settings: settings, message: "Settings fetched!"})
}