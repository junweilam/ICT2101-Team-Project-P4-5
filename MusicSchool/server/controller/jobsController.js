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
    knex.select("*").from("Jobs")
    .join(
        "Users", "Jobs.staffID", "=", "Users.uid"
    ).join(
        "Instruments", "Jobs.instrumentID", "=", "Instruments.iid"
    ).join(
        "Studio", "Jobs.studioID", "=", "Studio.sid"
    )
        
    .where({staffID: uid}).then(data =>{
        res.json({success:true, data, message: "Jobs fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.create = async (req, res) => {
    const {jobName, studioID, instrumentID, staffID, jobDate,jobStatus} = req.body;
    knex.insert({
        jobName: jobName,
        studioID: studioID,
        instrumentID: instrumentID,
        staffID: staffID,
        jobDate: jobDate,
        jobStatus: jobStatus,
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
    const {jid, jobName, studioID, instrumentID, staffID, jobDate,jobStatus} = req.body;

    knex.update({
        jid: jid,
        jobName: jobName,
        studioID: studioID,
        instrumentID: instrumentID,
        staffID: staffID,
        jobDate: jobDate,
        jobStatus: jobStatus,
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
            editable: true,
            primaryKey: true,
        },
        jobName: {
            displayLabel: "Job Name",
            type: "text",
            editable: true,
        },
        studioID: {
            displayLabel: "Studio",
            type: "dropdown",
            editable: true,
            options: studios,
        },
        instrumentID: {
            displayLabel: "Instrument",
            type: "dropdown",
            editable: true,
            options: instruments,
        },
        staffID: {
            displayLabel: "Staff",
            type: "dropdown",
            editable: true,
            options: staff,
        },
        jobDate: {
            displayLabel: "Job Date",
            type: "datetime",
            editable: true,
        },
        jobStatus: {
            displayLabel: "Job Status",
            type: "dropdown",
            editable: true,
            options: [
                {label: "Assigned", value: "Assigned"},
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
