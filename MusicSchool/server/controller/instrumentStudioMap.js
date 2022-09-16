const knex = require("../database.js");

exports.allMaps = async (req, res) => {
    knex.select("*").from("InstrumentStudioMap").then(data =>{
        res.json({success:true, data, message: "InstrumentStudioMap fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.create = async (req, res) => {
    const {studioID, instrumentID} = req.body;
    knex.insert({studioID: studioID, instrumentID: instrumentID}).into("InstrumentStudioMap").then(data =>{
        knex.select("*").from("InstrumentStudioMap").then(data =>{
        res.json({success:true, data, message: "InstrumentStudioMap created!"});
        }).catch(err => {
            res.json({success:false, message: err.message});
        })
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.allMapsByInstrument = async (req, res) => {
    const {instrumentID} = req.body;
    knex.select("*").from("InstrumentStudioMap").where({instrumentID: instrumentID}).then(data =>{
        res.json({success:true, data, message: "InstrumentStudioMap fetched!"});
    }
    ).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.allMapsByStudio = async (req, res) => {
    const {studioID} = req.body;
    knex.select("*").from("InstrumentStudioMap").where({studioID: studioID}).then(data =>{
        res.json({success:true, data, message: "InstrumentStudioMap fetched!"});
    }
    ).catch(err => {
        res.json({success:false, message: err.message});
    });
}


exports.delete = async (req, res) => {
        const {studioID, instrumentID} = req.body;
        knex.delete().from("InstrumentStudioMap").where({studioID: studioID, instrumentID: instrumentID}).then(data =>{
            res.json({success:true, data, message: "InstrumentStudioMap deleted!"});
        }).catch(err => {
            res.json({success:false, message: err.message});
        });
    }

exports.settings = async (req, res) => {

    const settings = {
        matchingHeaders : [
            'studioID',
            'sid',
        ],

        tableHeaders: [
            'studioID',
            'instrumentID'
        ]
    }
    res.json({success:true, settings, message: 'Settings fetched!'});
}