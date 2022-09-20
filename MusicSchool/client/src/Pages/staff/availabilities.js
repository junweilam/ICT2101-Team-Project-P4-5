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

    state={
        items: {
            "18-09-2022": {
                "8:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "8:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "9:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "9:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "10:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "10:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "11:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "11:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "12:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "12:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "13:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "13:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "14:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "14:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "15:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "15:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "16:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "16:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "17:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "17:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "18:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "18:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "19:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "19:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "20:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "20:30": Math.random() > 0.5 ? "Available" : "Unavailable",
            },

            "19-09-2022": {
                
                "8:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "8:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "9:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "9:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "10:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "10:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "11:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "11:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "12:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "12:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "13:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "13:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "14:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "14:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "15:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "15:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "16:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "16:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "17:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "17:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "18:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "18:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "19:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "19:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "20:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "20:30": Math.random() > 0.5 ? "Available" : "Unavailable",
            },

            "20-09-2022": {
                "8:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "8:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "9:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "9:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "10:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "10:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "11:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "11:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "12:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "12:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "13:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "13:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "14:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "14:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "15:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "15:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "16:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "16:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "17:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "17:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "18:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "18:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "19:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "19:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "20:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "20:30": Math.random() > 0.5 ? "Available" : "Unavailable",
            },
            "21-09-2022": {
                "8:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "8:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "9:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "9:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "10:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "10:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "11:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "11:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "12:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "12:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "13:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "13:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "14:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "14:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "15:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "15:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "16:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "16:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "17:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "17:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "18:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "18:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "19:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "19:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "20:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "20:30": Math.random() > 0.5 ? "Available" : "Unavailable",
            },
            "22-09-2022": {
                
                "8:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "8:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "9:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "9:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "10:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "10:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "11:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "11:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "12:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "12:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "13:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "13:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "14:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "14:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "15:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "15:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "16:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "16:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "17:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "17:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "18:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "18:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "19:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "19:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "20:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "20:30": Math.random() > 0.5 ? "Available" : "Unavailable",
            },
            "23-09-2022": {
                
                "8:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "8:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "9:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "9:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "10:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "10:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "11:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "11:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "12:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "12:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "13:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "13:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "14:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "14:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "15:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "15:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "16:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "16:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "17:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "17:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "18:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "18:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "19:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "19:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "20:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "20:30": Math.random() > 0.5 ? "Available" : "Unavailable",
            },
            "24-09-2022": {
                
                "8:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "8:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "9:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "9:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "10:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "10:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "11:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "11:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "12:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "12:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "13:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "13:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "14:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "14:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "15:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "15:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "16:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "16:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "17:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "17:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "18:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "18:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "19:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "19:30": Math.random() > 0.5 ? "Available" : "Unavailable",
                "20:00": Math.random() > 0.5 ? "Available" : "Unavailable",
                "20:30": Math.random() > 0.5 ? "Available" : "Unavailable",
            },
        }
    }

    render(){
        return(
            <div className={"cardBg"}>
                <div className="cardHeader">This week's availabilities</div>
                <WeekView items={this.state.items}></WeekView>

            </div>
        )
    }
}