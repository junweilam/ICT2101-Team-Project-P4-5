import React from "react"
import DatapageLayout from "../PageLayout"
import { WeekView } from "../../Components/common"
import moment from "moment"
import {Loading } from "../../Components/appCommon"

import {MultiStepBox, StdButton} from "../../Components/common"

import {StdInput} from "../../Components/input"

import { JobPreferences } from "../staff/staff-landing"

import "../../styles/manager.scss"
import "../../styles/appCommon.scss"

export default class ManagerLanding extends React.Component{
    state={
    content:null,
    headers:[],
    loading:true,
    settings: {},
    error: "",
    currentStep: 0,
}

settings ={
    title:"All Staff",
    primaryColor: "#48a1da",
    accentColor: "#8fc140",
    textColor: "#ffffff",
    textColorInvert: "#606060",
    api: "/users/",
}

async componentDidMount(){

    console.log(moment().startOf('week').format("YYYY-MM-DDTHH:mm"));
    console.log(moment().endOf('week').format("YYYY-MM-DDTHH:mm"));

    await this.getContent().then((content)=>{
        console.log(content);
        this.setState({
            content:content,
        });
    })

    await this.getJobs().then((jobs)=>{
        console.log(jobs);
        this.setState({
            jobs:jobs.data,
        });
    })

    await this.getRequests().then((requests)=>{
        console.log(requests);
        this.setState({
            requests:requests.data,
        });
    })

    await this.getPreferences().then((preferences)=>{
        console.log(preferences);
        this.setState({
            preferences:preferences.data,
        });
    })


    await this.getSettings().then((settings)=>{
        console.log(settings);
        this.setState({
            settings:settings.settings,
        });
    })

    this.setState({
        loading:false,
    })

    await this.getUnavailabilities().then((unavailabilities)=>{
        console.log(unavailabilities);
        this.setState({
            unavailabilities:unavailabilities.data,
        });
    })
}

getSettings = async () => {
    return fetch(this.settings.api + "managerSettings" , {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(this.props.user.data[0]),
    }).then(res => {
        return res.json();
    })
}

getContent = async () =>{
    return fetch( this.settings.api + "allUsersOfRole" , {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify({role:"staff"})
    }).then(res => {
        return res.json();
    });
}

getJobs = async () => {
    return fetch("/jobs/allJobs",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(res => {
        return res.json();
    });
}

getRequests = async () => {
    return fetch("/jobRejectionRequest/allRequestAndJobs",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(res => {
        return res.json();
    });
}

getPreferences = async () => {
    return fetch("/jobPreferences/allPreferences",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(res => {
        return res.json();
    });
}

getUnavailabilities = async () => {
    return fetch("/unavailabilities/allUnavailabilities",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(res => {
        return res.json();
    });
}

update = async (data) =>{
    console.log(data);
    return fetch(this.settings.api + "update" , {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }).then(async res => {
        return res.json();
    });
}

handleUpdate = async (data) =>{
    await this.update(data).then((content)=>{
        console.log(content);
        if(content.success){
            this.setState({
                error:"",
            })
            return true;
        }else{
            this.setState({
                error:content.message,
            })
            return false;
        }
    })
}

requestRefresh = async () =>{
    this.setState({
        loading:true,
    })
    await this.getContent().then((content)=>{
        console.log(content);
        this.setState({
            content:content,
            loading:false,
        });
    })
}

closeModal = () =>{
    this.setState({
        modalContent: undefined
    })
}

render(){  
    return(
        this.state.loading?
        <Loading/>
        :
        <div className="d-flex flex-column w-100">
            <div className="container-fluid manager-landing-header">
                <div className="manager-top-three top card-bg no-pad">
                    <div className="header">
                        Top 3 Staff
                    </div>
                    <div className="body">
                        {
                            this.state.content.data.length < 3 ?
                            this.state.content.data.map((user,index)=>{
                            
                                return(
                                    <div className="staff-item">
                                        <div className="staff-item-name">
                                            {user.name}
                                        </div>
                                        <div className="staff-item-hours">
                                            {user.hours} Hours
                                        </div>
                                    </div>
                                )
                            })
                            :
                            this.state.content.data.slice(0,3).map((user,index)=>{
                            
                                return(
                                    <div className="staff-item">
                                        <div className="staff-item-name">
                                            {user.name}
                                        </div>
                                        <div className="staff-item-hours">
                                            {user.hours} Hours
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="manager-top-three bottom card-bg no-pad">
                    <div className="header">
                        Bottom 3 Staff
                    </div>
                    <div className="body">
                        {this.state.content.data.length < 3 ? 
                        
                        this.state.content.data.reverse().map((user,index)=>{
                            return(
                                <div className="staff-item">
                                    <div className="staff-item-name">
                                        {user.name}
                                    </div>
                                    <div className={"staff-item-hours"}>
                                        {user.hours} Hours
                                    </div>
                                </div>
                            )
                        })
                        :
                        
                        this.state.content.data.slice(this.state.content.data.length - 3).reverse().map((user,index)=>{
                            return(
                                <div className="staff-item">
                                    <div className="staff-item-name">
                                        {user.name}
                                    </div>
                                    <div className="staff-item-hours">
                                        {user.hours} Hours
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                </div>

                <div className="requests card-bg no-pad">
                    <div className="header">
                        Rejection requests
                        <span className="requestCount">{this.state.requests.length} <span className="rq">Requests</span></span>
                    </div>
                    <div className="body">
                        <div className="requests-tabs">
                            <span className={"tab " + (this.state.currentStep == 0 ? "active" : "")} onClick={()=>this.setState({
                                currentStep:0
                            })}>Pending</span>
                            <span className={"tab " + (this.state.currentStep == 1 ? "active" : "")} onClick={()=>this.setState({
                                currentStep:1
                            })}>Approved</span>
                            <span className={"tab " + (this.state.currentStep == 2 ? "active" : "")} onClick={()=>this.setState({
                                currentStep:2
                            })}>Rejected</span>
                            <span className={"tab " + (this.state.currentStep == 3 ? "active" : "")} onClick={()=>this.setState({
                                currentStep:3
                            })}>All</span>
                        </div>
                        <MultiStepBox steps={[{0:"pending"},{1:"approved"},{2:"rejected"},{3:"all"}]} currentStep={this.state.currentStep}>
                            <div className="pending">
                                {this.state.requests.filter((request)=>request.status === "Pending").map((request,index)=>{
                                    return(
                                        <div className="request-item" onClick={()=>{
                                            this.setState({
                                                modalContent: request
                                            })
                                        }}>
                                            <div className="request-first-row">
                                                
                                                <span className="request-item-name">
                                                    {request.jobName}
                                                </span>
                                                <span className="request-item-status">
                                                    {request.status}
                                                </span>
                                            </div>
                                            <div className="request-item-hours">
                                                {moment(request.jobDate).format("DD/MM/YYYY")}
                                                {moment(request.jobTime,"HH:mm").format(", HH:mm a")}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="Approved">
                                {this.state.requests.filter((request)=>request.status === "Approved").map((request,index)=>{
                                    return(
                                        <div className="request-item" onClick={()=>{
                                            this.setState({
                                                modalContent: request
                                            })
                                        }}>
                                            <div className="request-first-row">
                                                
                                                <span className="request-item-name">
                                                    {request.jobName}
                                                </span>
                                                <span className="request-item-status">
                                                    {request.status}
                                                </span>
                                            </div>
                                            <div className="request-item-hours">
                                                {moment(request.jobDate).format("DD/MM/YYYY")}
                                                {moment(request.jobTime,"HH:mm").format(", HH:mm a")}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="Rejected">
                                {this.state.requests.filter((request)=>request.status === "Rejected").map((request,index)=>{
                                    return(
                                        <div className="request-item" onClick={()=>{
                                            this.setState({
                                                modalContent: request
                                            })
                                        }}>
                                            <div className="request-first-row">
                                                
                                                <span className="request-item-name">
                                                    {request.jobName}
                                                </span>
                                                <span className="request-item-status">
                                                    {request.status}
                                                </span>
                                            </div>
                                            <div className="request-item-hours">
                                                {moment(request.jobDate).format("DD/MM/YYYY")}
                                                {moment(request.jobTime,"HH:mm").format(", HH:mm a")}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="All">
                                {this.state.requests.map((request,index)=>{
                                    return(
                                        <div className="request-item" onClick={()=>{
                                            this.setState({
                                                modalContent: request
                                            })
                                        }}>
                                            <div className="request-first-row">
                                                
                                                <span className="request-item-name">
                                                    {request.jobName}
                                                </span>
                                                <span className="request-item-status">
                                                    {request.status}
                                                </span>
                                            </div>
                                            <div className="request-item-hours">
                                                {moment(request.jobDate).format("DD/MM/YYYY")}
                                                {moment(request.jobTime,"HH:mm").format(", HH:mm a")}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </MultiStepBox>
                    </div>
                </div>

                
                <div className="manager-over-forty bottom card-bg no-pad">
                    <div className="header">
                        Staff Over 40 Working Hours
                        <span className="requestCount">{this.state.content.data.filter((staff)=>staff.hours > 40).length} <span className="rq">Staff</span></span>
                    </div>
                    <div className="body">
                        {this.state.content.data.filter((staff)=>staff.hours > 40).map((staff,index)=>{

                            <div className="staff-item">
                                <div className="staff-item-name">
                                    {staff.name}
                                </div>
                                <div className={"staff-item-hours"}>
                                    {staff.hours} Hours
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <DatapageLayout 
                settings={this.settings}
                fieldSettings={this.state.settings.fieldSettings} 
                headers={this.state.settings.columnSettings.headers} 
                data={this.state.content.data}
                updateHandle = {this.handleUpdate}
                requestRefresh = {this.requestRefresh}
                error={this.state.error}>
                {this.state.content.data.map((item, index) => {
                    return(
                        <div className="staff-extended"> 
                            <JobPreferences preferences ={this.state.preferences.filter((pref)=>{
                                return pref.uid == item.uid;
                            })}></JobPreferences>
                            <WeekSchedule sid ={item.uid} data = {this.state.jobs} unavailabilities = {this.state.unavailabilities}/>
                        </div>
                    ) 
                })}
            </DatapageLayout>

            
            {this.state.modalContent && 
            <JobModal job={this.state.modalContent} closeModal={this.closeModal} requestRefresh={this.requestRefresh}></JobModal>
            }
        </div>
        )
    }
} 


export class WeekSchedule extends React.Component{

    state={
        loading:true,
        jobs:[],
    }

    componentDidMount(){
        console.log(this.props.data);
        var jobsForUser = this.props.data.filter((job)=>
        job.staffID == this.props.sid)
        console.log(jobsForUser)

        var unavailabilitiesForUser = this.props.unavailabilities.filter((unavailability)=>
        unavailability.uid == this.props.sid)
        console.log(unavailabilitiesForUser)

        this.setState({
            unavailabilities:unavailabilitiesForUser,
            jobs:jobsForUser,
            loading:false,
        })
    }

    render(){
        return(
            this.state.loading ? 
            <Loading></Loading>
            :
            
            <div className={"card-bg no-pad"}>
                <div className="header">This week's schedule</div>
                <div className="body">

                    <WeekView timeField={"jobDate"} maxTimeSlot={6} cellComponent={<EventCell items={this.state.jobs} unavailabilities={this.state.unavailabilities}></EventCell>}></WeekView>
                </div>

            </div>
        )
    }
}



export class EventCell extends React.Component{

    state={
        index: this.props.index,
    }

    componentDidUpdate(prevProps){
        if(prevProps.index !== this.props.index){
            this.setState({
                index:this.props.index,
            })
            var jobs = this.findJobs();
            var unavailabilities = this.findUnavailabilities();
            this.setState({
                job:jobs,
                unavailability:unavailabilities,
            })
        }

    }

    findJobs = () =>{
        let jobs = this.props.items.find((item)=>{
            var jobDate = moment(item.jobDate,"YYYY-MM-DD").format("YYYY-MM-DD");
            var jobTime = moment(item.jobTime,"HH:mm").format("HH:mm");
            var indexDate = moment(this.props.index,"DD-MM-YYYY HH:mm").format("YYYY-MM-DD");
            var indexTime = moment(this.props.index,"DD-MM-YYYY HH:mm").format("HH:mm");
            return jobDate === indexDate && jobTime === indexTime;
        })
        return jobs;
    }

    findUnavailabilities = () => {
        let unavailabilities = this.props.unavailabilities.find((item)=>{
            var unavailabilityDateTime = moment(item.unavailableOn,"DD-MM-YYYY HH:mm").format("YYYY-MM-DD HH:mm");
            var indexDateTime = moment(this.props.index,"DD-MM-YYYY HH:mm").format("YYYY-MM-DD HH:mm");
            return unavailabilityDateTime === indexDateTime;
        })
        return unavailabilities;
    }

    componentDidMount = () =>{
        var jobs = this.findJobs();
        var unavailability = this.findUnavailabilities();
        console.log(unavailability);
        this.setState({
            job:jobs,
            unavailability:unavailability,
        })

    }
    render(){
        if(this.state.job){
            return(
                <div className="event" onClick={()=>this.props.onCellClick(this.state.job.jid)}>{this.state.job.jobName}</div>   
            )   
        }

        if(this.state.unavailability){
            return(
                <div className="event unavailable">Unavailable</div>   
            )
        }

        return(
            
            <div className="event"></div>   
        )
    }
}



class JobModal extends React.Component{
    steps = {
        0:"Job Details",
        1:"JobRejectionRequest"
    }
    state={
        requestExcludes: ["jrrid","status","requestCreatedOn","requestUpdatedOn"],
        jobExcludes: ["jobName","jid"],
        currentStep: 0,
        loading:true,
        status: "",
    }

    componentDidMount = async () =>{
        var dataToPush = this.props.job;

        await this.getJobRejectionSettings().then(async (settings)=>{
            console.log(settings);
            this.setState({
                rejSettings:settings.settings,
            })
        })

        await this.getJobSettings().then(async (settings)=>{
            console.log(settings);
            this.setState({
                jobSettings:settings.settings,
            })
        })

        this.setState({
            loading:false,
            dataToPush:dataToPush,
        })
    }

    getJobRejectionSettings = async() =>{
        return fetch("/jobRejectionRequest/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => {
            return res.json();
        })
    }

    getJobSettings = async() =>{
        return fetch("/jobs/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => {
            return res.json();
        })
    }
    
    handleClose = (event) =>{
        if(event.currentTarget !== event.target){
            return;
        }
        this.setState({
            currentStep:0,
        })
        event.stopPropagation();
        this.props.closeModal();
    }

    handleOnChange = (field, value) => {
        var dataToPush = this.state.dataToPush;
        dataToPush[field] = value;
        this.setState({
            dataToPush:dataToPush,
        })
    }
    
    handleRejectSubmit = async () =>{
        this.setState({
            loading:true,
        })
        await this.postJobRejectionRequest().then((res)=>{
            if(res.success){
               
                this.setState({
                    status: {success: res.success, message:"Request submitted successfully!"},
                    loading:false,
                    dataToPush:res.data[0],
                })
            }else{
                this.setState({
                    status: {success: res.success, message:"Request Failed! " + res.message},
                    loading:false,
                })
            }
        })
    }

    handleDeleteSubmit = async () =>{
        this.setState({
            loading:true,
        })
        var dataToPush = this.state.dataToPush;
        await this.deleteJobRejectionRequest().then((res)=>{
            console.log(res);
             
            Object.keys(this.state.settings.fieldSettings).map(
                (key)=>{
                    dataToPush[key] = "";
                }
            )

            Object.keys(dataToPush).map(
                (key)=>{
                    dataToPush[key] = this.props.job[key];
                }
            )
            
            if(res.success){
                this.setState({
                    status: {success: res.success, message:"Request deleted successfully!"},
                    loading:false,
                    dataToPush:dataToPush,
                })
            }else{
                this.setState({
                    status: {success: res.success, message:"Request Failed! " + res.message},
                    loading:false,
                })
            }
        })
    }

    handleRequestUpdate = async(status) =>{
        this.setState({
            loading:true,
        })

        var dataToPush = this.props.job;
        dataToPush["status"] = status;
        await this.updateJobRejectionRequest().then((res)=>{
            console.log(res);
            if(res.success){
                if(status === "Approved"){
                this.setState({
                    status: {success: res.success, message:"Request updated successfully! Select a new staff member to assign the job to."},
                    loading:false,
                    currentStep:1,
                })
                }else{
                    this.setState({
                        status: {success: res.success, message:"Request updated successfully!"},
                        loading:false,
                    })
                    
                    this.props.closeModal();
                }
            }else{
                this.setState({
                    status: {success: res.success, message:"Request Failed! " + res.message},
                    loading:false,
                })
            }
        })
    }

    handleJobReassignment = async() =>{
        this.setState({
            loading:true,
        })
        await this.updateJob().then((res)=>{
            console.log(res);
            if(res.success){
                this.setState({
                    status: {success: res.success, message:"Job updated successfully!"},
                    loading:false,
                })
                this.props.requestRefresh();
                this.props.closeModal();
            }else{
                this.setState({
                    status: {success: res.success, message:"Request Failed! " + res.message},
                    loading:false,
                })
            }
        })
    }

    updateJobRejectionRequest = async() =>{
        var dataToPush = this.props.job;
        return fetch("/jobRejectionRequest/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToPush),
        }).then(res => {
            return res.json();
        })
    }

    updateJob = async () =>{
        var dataToPush = this.state.dataToPush;
        return fetch("/jobs/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToPush),
        }).then(res => {
            return res.json();
        })
    }

    render(){
        return(
        this.props.job ? 
            <div className="modalPopUp" onClick={this.handleClose}>
                {this.state.loading ? 
                <Loading/>
                :
                <div className="modal">
                    {this.state.currentStep === 0 ?
                    
                    <div className="modal-header">
                        <div className="modal-title">
                            {this.props.job.jobName}
                        </div>
                        <div className="modal-close">
                            <i className="bi bi-x-lg" onClick={this.handleClose}></i>
                        </div>
                    </div>:
                    
                    <div className="modal-header">
                        <div className="modal-title">
                            {this.props.job.jobName}
                        </div>
                        <div className="modal-close">
                            <i className="bi bi-arrow-bar-left" onClick={()=>{this.setState({
                                currentStep:0,
                            })}}></i>
                        </div>
                    </div>}
                    {this.state.status ? <div className={"alert " + (this.state.status.success ? "alert-success" : "alert-danger")} role="alert">{this.state.status.message}</div> : null}
                    <div className="modal-body">
                    <MultiStepBox currentStep={this.state.currentStep} steps={this.steps}>
                        <div className="modal-fields">
                            
                            {
                            Object.keys(this.state.rejSettings.fieldSettings).map((field)=>{
                                return (
                                    this.state.requestExcludes.includes(field) ?
                                    ""
                                    :
                                    <StdInput 
                                        label={this.state.rejSettings.fieldSettings[field].displayLabel} 
                                        value={this.props.job[field]}
                                        enabled={false}
                                        type={this.state.rejSettings.fieldSettings[field].type}
                                        options={this.state.rejSettings.fieldSettings[field].options}
                                    ></StdInput>
                                )
                                
                            })}
                            {this.props.job.status === "Pending" ?
                            
                            <StdButton onClick={()=>this.handleRequestUpdate("Approved")}
                            >Approve</StdButton>
                            
                            :
                            ""}
                            {this.props.job.status === "Pending" ?
                            
                            <StdButton onClick={()=>this.handleRequestUpdate("Rejected")}
                            >Reject</StdButton>
                            :
                            ""}
                        </div>

                        <div className="modal-fields">
                            {Object.keys(this.state.jobSettings.fieldSettings).map((field)=>{
                                return (
                                    this.state.jobExcludes.includes(field) ?
                                    ""
                                    :
                                    <StdInput 
                                        label={this.state.jobSettings.fieldSettings[field].displayLabel} 
                                        enabled={field != "staffID" ? false : true}
                                        type={this.state.jobSettings.fieldSettings[field].type}
                                        options={this.state.jobSettings.fieldSettings[field].options}
                                        value={this.props.job[field]}
                                        fieldLabel={field}
                                        onChange={this.handleOnChange}
                                        maxItems= {5}
                                    ></StdInput>
                                )
                                
                            })}
                            <StdButton onClick={this.handleJobReassignment}
                            >Submit</StdButton>
                        </div>
                        </MultiStepBox>
                    </div>
                </div>
                }
            </div>
        : 
            
            <div style={{display:"none"}}></div>
        )
    }
}