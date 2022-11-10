const knex = require("../database.js");

exports.allJobs = async (req, res) => {
    knex.select("*").from("Jobs").then(data =>{
        res.json({success:true, data, message: "Jobs fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.allJobsForStaff = async (req, res) => {
    const {uid} = req.body;
    knex.select("*").from("Jobs").where({staffID: uid}).then(data =>{
        res.json({success:true, data, message: "Jobs fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.create = async (req, res) => {
    const {jobName, studioID, instrumentID, staffID, jobDate} = req.body;
    knex.insert({
        jobName: jobName,
        studioID: studioID,
        instrumentID: instrumentID,
        staffID: staffID,
        jobDate: jobDate,
    }).into("Jobs").then(data =>{
        knex.select("*").from("Jobs").where({title:title}).then(data =>{
        res.json({success:true, data, message: "Job created!"});
        }).catch(err => {
            res.json({success:false, message: err.message});
        })
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.delete = async (req, res) => {
    const {jid} = req.body;
    knex.delete().from("Jobs").where({jid: jid}).then(data =>{
        res.json({success:true, data, message: "Job deleted!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.update = async (req, res) => {
    const {jid, jobName, studioID, instrumentID, staffID, jobDate} = req.body;

    knex.update({
        jid: jid,
        jobName: jobName,
        studioID: studioID,
        instrumentID: instrumentID,
        staffID: staffID,
        jobDate: jobDate,
        }).from("Jobs").where({jid: jid}).then(data =>{
        knex.select("*").from("Jobs").then(data =>{ 
            return res.json({success:true, data, message: "Jobs fetched!"});
        })
    }).catch(err => {
        return res.json({success:false, message: err.message});
    });
}

exports.settings = async (req, res) => {
    var staff = [];
    var instruments = [];
    var studios = [];

    await knex.select("*").from("Users").where({role: "staff"}).then(data =>{
        data.map((item) => {
            return staff.push({value: item.uid, label: item.name});
        })
    })

    await knex.select("*").from("Instruments").then(data =>{
        data.map((item) => {
            return instruments.push({value: item.iid, label: item.name});
        })
    })

    await knex.select("*").from("Studio").then(data =>{
        data.map((item) => {
            return studios.push({value: item.sid, label: item.studioName});
        })
    })

    const columnSettings = {
        headers:{
            jid: {
                displayHeader: "Job ID",
            },
            jobName: {
                displayHeader: "Job Name",
            },
            studioID: {
                displayHeader: "Studio",
            },
            instrumentID: {
                displayHeader: "Instrument",
            },
            staffID: {
                displayHeader: "Staff",
            },
            jobDate: {
                displayHeader: "Job Date",
            }
        }
    }

    const fieldSettings = {
        jid: {
            displayLabel: "Job ID",
            type: "text",
            enabled: true,
            primaryKey: true,
        },
        jobName: {
            displayLabel: "Job Name",
            type: "text",
            enabled: true,
        },
        studioID: {
            displayLabel: "Studio",
            type: "dropdown",
            enabled: true,
            options: studios,
        },
        instrumentID: {
            displayLabel: "Instrument",
            type: "dropdown",
            enabled: true,
            options: instruments,
        },
        staffID: {
            displayLabel: "Staff",
            type: "dropdown",
            enabled: true,
            options: staff,
        },
        jobDate: {
            displayLabel: "Job Date",
            type: "datetime",
            enabled: true,
        },
        jobStatus: {
            displayLabel: "Job Status",
            type: "dropdown",
            enabled: true,
            options: [
                {label: "Pending", value: "pending"},
                {label: "In Progress", value: "in progress"},
                {label: "Completed", value: "completed"},
            ]
        }
    }

    const settings = {
        columnSettings: columnSettings,
        fieldSettings: fieldSettings,
    }

    res.json({success:true, settings, message: "Settings fetched!"});
}

