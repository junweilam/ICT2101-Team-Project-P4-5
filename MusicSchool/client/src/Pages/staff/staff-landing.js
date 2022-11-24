import moment from "moment"
import React from "react"
import { AppPageContainer,Loading } from "../../Components/appCommon"
import { MonthView, MultiStepBox, StdButton, WeekView } from "../../Components/common"
import { StdInput } from "../../Components/input"

import "../../styles/staff.scss"

import DrumImg from "../../Assets/instrumenticons/drum.png"
import PianoImg from"../../Assets/instrumenticons/piano.png"
import TrumpetImg from "../../Assets/instrumenticons/trumpet.png"
import ViolinImg from "../../Assets/instrumenticons/violin.png"
import AnyInstrumentImg from "../../Assets/instrumenticons/music-instrument.png"

export default class staffLanding extends React.Component{

    state={
        loading:true
    }

    componentDidMount = async() =>{
        await this.getJobs().then((jobs)=>{
            console.log(jobs);
            this.setState({
                jobs:jobs.data,
            });
        })

        await this.getUnavailabilities().then((unavailabilities)=>{
            console.log(unavailabilities);
            this.setState({
                unavailabilities:unavailabilities.data,
            });
        })

        await this.getJobPreferences().then((preferences)=>{
            console.log(preferences);
            this.setState({
                preferences:preferences.data,
            });
        })

        await this.getJobSettings().then((settings)=>{
            console.log(settings);
            this.setState({
                settings:settings.settings,
            });
        })

        this.getWeekHours();
        this.getMonthHours();

        this.setState({
            loading:false,
        })
    }

    getJobs = async() =>{
        return fetch("/jobs/allJobsForStaff", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid:this.props.user.data[0].uid}), 
        }).then(res => {
            return res.json();
        })
    }

    getJobPreferences = async() =>{
        return fetch("/jobPreferences/allPreferencesForUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid:this.props.user.data[0].uid}), 
        }).then(res => {
            return res.json();
        })
    }

    getUnavailabilities = async() =>{
        return fetch("/unavailabilities/allUnavailabilitiesForUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid:this.props.user.data[0].uid}), 
        }).then(res => {
            return res.json();
        })
    }

    getJobSettings = async() => {
        return fetch("/jobs/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => {
            return res.json();
        })
    }

    getWeekHours = () => {
        let hours = 0;
        var currentWeekStart = moment().startOf('week');
        var currentWeekEnd = moment().endOf('week');
        this.state.jobs.forEach((job)=>{
            if(moment(job.jobDate).isBetween(currentWeekStart,currentWeekEnd)){
                hours += 0.5;
            }
        }
        )
        this.setState({
            weekHours:hours,
        })
    }

    getMonthHours = () => {
        let hours = 0;
        var currentMonthStart = moment().startOf('month');
        var currentMonthEnd = moment().endOf('month');
        this.state.jobs.forEach((job)=>{
            if(moment(job.jobDate).isBetween(currentMonthStart,currentMonthEnd)){
                hours += 0.5;
            }
        }
        )
        this.setState({
            monthHours:hours,
        })
    }

    getJobsAfterTodayIncludingToday = () => {
        let jobs = [];
        this.state.jobs.forEach((job)=>{
            if(moment(job.jobDate).isSameOrAfter(moment())){
                jobs.push(job);
            }
        })
        return jobs;
    }

    showModal = (e) =>{
        this.setState({
            content:this.state.jobs.find((job)=>job.jid===e)
        })
    }

    closeModal = () =>{

        this.setState({
            content:undefined
        })
    }

    render(){
        return(
            this.state.loading ?
            <Loading/>
            :
            <AppPageContainer gap={15}>

            <div className="staff-landing-overview">
                
                <div className={"card-bg week-hours"}>
                    <div className="header">This week's hours</div>
                    <div className={"body"}>
                        <span className="hour-label">{this.state.weekHours + " hours / 40 hours"}</span>
                        <div className="hour-bar" style={{"--scaleVal" : (this.state.weekHours / 40 * 1)}}></div>
                    </div>
                </div>
                <div className={"card-bg month-hours"}>
                    <div className="header">This month's hours</div>
                    <div className={"body"}>
                        <span className="hour-label">{this.state.monthHours + " hours / 160 hours"}</span>
                        <div className="hour-bar" style={{"--scaleVal" : (this.state.monthHours / 160 * 1)}}></div>
                    </div>
                </div>
                <div className={"card-bg upcoming no-pad"}>
                    <div className="header">Upcoming Jobs</div>
                    <div className={"body"}>
                        {this.getJobsAfterTodayIncludingToday().map((job)=>{
                            return(
                                <div className="job-list-tile" onClick={()=>this.showModal(job.jid)}>
                                    <span className="tile-title">{job.jobName}</span>
                                    <span className="tile-datetime">
                                        {moment(job.jobDate).format("dddd, DD-MM-YYYY")}
                                        {moment(job.jobTime,"HH:mm").format(" HH:mm a")}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <JobPreferences preferences={this.state.preferences}>

            </JobPreferences>
            <div className="col-12">
                <WeekSchedule data={this.state.jobs} unavailabilities={this.state.unavailabilities} showModal={this.showModal}></WeekSchedule>
            </div>
            <div className="col-12">
                <MonthSchedule data={this.state.jobs}></MonthSchedule>
            </div>
            <div className="row gy-4">
            </div>

            {this.state.content && 
            <JobModal job={this.state.content} closeModal={this.closeModal} settings={this.state.settings}></JobModal>
            }
            </AppPageContainer>
        )
    }
}

export class JobPreferences extends React.Component{
    state={
        startDay : moment().startOf('week'),
        endDay : moment().endOf('week'),
        calendar : [],
    }

    componentDidMount(){
        console.log(this.props.preferences);
        this.setState({
            calendar:this.generateCalendar()
        });
    }

    generateCalendar = () =>{
        let calendar = [];
        let day = this.state.startDay;
        let endDay = day.clone().add(6,'days');
        this.setState({
            endDay:endDay
        })
        while(day.isSameOrBefore(endDay)){
            calendar.push(day);
            day = day.clone().add(1,'d');
        }
        return calendar;
    }

    nextWeek = async() => {
        await this.setState({
            startDay:moment(this.state.startDay).add(7,'days'),
        })

        this.setState({
            calendar:this.generateCalendar()
        });
    }

    prevWeek = async() => {
        await this.setState({
            startDay:moment(this.state.startDay).subtract(7,'days'),
        })

        this.setState({
            calendar:this.generateCalendar()
        });
    }

    render(){
        return(

            <div className="col-12">
                <div className="jobPreferences card-bg">
                    <div className="header">Job Preferences</div>
                    <div className="weekController">
                        
                        <div className="weekLabel">
                            {moment(this.state.startDay).format("DD-MM-YYYY")} - {moment(this.state.endDay).format("DD-MM-YYYY")}
                        </div>
                        <div className="weekControls">
                        <div className="prevWeek" onClick={this.prevWeek}>
                            <i className="bi bi-chevron-left"></i>
                        </div>
                        <div className="nextWeek" onClick={this.nextWeek}>
                            <i className="bi bi-chevron-right"></i>
                        </div>
                        </div>
                    </div>
                    <div className="body days">
                        {this.state.calendar.map((day)=>{
                            var pref = this.props.preferences.find((pref)=>pref.date===day.format("DD-MM-YYYY"));
                            var icon = <i className="fa-solid fa-question"></i>;
                                            
                            
                            

                            console.log(icon);
                            return <div className="preference-tile">
                                <div className="day">
                                    <span className="day-label">
                                    {day.format("DD, ")}
                                    {day.format("ddd")}
                                    </span>
                                    {  
                                        pref === undefined ?
                                        <div className="instrumentIcon">
                                            <img src = {AnyInstrumentImg}></img>
                                        </div>
                                        :
                                        pref.type === "Piano" ?
                                        <div className="instrumentIcon">
                                            <img src = {PianoImg}></img>
                                        </div>
                                        :
                                        pref.type === "Violin" ?
                                        <div className="instrumentIcon">
                                            <img src = {ViolinImg}></img>
                                        </div>
                                        :
                                        pref.type === "Drum" ?
                                        <div className="instrumentIcon">
                                            <img src = {DrumImg}></img>
                                        </div>
                                        :
                                        pref.type === "Trumpet" ?
                                        <div className="instrumentIcon">
                                            <img src = {TrumpetImg}></img>
                                        </div>
                                        :
                                        ""
                                    }
                                </div>
                                <span className="instrument">
                                    {pref === undefined ? 
                                    "Any"
                                    :
                                    pref.type}
                                </span>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export class WeekSchedule extends React.Component{

    state={
    }

    render(){
        return(
            <div className={"card-bg no-pad"}>
                <div className="header">This week's schedule</div>
                <div className="body">

                    <WeekView showDate={true} timeField={"jobDate"} maxTimeSlot={6} cellComponent={
                    <EventCell 
                    onCellClick={this.props.showModal} 
                    items={this.props.data}
                    unavailabilities={this.props.unavailabilities}
                    ></EventCell>
                    }></WeekView>
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
        var unavailabilities = this.findUnavailabilities();
        this.setState({
            job:jobs,
            unavailability:unavailabilities,
        })
    }

    
    render(){
        if(this.state.job){
            return (
                
                <div className="event" onClick={()=>this.props.onCellClick(this.state.job.jid)}>{this.state.job.jobName}</div>
            )
        }

        if(this.state.unavailability){
            return (
                <div className="event unavailable">Unavailable</div>
            )
        }

        return(
            <div className="event"></div>
        )
    }
}


export class MonthSchedule extends React.Component{
    state={
        month: moment(new Date())
    }

    nextMonth = () =>{
        this.setState({
            month: moment(this.state.month, "MM").add(1, "month").format("MM")
        })
    }

    prevMonth = () =>{
        this.setState({
            month: moment(this.state.month, "MM").subtract(1, "month").format("MM")
        })
    }

    render(){
        return(
            <div className={"card-bg no-pad"}>
                <div className="header">Overall Month Schedule</div>
                <MonthView cellComponent={<MonthCell items={this.props.data}></MonthCell>}></MonthView>
            </div>
        )
    }
}

class MonthCell extends React.Component{
    state={
        index: this.props.index,
    }

    findJobs = () =>{
        var count = 0;
        var indexDateTime = moment(this.props.index,"YYYY-MM-DD").format("YYYY-MM-DD");
        this.props.items.map((item)=>{
            var jobDateTime = moment(item.jobDate, "YYYY-MM-DDTHH:mm").format("YYYY-MM-DD");
            if(jobDateTime === indexDateTime){
                count++;
            }
        })

        console.log();
        var dateInCurMonth = (moment(this.props.index).format("MM") === moment(this.props.currentMonth, "MM").format("MM"));
        this.setState({
            count:count,
            dateInCurMonth:dateInCurMonth
        })
    }

    componentDidUpdate(prevProps){
        if(prevProps.index !== this.props.index){
            this.setState({
                index:this.props.index,
            })
            this.findJobs();
        }

    }

    componentDidMount = () =>{
        this.findJobs();
    }
    render(){
        return(

            <div className="month-day-cell">
                <span className={"cell-date-number " + (this.state.dateInCurMonth ? "" : "nextprevMth")}>{this.state.index.split("-")[2]}</span>
                {this.state.count > 0 ? 
                <div className="cell-jobcount">{this.state.count + " Job(s)"}</div>
                :
                <div className="cell-jobcount"></div>}
            </div>
        )
    }
}

class JobModal extends React.Component{
    steps = {
        0:"Job Details",
        1:"JobRejectionRequest"
    }
    state={
        jobExcludes: ["jobName","jid"],
        requestExcludes: ["jrrid","status","requestCreatedOn","requestUpdatedOn"],
        currentStep: 0,
        loading:true,
        status: "",
    }

    componentDidMount = async () =>{
        var dataToPush = {};

        

        await this.getJobRejectionSettings().then(async (settings)=>{
            console.log(settings);
            Object.keys(settings.settings.fieldSettings).map(
                (key)=>{
                    dataToPush[key] = "";
                }
            )

            await this.getJobRejection().then((data)=>{
                if(data.data.length > 0){
                    dataToPush = data.data[0];
                }
            })

            dataToPush["jobID"] = this.props.job.jid;
            dataToPush["staffID"] = this.props.job.staffID;

            this.setState({
                settings:settings.settings,
                dataToPush:dataToPush,
            })
        })

        this.setState({
            loading:false,
        })
    }

    getJobRejection = async() => {
        return fetch("/jobRejectionRequest/getRequestsByJobIDandStaffID", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({jobID:this.props.job.jid, staffID:this.props.job.staffID}), 
        }).then(res => {
            return res.json();
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

            dataToPush["jobID"] = this.props.job.jid;
            dataToPush["staffID"] = this.props.job.staffID;

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

    postJobRejectionRequest = async () =>{
        return fetch("/jobRejectionRequest/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.dataToPush),
        }).then(res => {
            return res.json();
        })
    }

    deleteJobRejectionRequest = async () =>{
        return fetch("/jobRejectionRequest/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({jrrid:this.state.dataToPush.jrrid}), 
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
                            Object.keys(this.props.settings.fieldSettings).map((field)=>{
                                return (
                                    this.state.jobExcludes.includes(field) ?
                                    ""
                                    :
                                    <StdInput 
                                        label={this.props.settings.fieldSettings[field].displayLabel} 
                                        value={this.props.job[field]}
                                        enabled={false}
                                        type={this.props.settings.fieldSettings[field].type}
                                        options={this.props.settings.fieldSettings[field].options}
                                    ></StdInput>
                                )
                                
                            })}
                            <StdButton onClick={()=>this.setState({
                                currentStep:1
                            })}
                            >Reject Job</StdButton>
                        </div>

                        <div className="modal-fields">
                            {Object.keys(this.state.settings.fieldSettings).map((field)=>{
                                return (
                                    this.state.requestExcludes.includes(field) ?
                                    ""
                                    :
                                    <StdInput 
                                        label={this.state.settings.fieldSettings[field].displayLabel} 
                                        enabled={field == "reason" ? true : false}
                                        type={this.state.settings.fieldSettings[field].type}
                                        options={this.state.settings.fieldSettings[field].options}
                                        value={this.state.dataToPush[field]}
                                        fieldLabel={field}
                                        onChange={this.handleOnChange}
                                    ></StdInput>
                                )
                                
                            })}
                            {this.state.dataToPush.jrrid !== "" ? 
                            
                            <StdButton onClick={this.handleDeleteSubmit}
                            >Cancel Request</StdButton>:
                            
                            <StdButton onClick={this.handleRejectSubmit}
                            >Submit</StdButton>}
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