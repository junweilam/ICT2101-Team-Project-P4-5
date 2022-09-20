import moment from "moment"
import React from "react"
import { MonthView, WeekView } from "../../Components/common"

export default class staffLanding extends React.Component{
    render(){
        return(
            <div className="container-fluid col-lg-6 col-12 justify-content-center">
                <div className="row gy-4">
                    <div className="col-12">
                        <WeekSchedule></WeekSchedule>
                    </div>
                    <div className="col-12">
                        <MonthSchedule></MonthSchedule>
                    </div>
                </div>

            </div>
        )
    }
}

export class WeekSchedule extends React.Component{
    render(){
        return(
            <div className={"cardBg"}>
                <div className="cardHeader">This week's schedule</div>
                <WeekView></WeekView>

            </div>
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