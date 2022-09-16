const { SHA256 } = require("crypto-js");
const knex = require("../database.js");

exports.allUsers = async (req, res) => {
    knex.select("*").from("Users").then(data =>{
        res.json({success:true, data, message: "Users fetched!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.create = async (req, res) => {
    const {username, password, role} = req.body;
    knex.insert({username: username, password: SHA256(password), role: (role? role :  "staff")}).into("Users").then(data =>{
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
    const {username} = req.body;
    knex.delete().from("Users").where({username: username}).then(data =>{
        res.json({success:true, data, message: "User deleted!"});
    }).catch(err => {
        res.json({success:false, message: err.message});
    });
}

exports.update = async (req, res) => {
    const {uid, username, password, role} = req.body;

    knex.update({
        uid: uid, 
        username:username, 
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
        headers: [
            "uid",
            "username",
            "role",
            "password"
        ]
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
        "password":{
            type: "password",
            editable:false,
            displayLabel: "Password",
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
    }

    const settings = {
        columnSettings: columnSettings,
        fieldSettings: fieldSettings
    }

    res.json({success : true, settings: settings, message: "Settings fetched!"});
}