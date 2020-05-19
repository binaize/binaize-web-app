import React from "react";

import {withRouter} from "react-router-dom";
import {Card, DataTable, Layout, Link, Select} from "@shopify/polaris";
import {Bar, Line} from "react-chartjs-2";
import SideBar from "./SideBar";


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            select_val : "today",
            options: [
                {label: 'exp_2', value: '13e6f65bacbf4d74b8561e940287e604'},
                {label: 'exp_1', value: '66f5d1fc432d47b994250688fd728ff7'}
            ],
            BarDataSession: {},
            BarDataVisitors: {},
            ConversionData: {},
            rows: [],
            SummaryDetails: {
                summary_status: '',
                summary_conclusion: '',
                summary_recommendation: '',
            },
            bar_background_color : ['#38536c', '#247afb', '#da1a40'],
            bar_background_hover_color : ['rgba(56,83,108,0.58)', 'rgba(36,122,251,0.6)', 'rgba(218,26,64,0.53)'],
            variation_name2 : ["Variation Yellow", "Original", "Variation Blue"]
        }
    }

    getSessionData(exp_id) {
        this.setState({selected: this.state.selected})
        const params = new URLSearchParams({
            experiment_id: exp_id
        })

        let access = "Bearer " + localStorage.getItem("access_token");
        const urlSession = `/get_session_count_for_dashboard?${params.toString()}`

        console.log(urlSession);
        let mainDatasetSession = [];
        let mainDatasetVisitors = [];
        let mainDatasetConversion = [];

        fetch('https://api.dev.binaize.com' + urlSession, {
            method: 'post',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                console.log("Success:", result);

                let data = []
                let datasets = [];


                Object.keys(result.session_count).forEach(function (key) {
                    // console.log(key)
                    data.push(key)
                    datasets.push(result.session_count[key])
                });
                console.log(data);
                console.log(datasets);

                let localdata = {}

                let i = 0;
                for (i; i < data.length; i++) {

                    localdata = {
                        label: data[i],
                        backgroundColor: this.state.bar_background_color[i],
                        borderColor: this.state.bar_background_color[i],
                        borderWidth: 1,
                        hoverBackgroundColor: this.state.bar_background_hover_color[i],
                        hoverBorderColor: this.state.bar_background_hover_color[i],
                        data: datasets[i]
                    }
                    mainDatasetSession.push(localdata);
                    localdata = {}
                }

                console.log(mainDatasetSession)
                this.setState({
                    BarDataSession: {
                        labels: result.date,
                        datasets: mainDatasetSession
                    }
                })
            });


        const urlVisitor = `/get_visitor_count_for_dashboard?${params.toString()}`

        console.log(urlVisitor);

        fetch('https://api.dev.binaize.com' + urlVisitor, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                console.log("Success: ", result);

                let dataV = [];
                let datasetsV = [];

                Object.keys(result.visitor_count).forEach(function (key) {
                    // console.log(key)
                    dataV.push(key)
                    datasetsV.push(result.visitor_count[key])
                });
                console.log(dataV);
                console.log(datasetsV);

                let localdataV = {}

                let i = 0;
                for (i; i < dataV.length; i++) {

                    localdataV = {
                        label: dataV[i],
                        backgroundColor: this.state.bar_background_color[i],
                        borderColor: this.state.bar_background_color[i],
                        borderWidth: 1,
                        hoverBackgroundColor: this.state.bar_background_hover_color[i],
                        hoverBorderColor: this.state.bar_background_hover_color[i],
                        data: datasetsV[i]
                    }
                    mainDatasetVisitors.push(localdataV);
                    localdataV = {}
                }

                console.log(mainDatasetVisitors)
                this.setState({
                    BarDataVisitors: {
                        labels: result.date,
                        datasets: mainDatasetVisitors
                    }
                })
            });


        const urlConvert = `/get_conversion_rate_for_dashboard?${params.toString()}`

        console.log(urlConvert);

        fetch('https://api.dev.binaize.com' + urlConvert, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                console.log("Success: ", result);

                let dataV = [];
                let datasetsV = [];

                Object.keys(result.conversion).forEach(function (key) {
                    // console.log(key)
                    dataV.push(key)
                    datasetsV.push(result.conversion[key])
                });
                console.log(dataV);
                console.log(datasetsV);

                let localdataV = {}

                let i = 0;
                for (i; i < dataV.length; i++) {

                    localdataV = {
                        label: dataV[i],
                        borderColor: this.state.bar_background_color[i],
                        borderWidth: 3,
                        hoverBackgroundColor: this.state.bar_background_hover_color[i],
                        hoverBorderColor: this.state.bar_background_hover_color[i],
                        data: datasetsV[i]
                    }
                    mainDatasetConversion.push(localdataV);
                    localdataV = {}
                }

                console.log(mainDatasetConversion)
                this.setState({
                    ConversionData: {
                        labels: result.date,
                        datasets: mainDatasetConversion
                    }
                })
            });


        const urlConversationTable = `/get_conversion_table_for_dashboard?${params.toString()}`

        console.log(urlConversationTable);

        try {

            fetch('https://api.dev.binaize.com' + urlConversationTable, {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': access,
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(result => {

                    let localData = [];
                    let localRows = [];


                    console.log("Success: TABLE ", result);

                    let i = 0;
                    console.log("Success: TABLE " + result[i].variation_name)

                    let url = "www.smth.com"

                    for (i; i < result.length; i++) {

                        localData.push(<Link url={url}>{result[i].variation_name}</Link>);
                        localData.push(result[i].num_session);
                        localData.push(result[i].num_visitor);
                        localData.push(result[i].visitor_converted);
                        localData.push(result[i].conversion);

                        localRows.push(localData);
                        localData = [];

                    }

                    this.setState({rows: localRows})
                    console.log(this.state.rows);
                });


        } catch (e) {
            console.error("Error!", e);
        }


        const urlSummary = `/get_experiment_summary?${params.toString()}`

        console.log(urlSummary);

        fetch('https://api.dev.binaize.com' + urlSummary, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                console.log("Success: ", result);

                this.setState({
                    SummaryDetails: {
                        summary_status: result.status,
                        summary_conclusion: result.conclusion,
                        summary_recommendation: result.recommendation
                    }
                })

            });


    }

    componentDidMount() {

    }

    render() {
        return (

            <div style={{display: "flex", width: "80%", margin: "0 0 0 10%"}}>
                <div>
                    <SideBar activeKey={"2"}/>
                </div>
                <div className={"container"} style={{margin: "0"}}>
                    <Layout>
                        <Layout.Section>
                            <h2 style={{marginTop: "2%"}}>Binaize Dashboard</h2>
                            <Select
                                label="Select Experiment Name"
                                options={this.state.options}
                                onChange={(exp_id) => {
                                    // alert(exp_id)
                                    this.setState({select_val: exp_id})
                                    this.getSessionData(exp_id);
                                }}
                                value={this.state.select_val}
                            />

                            <Card>
                                <div style={{padding: "3%"}}>
                                    <p>{this.state.SummaryDetails.summary_status}</p>
                                    <p>{this.state.SummaryDetails.summary_conclusion}</p>
                                    <p>{this.state.SummaryDetails.summary_recommendation}</p>
                                </div>
                            </Card>

                            <Card sectioned>
                                <h4>
                                    Overview
                                </h4>
                                <hr/>
                                <DataTable
                                    columnContentTypes={[
                                        'text',
                                        'text',
                                        'text',
                                        'text',
                                        'text'
                                    ]}
                                    headings={[
                                        'Variant',
                                        'Sessions',
                                        'Visitors',
                                        'Visitors Converted',
                                        'Conversion Rate (%)'
                                    ]}
                                    rows={this.state.rows}
                                    footerContent={`Showing ${this.state.rows.length} of ${this.state.rows.length} results`}
                                />
                            </Card>

                            <Card sectioned>
                                <h4>
                                    Session Over Time
                                </h4>
                                <hr/>
                                <Bar
                                    width={100}
                                    height={40}
                                    data={this.state.BarDataSession}
                                    options={{maintainAspectRatio: true}}>
                                </Bar>
                            </Card>

                            <Card sectioned>
                                <h4>
                                    Visitor Over Time
                                </h4>
                                <hr/>
                                <Bar

                                    yAxisID = "% Conversion"
                                    width={100}
                                    height={40}
                                    data={this.state.BarDataVisitors}
                                    options={{maintainAspectRatio: true}}>
                                </Bar>
                            </Card>

                            <Card sectioned>
                                <h4>
                                    Conversion Over Time
                                </h4>
                                <hr/>
                                <Line
                                    width={100}
                                    height={40}
                                    data={this.state.ConversionData}
                                    options={{maintainAspectRatio: true}}>
                                </Line>
                            </Card>

                        </Layout.Section>
                    </Layout>
                </div>
            </div>
        )
    }


}

export default withRouter(Dashboard);
