import React from "react"
import { MonthView, WeekView } from "../../Components/common"

export default class Availabilities extends React.Component{
    render(){
        return(
            <div className="container-fluid col-lg-6 col-12 justify-content-center">
                <div className="row gy-4">
                    <div className="col-12">
                        <WeekSchedule></WeekSchedule>
                    </div>
                </div>

            </div>
        )
    }
}



export class WeekSchedule extends React.Component{
    availabilities = {
        "18/09/2021": {
            "8:30": "Unavailable",
            "9:00": "Available",
            "9:30": "Available",
            "10:00": "Available",
            "10:30": "Unavailable",
            "11:00": "Available",
            "11:30": "Available",
            "12:00": "Available",
            "12:30": "Unavailable",
            "13:00": "Available",
            "13:30": "Available",
            "14:00": "Unavailable",
            "14:30": "Available",
            "15:00": "Available",
            "15:30": "Available",
            "16:00": "Unavailable",
            "16:30": "Available",
            "17:00": "Available",
            "17:30": "Available",
            "18:00": "Available",
            "18:30": "Unavailable",
            "19:00": "Available",
            "19:30": "Available",
            "20:00": "Available",
            "20:30": "Available",
            "21:00": "Available",
        }
    }
    render(){
        return(
            <div className={"cardBg"}>
                <div className="cardHeader">This week's availabilities</div>
                <WeekView content={this.availabilities}></WeekView>

            </div>
        )
    }
}