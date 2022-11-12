
import React from "react"
import { ListMapperView } from "../Components/common"
import DatapageLayout from "./PageLayout"
import { Loading } from "../Components/appCommon"

export default class Studios extends React.Component {
    state={
        content:null,
        instruments: [],
        headers:[],
        loading:true,
        settings: {},
        error: "",
    }

    settings ={
        title:"Studios",
        primaryColor: "#48a1da",
        accentColor: "#8fc140",
        textColor: "#ffffff",
        textColorInvert: "#606060",
        api: "/studios/",
    }

    async componentDidMount(){
        await this.getContent().then((content)=>{
            console.log(content);
            this.setState({
                content:content,
            });
        })

        await this.getInstruments().then((instruments)=>{
            console.log(instruments);
            this.setState({
                instruments:instruments,
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
        return fetch(this.settings.api + "settings" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.props.user.data[0]),
        }).then(res => {
            console.log(res);
            return res.json();
        })
    }

    getContent = async () =>{
        return fetch( this.settings.api + "allStudio" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => {
            return res.json();
        });
    }

    getInstruments = async () => {
        return fetch( "/studios/getAllInstrumentsInStudios" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => {
            console.log(res);
            return res.json();
        })
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

    render(){ 
        return(
            this.state.loading?
            <Loading/>
            :
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
                        <div> 
                            <InstrumentList settings={this.state.settings} data={this.state.instruments.data} sid={item.sid}/>
                        </div>
                    ) 
                })}
            </DatapageLayout>
        )
    }
}

class InstrumentList extends React.Component{
    state = {
        content: [],
        currentMap : [],
        contentSettings: {},
        loading: true,
        settings: {},
    }

    async componentDidMount(){
        this.setState({
            content:this.props.data.filter(item=>item.studioID === this.props.sid && item.status != "unavailable"),
            loading: false,
        })
    }

    requestRefresh = async () =>{
        this.setState({
            loading:true,
        })
        this.setState({
            loading:false,
        })
    }

    addLink = async (data) =>{

    }

    deleteLink = async (data) =>{
    }

    render(){
        
        return(
            this.state.loading? <div>Loading</div>:
        
            <ListMapperView 
            title={"Instruments in this studio"} 
            requestRefresh={this.requestRefresh} 
            addLink={this.addLink} 
            settings={this.state.settings} 
            deleteLink={this.deleteLink} 
            headers={this.props.settings.listViewSettings["InstrumentList"].fieldSettings} 
            data={this.state.content}>
            </ListMapperView>
        )
    } 
    
}