const knex = require("../database.js");
const moment = require("moment");

exports.allRequests = async (req, res) => {
    knex.select("*").from("JobRejectionRequest").then(data =>{
        res.json({success:true, data, message: "JobRejectionRequests fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.allRequestsAndJobs = async (req, res) => {
    knex.select("*").from("JobRejectionRequest")
    .join("Jobs", "JobRejectionRequest.jobID", "=", "Jobs.jid").then(data =>{
        res.json({success:true, data, message: "JobRejectionRequests fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.getRequestsByJobIDandStaffID = async (req, res) => {
    const {jobID, staffID} = req.body;
    knex.select("*").from("JobRejectionRequest").where({jobID: jobID, staffID: staffID}).then(data =>{
        res.json({success:true, data, message: "JobRejectionRequests fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.create = async (req, res) => {
    const {jobID, staffID, reason} = req.body;
    // check if jobID and staffID exists
    knex.select("*").from("JobRejectionRequest").where({jobID: jobID, staffID: staffID}).then(data =>{
        if(data.length > 0){
            return res.json({success:false, message: "Job Rejection Request already exists!"});
        }else{
            knex.insert({
                jobID: jobID,
                staffID: staffID,
                reason: reason,
                status: "Pending",
                requestCreatedOn: moment().format('YYYY-MM-DD HH:mm:ss'),
            }).into("JobRejectionRequest").then(data =>{
                knex.select("*").from("JobRejectionRequest").where({jobID:jobID,staffID: staffID}).then(data =>{
                res.json({success:true, data, message: "JobRejectionRequest created!"});
                }).catch(err => {
                    res.json({success:false, message: err.message});
                })
            }).catch(err => {
                res.json({success:false, message: err.message});
            });
        }
    })
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
 console.log(req.body);
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
    await knex.select("*").from("Jobs").then(data =>{
        data.map((job) => {
            return joblist.push({value:job.jid, label:job.jobName});
        })
    })

    var stafflist = [];
    await knex.select("*").from("Users").where({role:"staff"}).then(data =>{
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
            displayLabel: "Job Rejection Request ID",
            editable: false,
            primaryKey: true
        },
        "jobID":{
            type: "dropdown",
            displayLabel: "Job ID",
            editable: true,
            options: joblist,
        },
        "staffID":{
            type: "dropdown",
            displayLabel: "Staff ID",
            editable: true,
            options: stafflist,
        },
        "reason":{
            type: "text",
            displayLabel: "Reason",
            editable: true,
        },
        "status":{
            type: "dropdown",
            displayLabel: "Status",
            editable: true,
            options: [
                {value:"Pending", label:"Pending"},
                {value:"Approved", label:"Approved"},
                {value:"Rejected", label:"Rejected"},
            ],
        },
        "requestCreatedOn":{
            type: "datetime",
            displayLabel: "Request Created On",
            editable: false,
        },
        "requestUpdatedOn":{
            type: "datetime",
            displayLabel: "Request Updated On",
            editable: false,
        },
    }

    const settings = {
        columnSettings: columnSettings,
        fieldSettings: fieldSettings,
    }

    res.json({success:true, settings, message: "JobRejectionRequest settings fetched!"});
}