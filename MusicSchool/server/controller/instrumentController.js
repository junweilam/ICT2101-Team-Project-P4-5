const knex = require("../database.js");

exports.allInstruments = async (req, res) => {
    knex.select("*").from("Instruments").join("Studio", function(){
        this.on("Instruments.studioID", "=", "Studio.sid")
    }).then(data =>{
        res.json({success:true, data, message: "Instruments fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.create = async (req, res) => {
    const {name, serialNumber,type,status,studioID} = req.body;
    knex.insert({name: name, type: type, serialNumber:serialNumber,status: status,studioID : studioID}).into("Instruments").then(data =>{
        knex.select("*").from("Instruments").where({name:name}).then(data =>{
        res.json({success:true, data, message: "Instrument created!"});
        }).catch(err => {
            res.json({success:false, message: err.message});
        })
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.delete = async (req, res) => {
    const {iid} = req.body;
    knex.delete().from("Instruments").where({iid: iid}).then(data =>{
        res.json({success:true, data, message: "Instrument deleted!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.update = async (req, res) => {
    const {iid, name, serialNumber, type,status, studioID} = req.body;

    knex.update({
        iid: iid, 
        name:name, 
        serialNumber: serialNumber, 
        type: type, 
        status: status,
        studioID: studioID
        }).from("Instruments").where({iid: iid}).then(data =>{
        
        knex.select("*").from("Instruments").join("Studio", function(){
        this.on("Instruments.studioID", "=", "Studio.sid")}).then(data =>{ 
            return res.json({success:true, data, message: "Instruments fetched!"});
        })
    }).catch(err => {
        return res.json({success:false, message: err.message});
    });
}

exports.settings = async (req, res) => {
    const studios = await knex.select("*").from("Studio").then(studioData =>{
        var tempStudioList = [];
        for(studio in studioData){
            tempStudioList.push({label: studioData[studio].studioName, value: studioData[studio].sid});
        }
        console.log(tempStudioList);
        return tempStudioList;
    })


    const columnSettings = {
        // Configures the headers of the table
        // Pls match header names with column names (case sensitive!)
        headers: {
            "iid":{
                displayHeader: "Instrument ID"
            },
            "name":{
                displayHeader: "Name"
            },
            "serialNumber":{
                displayHeader: "Serial Number"
            },
            "type":{
                displayHeader: "Type"
            },
            "status":{
                displayHeader: "Status"
            },
            "studioID":{
                displayHeader: "Studio ID"
            },
        }
    }

    const fieldSettings = {
        // Configures the datatype of the fields and their editablility
        "iid":{
            type: "number",
            editable:false,
            displayLabel: "Instrument ID",
            primaryKey: true
        },
        "name":{
            type: "text",
            editable:true,
            displayLabel: "Instrument Name",
        },
        "serialNumber":{
            type: "text",
            editable:true,
            displayLabel: "Serial Number",
        },
        "type":{
            type: "dropdown",
            editable:true,
            displayLabel: "Type",
            options:[
                {value: "Piano", label: "Piano"},
                {value: "Drum", label: "Drums"},
                {value: "Violin", label: "Violin"},
                {value: "Trumpet", label: "Trumpet"},
            ]
        },

        "status":{
            type: "dropdown",
            editable:true,
            displayLabel: "Status",
            options: [
                {value: "available", label: "Available"},
                {value: "unavailable", label: "Unavailable"},
            ]
        },
        
        "studioID":{
            type: "dropdown",
            editable:true,
            displayLabel: "Studio ID",
            options: studios
        }
    }

    const settings = {
        columnSettings: columnSettings,
        fieldSettings: fieldSettings
    }

    res.json({success : true, settings: settings, message: "Settings fetched!"});
}

exports.getInstrumentTypes = async (req, res) => {
    return res.json({
        success: true,
        options:[
            {value: "Piano", label: "Piano"},
            {value: "Drum", label: "Drums"},
            {value: "Violin", label: "Violin"},
            {value: "Trumpet", label: "Trumpet"},
        ],
        message: "Instrument types fetched!"
    })
}