const knex = require("../database.js");
const moment = require("moment");

exports.allRequests = async (req, res) => {
    knex.select("*").from("JobRejectionRequest").then(data =>{
        res.json({success:true, data, message: "JobRejectionRequests fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.create = async (req, res) => {
    const {jobID, staffID, reason} = req.body;
    knex.insert({
        jobID: jobID,
        staffID: staffID,
        reason: reason,
        status: "Pending",
        requestCreatedOn: moment().format('YYYY-MM-DD HH:mm:ss'),
    }).into("JobRejectionRequest").then(data =>{
        knex.select("*").from("JobRejectionRequest").where({jid:jid}).then(data =>{
        res.json({success:true, data, message: "JobRejectionRequest created!"});
        }).catch(err => {
            res.json({success:false, message: err.message});
        })
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.delete = async (req, res) => {
    const {jrrid} = req.body;
    knex.delete().from("JobRejectionRequest").where({jrrid: jrrid}).then(data =>{
        res.json({success:true, data, message: "JobRejectionRequest deleted!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.update = async (req, res) => {
    const {jrrid, jobID, staffID, reason, status} = req.body;

    knex.update({
        jrrid: jrrid, 
        jobID: jobID, 
        staffID: staffID, 
        reason: reason, 
        status: status, 
        requestUpdatedOn: moment().format('YYYY-MM-DD HH:mm:ss'),
        }).from("JobRejectionRequest").where({jrrid: jrrid}).then(data =>{
        knex.select("*").from("JobRejectionRequest").then(data =>{ 
            return res.json({success:true, data, message: "JobRejectionRequest fetched!"});
        })
    }).catch(err => {
        return res.json({success:false, message: err.message});
    });
}

exports.settings = async (req, res) => {
    var joblist = [];
    knex.select("*").from("Jobs").then(data =>{
        data.map((job) => {
            return joblist.push({value:job.jid, label:job.jobName});
        })
    })

    var stafflist = [];
    knex.select("*").from("Users").where({role:"staff"}).then(data =>{
        data.map((staff) => {
            return stafflist.push({value:staff.uid, label:staff.name});
        })
    });

    const columnSettings = {
        headers:{
            jrrid: {
                displayHeader: "Job Rejection Request ID",
            },
            jobID: {
                displayHeader: "Job ID",
            },
            staffID: {
                displayHeader: "Staff ID",
            },
            reason: {
                displayHeader: "Reason",
            },
            status: {
                displayHeader: "Status",
            },
        }
    }

    const fieldSettings = {
        "jrrid":{
            type: "number",
            label: "Job Rejection Request ID",
            enabled: false,
            primaryKey: true
        },
        "jobID":{
            type: "dropdown",
            label: "Job ID",
            enabled: true,
            options: joblist,
        },
        "staffID":{
            type: "dropdown",
            label: "Staff ID",
            enabled: true,
            options: stafflist,
        },
        "reason":{
            type: "text",
            label: "Reason",
            enabled: true,
        },
        "status":{
            type: "dropdown",
            label: "Status",
            enabled: true,
            options: [
                {value:"Pending", label:"Pending"},
                {value:"Approved", label:"Approved"},
                {value:"Rejected", label:"Rejected"},
            ],
        },
        "requestCreatedOn":{
            type: "datetime",
            label: "Request Created On",
            enabled: false,
        },
        "requestUpdatedOn":{
            type: "datetime",
            label: "Request Updated On",
            enabled: false,
        },
    }

    const settings = {
        columnSettings: columnSettings,
        fieldSettings: fieldSettings,
    }

    res.json({success:true, settings, message: "JobRejectionRequest settings fetched!"});
}