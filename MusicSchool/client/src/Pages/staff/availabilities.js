import { rejects } from "assert"
import moment from "moment"
import React from "react"
import { AppPageContainer, Loading } from "../../Components/appCommon"
import { MonthView, WeekView } from "../../Components/common"
import { StdInput } from "../../Components/input"
import {EventCell} from "./staff-landing"

export default class Availabilities extends React.Component{

    state={
        availabilities: [],
        loading: true,
        
    }

    componentDidMount = async() =>{
        await this.getAvailabilities().then((availabilities)=>{
            console.log(availabilities);
            this.setState({
                availabilities:availabilities.data,
            });
        })

        this.setState({
            loading:false,
        })
    }

    getAvailabilities = async() =>{
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

    handleAvailabilityUpdate = async (availability) =>{
        var availabilityObj = {uid:this.props.user.data[0].uid, unavailableOn:availability};

        if(moment(availability, "DD-MM-YYYY HH:mm").isBefore(moment())){
            this.setState({
                error: "Cannot set availability in the past",
            })
            return;
        }

        var res = await fetch("/unavailabilities/toggle",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(availabilityObj),
        }).then(res => {
            return res.json();
        })

        if(res.success){
            this.setState({
                loading:true,
            });
            await this.getAvailabilities().then((availabilities)=>{
                this.setState({
                    availabilities:availabilities.data,
                });
            })

            this.setState({
                loading:false,
            })
        }
        
    }

    initCalendar = (days) =>{
        this.setState({
            days: days,
        })
    }

    nextWeek = (days) =>{
        this.setState({
            days: days
        })
    }

    prevWeek = (days) =>{
        this.setState({
            days: days
        })
    }


    render(){
        return(
            this.state.loading ? <Loading></Loading> :
            
            <AppPageContainer nopad={true}>
                {this.state.error ? <div className="alert alert-danger" role="alert">{this.state.error}</div> : null}
                
                <div className="availabilities-container">
                <JobPreferencesSection uid = {this.props.user.data[0].uid} days={
                    this.state.days
                }>
                </JobPreferencesSection>
                <WeekSchedule 
                data={this.state.availabilities} 
                handleAvailabilityUpdate={this.handleAvailabilityUpdate}
                nextWeek={this.nextWeek}
                prevWeek={this.prevWeek}
                initCalendar={this.initCalendar}
                ></WeekSchedule>
                </div>
            </AppPageContainer>
        )
    }
}

export class JobPreferencesSection extends React.Component{

    state={
        loading: true,
        days : this.props.days
    }

    componentDidUpdate = async() =>{
        if(this.props.days !== this.state.days){
            this.setState({
                days: this.props.days,
            })
        }
    }

    componentDidMount = async() =>{
        await this.getPreferences().then((preferences)=>{
            this.setState({
                preferences: preferences.data,
            });
        });

        await this.getInstrumentTypes().then((instrumentTypes)=>{
            var instrumentOptions = instrumentTypes.options;
            instrumentOptions.unshift({value:"any", label:"Any"});
            console.log(instrumentOptions);
            this.setState({
                instrumentTypes: instrumentOptions,
            })
        });

        this.setState({
            loading:false,
        })
    }

    getPreferences = async() =>{
        return fetch("/jobPreferences/allPreferencesForUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({uid:this.props.uid}), 
        }).then(res => {
            return res.json();
        })
    }

    getInstrumentTypes = async() =>{
        return fetch("/instruments/getInstrumentTypes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => {
            return res.json();
        })
    }

    handleOnchange = async(field, value)=>{
        console.log(field, value);
        var preferenceObj = {uid:this.props.uid, type:value, date:field};

        if(value === "any"){
            var res = await fetch("/jobPreferences/delete",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(preferenceObj),
            }).then(res => {
                return res.json();
            }).then(res=>{
                return res.success;
            })
        }else{
            await fetch("/jobPreferences/create",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(preferenceObj),
            }).then(res => {
                return res.json();
            }).then(res=>{
                return res.success;
            })

            
        }

    }

    render(){
        return(
            this.state.loading ? 
            <Loading></Loading> :
            
            <div className="jobPreferences-container card-bg">
                <div className="header">
                    Job Preferences For {this.state.days[0].fullDateFormat} - {this.state.days[6].fullDateFormat}
                </div>
                <div className="body jobPreferences-days">
                    {this.state.days.map((day)=>{
                        return <StdInput 
                        label={day.day + " " + day.fullDateFormat}
                        type={"dropdown"}
                        hasSaveBtn={true}
                        options={
                            this.state.instrumentTypes
                        }
                        value={
                            this.state.preferences.find((preference)=>{
                                return preference.date === day.fullDateFormat;
                            }
                            ) ? this.state.preferences.find((preference)=>{return preference.date === day.fullDateFormat}).type : "any"
                        }
                        enabled={true}
                        fieldLabel={
                            day.fullDateFormat 
                        }
                        onChange={
                            this.handleOnchange
                        }

                        ></StdInput>
                    })}
                </div>
            </div>
        )
    }

}


export class WeekSchedule extends React.Component{

    nextWeek = (days) =>{
        this.props.nextWeek(days);
    }

    prevWeek = (days) =>{
        this.props.prevWeek(days);
    }

    initCalendar = (days) =>{
        this.props.initCalendar(days);
    }

    render(){
        return(
            <div className={"card-bg no-pad"}>
                <div className="header">This week's availabilities</div>
                <div className="body">

                    <WeekView 
                    timeField={"unavailableOn"} 
                    maxNext = {5} maxPrev={5} 
                    nextWeek={this.nextWeek}
                    prevWeek={this.prevWeek}
                    initCalendar={this.initCalendar}
                    cellComponent = {<AvailabilityCell handleAvailabilityUpdate={this.props.handleAvailabilityUpdate} items={this.props.data} ></AvailabilityCell>}></WeekView>

                </div>
            </div>
        )
    }
}


export class AvailabilityCell extends React.Component{
    state={
        data: this.props.data,

    }
    render(){
        return(
            
            <button className={"availability-cell " + (this.props.items.find(item => item.unavailableOn === this.props.index) ? "active" : "")} onClick={()=>this.props.handleAvailabilityUpdate(this.props.index)}>
                {this.props.items.find(item => item.unavailableOn === this.props.index) ? "Unavailable" : "Available"}
            </button>
            
        )
    }
}