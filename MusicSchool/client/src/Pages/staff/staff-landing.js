import moment from "moment"
import React from "react"
import { AppPageContainer,Loading } from "../../Components/appCommon"
import { MonthView, WeekView } from "../../Components/common"

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

    render(){
        return(
            this.state.loading ?
            <Loading/>
            :
            <AppPageContainer nopad={true}>

            <div className="row gy-4">
                <div className="col-12">
                    <WeekSchedule data={this.state.jobs}></WeekSchedule>
                </div>
                <div className="col-12">
                    <MonthSchedule></MonthSchedule>
                </div>
            </div>

        </AppPageContainer>
        )
    }
}

export class WeekSchedule extends React.Component{

    state={
    }

    render(){
        return(
            <div className={"card-bg"}>
                <div className="header">This week's schedule</div>
                <div className="body">

                    <WeekView timeField={"jobDate"} cellComponent={<EventCell items={this.props.data}></EventCell>}></WeekView>
                </div>

            </div>
        )
    }
}

export class EventCell extends React.Component{

    state={
        index: this.props.index,
        job:{},
    }

    componentDidUpdate(prevProps){
        if(prevProps.index !== this.props.index){
            this.setState({
                index:this.props.index,
            })
            var jobs = this.findJobs();
            this.setState({
                job:jobs,
            })
        }

    }

    findJobs = () =>{
        let jobs = this.props.items.find((item)=>{
            var jobDateTime = moment(item.jobDate,"YYYY-MM-DDTHH:mm").format("YYYY-MM-DD HH:mm");
            var indexDateTime = moment(this.props.index,"DD-MM-YYYY HH:mm").format("YYYY-MM-DD HH:mm");
            return jobDateTime === indexDateTime;
        })
        return jobs;
    }

    componentDidMount = () =>{
        console.log(this.props.index);
        console.log(this.findJobs());
    }
    render(){
        return(
            this.state.job ? 
            
            <div className="event">{this.state.job.jobName}</div>
            : 
            <div className="event">-</div>
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
            <div className={"cardBg"}>
                <div className="cardHeader">Overall Month Schedule</div>
                <MonthView month={this.state.month} nextMonth={this.nextMonth} prevMonth={this.prevMonth}></MonthView>
            </div>
        )
    }
}