import React from "react"
import DatapageLayout from "../PageLayout"
import { WeekView } from "../../Components/common"
import moment from "moment"
import {Loading } from "../../Components/appCommon"

import {MultiStepBox, StdButton} from "../../Components/common"

import {StdInput} from "../../Components/input"

import "../../styles/manager.scss"
import "../../styles/appCommon.scss"
import { JobPreferences } from "../staff/staff-landing"
import e from "cors"

export default class JobAllocation extends React.Component{
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
    this.setState({
        loading:true
    })
    await this.getContent().then((content)=>{
        console.log(content);
        this.setState({
            content:content,
        });
    })

    await this.getUnavailabilities().then((unavailabilities)=>{
        console.log(unavailabilities);
        this.setState({
            unavailabilities:unavailabilities.data,
        });
    })

    await this.getPreferences().then((preferences)=>{
        console.log(preferences);
        this.setState({
            preferences:preferences.data,
        });
    });

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


    await this.getSettings().then((settings)=>{
        console.log(settings);
        this.setState({
            settings:settings.settings,
        });
    })

    this.setState({
        loading:false,
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
    this.componentDidMount();
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
            <button className="jobCreation-toggle">
                <span className="jobCreation-toggle-label">Create Job</span>
                <CreateJobForm
                    jobs={this.state.jobs}
                    preferences = {this.state.preferences}
                    unavailabilities = {this.state.unavailabilities}
                    requestRefresh={this.requestRefresh}
                ></CreateJobForm>
            </button>
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

class CreateJobForm extends React.Component{
    state={
        loading:true,
        excludes: ["jid", "staffID"],
        instruments: [],
        dataToPush: {},
        staff: [],
        showEligibleStaff: false,
        viewMoreStaff: false,
    }
    componentDidMount = async() =>{
        await this.getJobSettings().then((settings)=>{
            console.log(settings);
            var dataToPush = {};
            Object.keys(settings.settings.fieldSettings).forEach((key)=>{
                dataToPush[key] = "";
            })
            this.setState({
                dataToPush:dataToPush,
                settings:settings.settings,
            });
        })

        await this.getStaff().then((staff)=>{
            console.log(staff);
            this.setState({
                staff:staff.data,
            })
        })

        this.setState({
            loading:false,
        })
    }

    getStaff = async () =>{
        return fetch("/users/allUsersOfRole" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({role:"staff"})
        }).then(res => {
            return res.json();
        });
    }

    getJobSettings = async () => {
        return fetch("/jobs/settings" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => {
            return res.json();
        })
    }

    handleOnChange = (field,e) =>{

        console.log(field,e);

        var dataToPush = this.state.dataToPush;
        dataToPush[field] = e;

        if(field === "studioID"){
            var instruments = this.state.settings.fieldSettings.instrumentID.options.filter((instrument)=>{
                console.log(instrument);
                return parseInt(instrument.studio) === parseInt(e);
            });
            console.log(instruments)
            this.setState({
                instruments:instruments,
            })
        }

        if(field === "jobDate"){
            if(dataToPush["jobTime"] !== "" && dataToPush["instrumentID"] !== ""){
                this.findEligibleStaff();
            }
        }

        if(field === "jobTime"){
            if(dataToPush["jobDate"] !== "" && dataToPush["instrumentID"] !== ""){
                this.findEligibleStaff();
            }
        }

        if(field === "instrumentID"){
            if(dataToPush["jobDate"] !== "" && dataToPush["jobTime"] !== ""){
                this.findEligibleStaff();
            }
        }

        this.setState({
            dataToPush:dataToPush,
        })
    }

    findEligibleStaff = () =>{
        var jobDate = this.state.dataToPush.jobDate;
        var jobTime = this.state.dataToPush.jobTime;
        
        var staffIDs = [];

        var staffsWithJobsAtProvidedDateTime = this.props.jobs.filter((job)=>{
            return job.jobDate == jobDate && job.jobTime == jobTime;
        }).map((job)=>{
            if(!staffIDs.includes(job.staffID)){
                staffIDs.push(job.staffID);
            }
        });

        var staffsWithUnavailabilitiesAtProvidedDateTime = this.props.unavailabilities.filter((unavailability)=>{
            return moment(unavailability.unavailableOn,"DD-MM-YYYY HH:mm").format("YYYY-MM-DD HH:mm") === moment(jobDate + " " + jobTime).format("YYYY-MM-DD HH:mm");
        }).map((unavailability)=>{
            if(!staffIDs.includes(unavailability.uid)){
                staffIDs.push(unavailability.uid);
            }
        });

        var staffsWithMisMatchedPreferences = this.props.preferences.filter((preference)=>{
            return preference.type != this.state.instruments.find((instrument)=>{
                return instrument.value == this.state.dataToPush.instrumentID;
            }).label.split(" ")[0] && preference.date == moment(jobDate,"YYYY-MM-DD").format("DD-MM-YYYY");
        }).map((preference)=>{
            if(!staffIDs.includes(preference.uid)){
                staffIDs.push(preference.uid);
            }
        })

        console.log(staffsWithMisMatchedPreferences);

        var eligibleStaff = this.state.staff.filter((staff)=>{
            return !staffIDs.includes(staff.uid);
        }).sort((a,b)=>{
            return a.hours - b.hours;
        });

        console.log(eligibleStaff);


        if(staffIDs.includes(this.state.dataToPush.staffID)){
            var dataToPush = this.state.dataToPush;
            dataToPush.staffID = "";
            this.setState({
                dataToPush:dataToPush,
            })
        }

        this.setState({
            staffIDs:eligibleStaff,
            showEligibleStaff:true,
        })
        
    }

    validate = () => {
        var dataToPush = this.state.dataToPush;

        try{
            Object.keys(dataToPush).forEach((key)=>{
                console.log(key);
                if(this.state.excludes.includes(key) && key != "staffID"){
                    return;
                }else{
                    if(dataToPush[key] == "" || dataToPush[key] === undefined || dataToPush[key] === null){
                        throw {valid:false, error:this.state.settings.fieldSettings[key].displayLabel + " is empty!"};
                    }
                }
            })
        }catch(e){
            return e;
        }

        var jobsForUser = this.props.jobs.filter((job)=>{
            return job.staffID === dataToPush.staffID;
        })

        var unavailabilitiesForUser = this.props.unavailabilities.filter((unavailability)=>{
            return unavailability.uid === dataToPush.staffID;
        })

        var valid = true;
        var error = "";
        var dataToPushJobDate = moment(dataToPush.jobDate).format("YYYY-MM-DD");
        var dataToPushJobTime = moment(dataToPush.jobTime).format("HH:mm");
        var overlappingJob = jobsForUser.find((job)=>{
            return job.jobDate == dataToPushJobDate && job.jobTime == dataToPushJobTime;
        })

        if(overlappingJob !== undefined){
            valid = false;
            error = "Staff already has a job at this time!";
            return {valid:valid, error:error};
        }

        unavailabilitiesForUser.map((item)=>{
            var itemDate = moment(item.unavailableOn, "DD-MM-YYYY HH:mm").format("YYYY-MM-DD");
            var itemTime = moment(item.unavailableOn, "DD-MM-YYYY HH:mm").format("HH:mm");
            if(dataToPushJobDate == itemDate && dataToPushJobTime == itemTime){
                valid = false;
                error = "Staff member is unavailable";
                return {valid:valid, error:error};
            }
        })
        return {valid:valid,error:error};
    }

    handleJobCreation =() =>{
        var validity = this.validate();
        validity.valid ?
        this.createJob().then((content)=>{
            console.log(content);
            if(content.success){
                this.setState({
                    error:"Job created successfully!",
                })
                this.props.requestRefresh();
            }else{
                this.setState({
                    error:content.message,
                })
            }
        })
        :
        this.setState({
            error:validity.error,
        })
    }

    createJob = async () => {
        return fetch("/jobs/create" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.dataToPush)
        }).then(res => {
            return res.json();
        })
    }

    handleCellClick = (e) =>{
        var dataToPush = this.state.dataToPush;
        var date = moment(e, "DD-MM-YYYY HH:mm").format("YYYY-MM-DD");
        var time = moment(e, "DD-MM-YYYY HH:mm").format("H:mm");
        dataToPush["jobDate"] = date;
        dataToPush["jobTime"] = time;
        this.setState({
            dataToPush:dataToPush,
        })

        if(this.state.dataToPush.instrumentID != "" ){
        
            this.findEligibleStaff();

        }
    }

    render(){
        return(

            this.state.loading?
            <div className="jobCreationForm">
                <Loading></Loading>
            </div>
            :
            <div className="jobCreationForm">
                <div className="jobCreationForm-fields" ref={"jobCreationForm-left"}>
                    {this.state.error &&
                    <div className="alert alert-danger">
                        {this.state.error}
                    </div>
                    }
                    {Object.keys(this.state.settings.fieldSettings).map((key, index) => {
                        return(
                            this.state.excludes.includes(key)?
                            ""
                            :
                            <StdInput
                                label={this.state.settings.fieldSettings[key].displayLabel}
                                type={this.state.settings.fieldSettings[key].type}
                                onChange={this.handleOnChange}
                                options={key === "instrumentID" ? this.state.instruments : this.state.settings.fieldSettings[key].options}
                                enabled={this.state.settings.fieldSettings[key].editable}
                                value={this.state.dataToPush[key]}
                                fieldLabel={key}
                                maxItems={5}
                                allowEmpty={true}
                            ></StdInput>
                        )
                    })}

                    {this.state.showEligibleStaff &&
                        <div className="eligibleStaff">
                            <div className="eligibleStaff-label">Eligible staff:</div>
                            <div className="eligibleStaffList">
                            {this.state.staffIDs.slice(0,this.state.viewMoreStaff ? undefined : 3).map((staff)=>{
                            return(
                                <div className={"eligibleStaff-Chip " + (this.state.dataToPush.staffID === staff.uid ? "active" : "")}>
                                    <input type="radio" id={"staffID-" + staff.uid} className="eligibleStaff-radio" name="staffID" onChange={()=>{this.handleOnChange("staffID",staff.uid)}}>
                                    
                                    </input>
                                    <label className="eligibleStaff-chip-label" htmlFor={"staffID-" + staff.uid}>
                                        <span className="label-name">
                                            {staff.name}
                                        </span>
                                        <span className="label-hours">
                                            {staff.hours} hours
                                        </span>
                                    </label>
                                </div>
                            )
                            })}

                                <div className="eligibleStaff-view-more" onClick={()=>{this.setState({
                                    viewMoreStaff:!this.state.viewMoreStaff
                                    })}}>
                                    {this.state.viewMoreStaff ? 
                                        <div><i className="bi bi-dash"></i> <span>View Less</span></div>
                                    :
                                        <div><i className="bi bi-plus"></i> <span>View More</span></div>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className="jobCreationForm-staffSchedule">
                    {this.state.dataToPush["staffID"] != "" ? 
                    <WeekSchedule 
                    sid ={this.state.dataToPush["staffID"]} 
                    data = {this.props.jobs} 
                    header={(this.state.staff.find((staff)=>{
                        return staff.uid == this.state.dataToPush["staffID"]
                    })).name + "'s Schedule"}
                    unavailabilities = {this.props.unavailabilities}
                    onCellClick = {this.handleCellClick}
                    maxTimeSlots = {8}
                    />
                    
                    :
                    <WeekSchedule 
                    sid ={[]} 
                    data = {[]} 
                    header={"Select a staff member to view their schedule"}
                    unavailabilities = {[]}
                    onCellClick = {this.handleCellClick}
                    maxTimeSlots = {8}
                    />
                    }
                </div>
                <StdButton onClick={this.handleJobCreation}>Create Job</StdButton>
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

    componentDidUpdate = async (prevProps) =>{
        if(prevProps.sid != this.props.sid){
            this.setState({
                loading:true,
            })
            var jobsForUser = await  this.props.data.filter((job)=>
            job.staffID == this.props.sid)
            console.log(jobsForUser)
    
            var unavailabilitiesForUser = await this.props.unavailabilities.filter((unavailability)=>
            unavailability.uid == this.props.sid)
            console.log(unavailabilitiesForUser)
    
            this.setState({
                unavailabilities:unavailabilitiesForUser,
                jobs:jobsForUser,
                loading:false,
            })
        }
    }

    onCellClick = (e) =>{
        if(this.props.onCellClick){
            this.props.onCellClick(e);
        }
    }

    render(){
        return(
            this.state.loading ? 
            <Loading></Loading>
            :
            
            <div className={"card-bg no-pad"}>
                <div className="header">{this.props.header}</div>
                <div className="body">

                    <WeekView showDate={true} timeField={"jobDate"} maxTimeSlot={this.props.maxTimeSlot} cellComponent={
                        <EventCell items={this.state.jobs} unavailabilities={this.state.unavailabilities} onCellClick={this.onCellClick}></EventCell>
                    }></WeekView>
                </div>

            </div>
        )
    }
}
WeekSchedule.defaultProps = {
    maxTimeSlot: 6,
    header: "This week's schedule",
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

    handleOnClick = () =>{
        if(this.props.onCellClick){
            this.props.onCellClick(this.props.index);
        }

    }

    render(){
        if(this.state.job){
            return(
                <div className="event" onClick={this.handleOnClick}>{this.state.job.jobName}</div>   
            )   
        }

        if(this.state.unavailability){
            return(
                <div className="event unavailable" onClick={this.handleOnClick}>Unavailable</div>   
            )
        }

        return(
            
            <div className="event" onClick={this.handleOnClick}></div>   
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
                            <StdButton onClick={()=>this.handleRequestUpdate("Approved")}
                            >Approve</StdButton>
                            <StdButton onClick={()=>this.handleRequestUpdate("Rejected")}
                            >Reject</StdButton>
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