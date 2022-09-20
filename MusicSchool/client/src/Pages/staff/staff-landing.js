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

    state={
        items: {
            "20-09-2022": {
                "8:00": "BREAK",
                "8:30":"Lesson 1",
                "9:00":"Lesson 2",
                "9:30":"Lesson 3",
                "10:00":"Lesson 4",
                "10:30":"Lesson 5",
                "11:00":"Lesson 6",
                "11:30":"Lesson 7",
                "12:00":"Lesson 8",
                "12:30":"Lesson 9",
                "13:00":"Lesson 10",
                "13:30":"Lesson 11",
                "14:00":"Lesson 12",
                "14:30":"Lesson 13",
                "15:00":"Lesson 14",
                "15:30":"Lesson 15",
                "16:00":"Lesson 16",
                "16:30":"Lesson 17",
                "17:00":"Lesson 18",
                "17:30":"Lesson 19",
                "18:00":"Lesson 20",
                "18:30":"Lesson 21",
                "19:00":"Lesson 22",
                "19:30":"Lesson 23",
                "20:00":"Lesson 24",
                "20:30":"Lesson 25",

            }
        }
    }

    render(){
        return(
            <div className={"cardBg"}>
                <div className="cardHeader">This week's schedule</div>
                <WeekView items ={this.state.items}></WeekView>

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