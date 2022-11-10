import moment from "moment"
import React from "react"
import { AppPageContainer, Loading } from "../../Components/appCommon"
import { MonthView, WeekView } from "../../Components/common"
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

        if(moment(availability).isBefore(moment())){
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


    render(){
        return(
            this.state.loading ? <Loading></Loading> :
            
            <AppPageContainer nopad={true}>
                {this.state.error ? <div className="alert alert-danger" role="alert">{this.state.error}</div> : null}
                <div className="row gy-4">
                    <div className="col-12">
                        <WeekSchedule data={this.state.availabilities} handleAvailabilityUpdate={this.handleAvailabilityUpdate}></WeekSchedule>
                    </div>
                </div>
            </AppPageContainer>
        )
    }
}



export class WeekSchedule extends React.Component{
    render(){
        return(
            <div className={"card-bg"}>
                <div className="header">This week's availabilities</div>
                <div className="body">

                    <WeekView timeField={"unavailableOn"} maxNext = {5} maxPrev={5} cellComponent = {<AvailabilityCell handleAvailabilityUpdate={this.props.handleAvailabilityUpdate} items={this.props.data} ></AvailabilityCell>}></WeekView>

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