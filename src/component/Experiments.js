import React, {Component} from 'react';import {Card, DataTable, Link} from '@shopify/polaris';import {withRouter} from "react-router-dom";import SideBar from "./SideBar";class Experiments extends Component {    constructor(props) {        super(props);        this.state = {            rows: []        }    }    getExperiments() {        let localData = [];        let localRows = [];        console.log(localStorage.getItem("access_token"));        let access = "Bearer " + localStorage.getItem("access_token");        try {            fetch('https://api.dev.binaize.com/list_experiments', {                method: 'get',                headers: {                    'Access-Control-Allow-Origin': '*',                    'Authorization': access,                    'Accept': 'application/json'                }            })                .then(response => response.json())                .then(result => {                    console.log("Success:", result);                    let i = 0;                    console.log(result.length)                    let url = "www.smth.com"                    for (i; i < result.length; i++) {                        localData.push(<Link url={url}>{result[i].experiment_name}</Link>);                        localData.push(result[i].experiment_type);                        localData.push(result[i].status);                        localData.push(result[i].page_type);                        localData.push(result[i].creation_time);                        localData.push(result[i].last_updation_time);                        localRows.push(localData);                        localData = [];                    }                    this.setState({rows: localRows})                    console.log(this.state.rows);                });        } catch (e) {            console.error("Error!", e);        }    }    componentDidMount() {        this.getExperiments();    }    render() {        return (            <div style={{display: "flex", width: "100%", margin: "0 10% 0 10%"}}>                <div>                    <SideBar/>                </div>                <div style={{margin: "2% 0% 0% 2%"}}>                    <Card title="Experiments Overview" sectioned>                        <p>List of experiments.</p>                    </Card>                    <Card>                        <DataTable                            columnContentTypes={[                                'text',                                'text',                                'text',                                'text',                                'text',                                'text'                            ]}                            headings={[                                'Experiments',                                'Type',                                'Status',                                'Page',                                'Created On',                                'Last Updated On'                            ]}                            rows={this.state.rows}                            footerContent={`Showing ${this.state.rows.length} of ${this.state.rows.length} results`}                        />                    </Card>                </div>            </div>        );    }}export default withRouter(Experiments)