const { SHA256 } = require("crypto-js");
const knex = require("../database.js");
const moment = require("moment");

exports.allUsers = async (req, res) => {
    knex.select("*").from("Users").then(data =>{
        res.json({success:true, data, message: "Users fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.allUsersOfRole = async (req, res) => {
    var weekStart = moment().startOf('week').format("YYYY-MM-DDTHH:mm");
    var weekEnd = moment().endOf('week').format("YYYY-MM-DDTHH:mm");
    const {role} = req.body;
    knex.select("*").from("Users")
    .leftJoin( knex.select(["staffID",]).from("Jobs")
    .count("staffID as count")
    .groupBy("staffID")
    .whereBetween("jobDate",[weekStart,weekEnd])
    .as("Jobs"), "Users.uid", "Jobs.staffID")
    .where({role: role}).orderBy("count","desc").then(data =>{
        data.forEach((item, index) => {
            if(item.count == null){
                data[index].count = 0;
                data[index].hours = 0;
            }else{
                data[index].hours = item.count * 0.5;
            }
        })

        res.json({success:true, data, message: "Users fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.create = async (req, res) => {
    const {username, name, password, role} = req.body;
    knex.insert({username: username, name: name, password: SHA256(password), role: (role? role :  "staff")}).into("Users").then(data =>{
        knex.select("*").from("Users").where({username:username}).then(data =>{
        res.json({success:true, data, message: "User created!"});
        }).catch(err => {
            res.json({success:false, message: err.message});
        })
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.delete = async (req, res) => {
    const {uid} = req.body;
    knex.delete().from("Users").where({uid: uid}).then(data =>{
        res.json({success:true, data, message: "User deleted!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.update = async (req, res) => {
    const {uid, username,name, password, role} = req.body;

    knex.update({
        uid: uid, 
        username:username, 
        name: name,
        password: password, 
        role: role, 
        }).from("Users").where({uid: uid}).then(data =>{
        knex.select("*").from("Users").then(data =>{ 
            return res.json({success:true, data, message: "Users fetched!"});
        })
    }).catch(err => {
        return res.json({success:false, message: err.message});
    });
}

exports.login = async (req, res) => {
    const {username, password} = req.body;
    knex.select("*").from("Users").where({username: username, password: SHA256(password)}).then(data =>{
        if(data.length == 0){
            res.json({success:false, message: "Username or password is incorrect!"});
        }else{
            res.json({success:true, data, message: "Login successful!"});
        }
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.settings = async (req, res) => {
    const {uid} = req.body;


    const columnSettings = {
        // Configures the headers of the table
        // Pls match header names with column names (case sensitive!)
        headers: {
            "uid":{
                displayHeader: "User ID",
            },
            "username":{
                displayHeader: "Username",
            },
            "name": {
                displayHeader: "Name",
            },
            "role":{
                displayHeader: "Role",
            },
            "password":{
                displayHeader: "Password",
            }
        }
    }

    const fieldSettings = {
        // Configures the datatype of the fields and their editablility
        "uid":{
            type: "number",
            editable:false,
            displayLabel: "User ID",
            primaryKey: true
        },
        "username":{
            type: "text",
            editable:true,
            displayLabel: "Username",
        },
        "name":{
            type: "text",
            editable:true,
            displayLabel: "Name",
        },
        "role":{
            type: "dropdown",
            editable:true,
            displayLabel: "Role",
            options: [
                {value: "staff", label: "Staff"},
                {value: "admin", label: "Admin"},
                {value: "manager", label: "Manager"}
            ]
        },
        "password":{
            type: "password",
            editable:false,
            displayLabel: "Password",
        },
    }

    const settings = {
        columnSettings: columnSettings,
        fieldSettings: fieldSettings
    }

    res.json({success : true, settings: settings, message: "Settings fetched!"});
}

exports.managerSettings = async (req, res) => {
    const columnSettings = {
        // Configures the headers of the table
        // Pls match header names with column names (case sensitive!)
        headers: {
            "uid":{
                displayHeader: "User ID",
            },
            "username":{
                displayHeader: "Username",
            },
            "name": {
                displayHeader: "Name",
            },
            "role":{
                displayHeader: "Role",
            },
            "count":{
                displayHeader: "Classes this week",
            },
            "hours":{
                displayHeader: "Hours this week",
            }
        }
    }

    const fieldSettings = {
        // Configures the datatype of the fields and their editablility
        "uid":{
            type: "number",
            editable:false,
            displayLabel: "User ID",
            primaryKey: true
        },
        "username":{
            type: "text",
            editable:false,
            displayLabel: "Username",
        },
        "name":{
            type: "text",
            editable:false,
            displayLabel: "Name",
        },
        "role":{
            type: "dropdown",
            editable:false,
            displayLabel: "Role",
            options: [
                {value: "staff", label: "Staff"},
                {value: "admin", label: "Admin"},
                {value: "manager", label: "Manager"}
            ]
        },
        "password":{
            type: "password",
            editable:false,
            displayLabel: "Password",
        },
        "count":{
            type: "number",
            editable:false,
            displayLabel: "Classes this week",
        },
        "hours":{
            type: "text",
            editable:false,
            displayLabel: "Hours this week",
        }
    }

    const settings = {
        columnSettings: columnSettings,
        fieldSettings: fieldSettings
    }

    res.json({success : true, settings: settings, message: "Settings fetched!"});

}