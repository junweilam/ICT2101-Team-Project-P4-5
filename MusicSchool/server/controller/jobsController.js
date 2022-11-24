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
    const {jobName, studioID, instrumentID, staffID, jobDate,jobTime,jobStatus} = req.body;
    knex.insert({
        jobName: jobName,
        studioID: studioID,
        instrumentID: instrumentID,
        staffID: staffID,
        jobDate: jobDate,
        jobTime: jobTime,
        jobStatus: jobStatus,
    }).into("Jobs").then(data =>{
        res.json({success:true, data, message: "Job created!"});
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
            return instruments.push({value: item.iid, label: item.name, studio: item.studioID});
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
            },
            jobTime: {
                displayHeader: "Job Time",
            },
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
            type: "date",
            editable: true,
        },
        jobTime:{
            displayLabel: "Job Time",
            type: "dropdown",
            editable: true,
            options: [
                {value: "8:00", label: "8:00"},
                {value: "8:30", label: "8:30"},
                {value: "9:00", label: "9:00"},
                {value: "9:30", label: "9:30"},
                {value: "10:00", label: "10:00"},
                {value: "10:30", label: "10:30"},
                {value: "11:00", label: "11:00"},
                {value: "11:30", label: "11:30"},
                {value: "12:00", label: "12:00"},
                {value: "12:30", label: "12:30"},
                {value: "13:00", label: "13:00"},
                {value: "13:30", label: "13:30"},
                {value: "14:00", label: "14:00"},
                {value: "14:30", label: "14:30"},
                {value: "15:00", label: "15:00"},
                {value: "15:30", label: "15:30"},
                {value: "16:00", label: "16:00"},
                {value: "16:30", label: "16:30"},
                {value: "17:00", label: "17:00"},
                {value: "17:30", label: "17:30"},
                {value: "18:00", label: "18:00"},
                {value: "18:30", label: "18:30"},
                {value: "19:00", label: "19:00"},
                {value: "19:30", label: "19:30"},
                {value: "20:00", label: "20:00"},
                {value: "20:30", label: "20:30"},
            ]
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
