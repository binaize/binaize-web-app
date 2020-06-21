import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import Divider from '@material-ui/core/Divider';
import {fade} from "@material-ui/core";
import {Link} from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {withStyles} from "@material-ui/core/styles";
import {withRouter} from "react-router-dom";
import "./Experiments.css"
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {Bar, Line} from "react-chartjs-2";
import $ from 'jquery';

import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';

import {
    REACT_APP_BASE_URL,
    REACT_APP_URL_SESSION_COUNT,
    REACT_APP_URL_CONVERSION_RATE,
    REACT_APP_URL_CONVERSION_TABLE,
    REACT_APP_URL_VISITOR_COUNT,
    REACT_APP_URL_EXPERIMENTS,
    REACT_APP_EXPERIMENT_SUMMARY
} from "../config"
import AppToolbar from "./AppToolbar";
import SideDrawer from "./SideDrawer";
import Button from "@material-ui/core/Button";
// import Chart from "react-apexcharts";

const drawerWidth = 300;
const exp_style = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: "#1A2330"
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1),
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade("#1A2330", 0.1),
        '&:hover': {
            backgroundColor: fade("#1a2330", 0.1),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    expMenu: {
        color: 'rgba(32,46,120,0.85)',
        backgroundColor: "#fff",
        '&:hover': {
            backgroundColor: '#eee !important',
            color: "rgba(32,46,120,0.85)"
        }
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '30ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    button: {
        position: 'absolute',
        right: "0%",
        backgroundColor: "#f1f1f1",
        height: "70px",
        width: "70px",
        margin: "1% 5%",
        '&:hover': {
            backgroundColor: '#ddd !important',
            color: "rgba(32,46,120,0.85)"
        }
    }
})

class ABTestingDashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            access_token: localStorage.getItem("access_token"),
            select_val: "",
            options: [
                {label: 'exp_2', value: '13e6f65bacbf4d74b8561e940287e604'},
                {label: 'exp_1', value: '66f5d1fc432d47b994250688fd728ff7'}
            ],
            BarDataSession: {},
            BarDataVisitors: {},
            ConversionData: {},

            session_max_value:'',
            visitor_max_value: '',
            conversion_max_value: '',


            rows: [],
            SummaryDetails: {
                summary_status: '',
                summary_conclusion: '',
                summary_recommendation: '',
            },
            bar_background_color: ['#2196f3', '#50B83C', '#ef6c00'],
            bar_background_hover_color: ['#1976d2', '#43a047', '#e65100'],
            variation_name2: ["Variation Yel", "Original", "Variation Blue"],
            experiment_names: [],
            experiment_ids: [],
            exp_name: localStorage.getItem("experiment_name"),

            // APEX CHARTS

            series: [{
                data: [44, 55, 41, 64, 22, 43, 21]
            }, {
                data: [53, 32, 33, 52, 13, 44, 32]
            }],

            optionss: {
                chart: {
                    type: 'bar',
                    height: 430
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        dataLabels: {
                            position: 'top',
                        },
                    }
                },
                dataLabels: {
                    enabled: true,
                    offsetX: -6,
                    style: {
                        fontSize: '12px',
                        colors: ['#fff']
                    }
                },
                stroke: {
                    show: true,
                    width: 1,
                    colors: ['#fff']
                },
                xaxis: {
                    categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
                },
            },

            seriesss: [{
                name: 'Website Blog',
                type: 'column',
                data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
            }, {
                name: 'Social Media',
                type: 'line',
                data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
            }],
            optionssss: {
                chart: {
                    height: 350,
                    type: 'line',
                },
                stroke: {
                    width: [0, 4]
                },
                title: {
                    text: 'Traffic Sources'
                },
                dataLabels: {
                    enabledOnSeries: [1]
                },
                labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
                xaxis: {
                    type: 'datetime'
                },
                yaxis: [{
                    title: {
                        text: 'Website Blog',
                    },

                }, {
                    opposite: true,
                    title: {
                        text: 'Social Media'
                    }
                }]
            },
        }


        if (this.state.access_token === "") {
            this.props.history.push("/");
        }



    }

    createExpList(experiment_name, experiment_id) {
        return [experiment_name, experiment_id];
    }

    getExperimentNames() {

        try {
            let localExp = [];
            // console.log(localStorage.getItem("access_token"));

            let access = "Bearer " + this.state.access_token;

            fetch(REACT_APP_BASE_URL + REACT_APP_URL_EXPERIMENTS, {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': access,
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(res => {
                    let result = res;
                    let i = 0;

                    for (i; i < result.length; i++) {
                        localExp.push(this.createExpList(result[i]["experiment_name"], result[i]["experiment_id"]))
                    }

                    this.setState({experiment_names: localExp})
                    // console.log(this.state.experiment_names);
                });
        } catch (e) {
            console.error("Error!", e);
        }
    }

    getSessionData(exp_id) {

        // console.log(exp_id)

        this.setState({selected: this.state.selected})
        const params = new URLSearchParams({
            experiment_id: exp_id
        })
        let access = "Bearer " + this.state.access_token;

        // SESSION COUNT API CALL
        const urlSession = REACT_APP_URL_SESSION_COUNT + `?${params.toString()}`

        fetch(REACT_APP_BASE_URL + urlSession, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                // console.log("Success:", result);

                let i = 0;
                let mainDatasetSession = [];

                try {

                    let max = []

                    Object.keys(result["session_count"]).forEach((key) => {
                        max.push(Math.max.apply(null, result["session_count"][key]))
                    })

                    this.setState({
                        session_max_value: Math.max.apply(null, max)
                    })

                    Object.keys(result["session_count"]).sort().forEach((key) => {

                        let localData;
                        localData = {
                            label: key,
                            backgroundColor: this.state.bar_background_color[i],
                            borderColor: this.state.bar_background_color[i],
                            borderWidth: 1,
                            hoverBackgroundColor: this.state.bar_background_hover_color[i],
                            hoverBorderColor: this.state.bar_background_hover_color[i],
                            data: result["session_count"][key],
                            datalabels: {
                                display: false,
                            }
                        }
                        i = i + 1;
                        mainDatasetSession.push(localData);
                    })


                } catch (e) {
                    console.log(e)
                    this.setState({
                        SummaryDetails: {
                            summary_status: "Error in fetching data"
                        }
                    })
                }

                this.setState({
                    BarDataSession: {
                        labels: result.date,
                        datasets: mainDatasetSession
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })


        // VISITOR COUNT API CALL
        const urlVisitor = REACT_APP_URL_VISITOR_COUNT + `?${params.toString()}`

        fetch(REACT_APP_BASE_URL + urlVisitor, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                // console.log("Success URL Visitor Count: ", result);

                let i = 0;
                let mainDatasetVisitors = [];

                try {

                    let max = [];

                    Object.keys(result["visitor_count"]).forEach((key) => {
                        max.push(Math.max.apply(null, result["visitor_count"][key]))
                    })

                    this.setState({
                        visitor_max_value: Math.max.apply(null, max)
                    })

                    Object.keys(result["visitor_count"]).sort().forEach((key) => {

                        let localDataVisitor
                        localDataVisitor = {
                            label: key,
                            backgroundColor: this.state.bar_background_color[i],
                            borderColor: this.state.bar_background_color[i],
                            borderWidth: 1,
                            hoverBackgroundColor: this.state.bar_background_hover_color[i],
                            hoverBorderColor: this.state.bar_background_hover_color[i],
                            data: result["visitor_count"][key],
                            datalabels: {
                                display: false,
                            }
                        }
                        i = i + 1
                        mainDatasetVisitors.push(localDataVisitor);

                    })
                } catch (e) {
                    console.log(e);
                }

                this.setState({
                    BarDataVisitors: {
                        labels: result.date,
                        datasets: mainDatasetVisitors
                    }
                })

            })
            .catch(err => {
                console.log(err)
            })


        // CONVERSION RATE API CALL
        const urlConvert = REACT_APP_URL_CONVERSION_RATE + `?${params.toString()}`

        fetch(REACT_APP_BASE_URL + urlConvert, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                // console.log("Success : ", result);

                let mainDatasetConversion = [];
                let i = 0;

                try {

                    let max = [];
                    Object.keys(result["conversion"]).sort().forEach((key) => {
                        max.push(Math.max.apply(null, result["conversion"][key]))
                    })

                    this.setState({
                        conversion_max_value: Math.max.apply(null, max)
                    })


                    Object.keys(result["conversion"]).sort().forEach((key) => {

                        let localData
                        localData = {
                            label: key,
                            borderColor: this.state.bar_background_color[i],
                            borderWidth: 3,
                            fill: false,
                            hoverBackgroundColor: this.state.bar_background_hover_color[i],
                            hoverBorderColor: this.state.bar_background_hover_color[i],
                            data: result["conversion"][key],
                            datalabels: {
                                display: false,
                            }
                        }
                        i = i + 1;
                        mainDatasetConversion.push(localData);

                    })
                } catch (e) {
                    console.log(e);
                }

                this.setState({
                    ConversionData: {
                        labels: result.date,
                        datasets: mainDatasetConversion
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })


        // CONVERSION TABLE API CALL
        const urlConversationTable = REACT_APP_URL_CONVERSION_TABLE + `?${params.toString()}`

        try {

            fetch(REACT_APP_BASE_URL + urlConversationTable, {
                method: 'GET',
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

                    // console.log("Success: TABLE ", result);

                    let i = 0;
                    // console.log("Success: TABLE " + result[i]["variation_name"])

                    let url = "www.smth.com"

                    for (i; i < result.length; i++) {

                        localData.push(<Link url={url}>{result[i].variation_name}</Link>);
                        localData.push(result[i]["num_session"]);
                        localData.push(result[i]["num_visitor"]);
                        localData.push(result[i]["visitor_converted"]);
                        localData.push(result[i]["goal_conversion"]);
                        localData.push(result[i]["sales_conversion"]);

                        localRows.push(localData);
                        localData = [];

                    }

                    this.setState({rows: localRows})

                }).catch(err => {
                console.log(err);
            })

        } catch (e) {
            console.error("Error!", e);
        }


        // EXPERIMENT SUMMARY API CALL
        const urlSummary = REACT_APP_EXPERIMENT_SUMMARY + `?${params.toString()}`;
        fetch(REACT_APP_BASE_URL + urlSummary, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                // console.log("Success: ", result);

                let $summary = $("#summary"),
                    summary_str = result["status"],
                    summary_html = $.parseHTML(summary_str)

                $summary.html(summary_html);

                let $summary_conclusion = $("#summary_conclusion"),
                    summary_conclusion_str = result["conclusion"],
                    summary_conclusion_html = $.parseHTML(summary_conclusion_str)
                $summary_conclusion.html(summary_conclusion_html);

                let $summary_recommendation = $("#summary_recommendation"),
                    summary_recommendation_str = result["recommendation"],
                    summary_recommendation_html = $.parseHTML(summary_recommendation_str)
                $summary_recommendation.html(summary_recommendation_html);

            })
            .catch(err => {
                console.log(err)
            })


    }

    componentDidMount() {
        // this.getExperimentNames();
        this.getSessionData(localStorage.getItem("experiment_id"));
    }

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline/>

                <AppToolbar/>

                <SideDrawer/>

                {/* MAIN LAYOUT */}
                <main className={classes.content}>
                    <div className={classes.toolbar}/>

                    <div style={{display: "flex"}}>
                        {/*<h2 style={{margin: "2% 2%"}}>A/B Testing  Dashboard</h2>*/}
                        <h2 style={{margin: "2% 5%"}}> {this.state.exp_name} </h2>

                        <Button
                            color="primary"
                            className={classes.button}
                            onClick={() => {
                                this.getSessionData(localStorage.getItem("experiment_id"))
                            }}
                        ><RefreshRoundedIcon/></Button>


                        {/*<FormControl variant="outlined" className={classes.formControl}>*/}
                        {/*    <InputLabel id="demo-simple-select-outlined-label">Experiment Name</InputLabel>*/}
                        {/*    <Select*/}
                        {/*        labelId="demo-simple-select-outlined-label"*/}
                        {/*        id="demo-simple-select-outlined"*/}
                        {/*        value={this.state.select_val}*/}
                        {/*        onChange={(e) => {*/}
                        {/*            this.setState({select_val: e.target.value})*/}
                        {/*            this.getSessionData(e.target.value);*/}
                        {/*        }}*/}
                        {/*        label="Experiment Name">*/}

                        {/*        {this.state.experiment_names.map((exp_name) => (*/}
                        {/*            <MenuItem className={classes.expMenu} value={exp_name[1]}>{exp_name[0]}</MenuItem>*/}
                        {/*        ))}*/}

                        {/*        /!*<MenuItem value={"13e6f65bacbf4d74b8561e940287e604"} style={{color: "black"}}>Product*!/*/}
                        {/*        /!*    page design</MenuItem>*!/*/}
                        {/*        /!*<MenuItem value={"66f5d1fc432d47b994250688fd728ff7"} style={{color: "black"}}>Home page*!/*/}
                        {/*        /!*    messaging</MenuItem>*!/*/}
                        {/*    </Select>*/}
                        {/*</FormControl>*/}
                    </div>
                    <Card style={{margin: "1% 5%"}}>
                        <CardContent>
                            <div style={{padding: "0.5%", margin: "0% 0% 0% 0.5%", width: "97%", fontSize: "16px"}}>
                                <p id="summary"/>
                                <p id="summary_conclusion"/>
                                <p id="summary_recommendation"/>
                            </div>
                        </CardContent>
                    </Card>

                    <Divider style={{margin: "1% 5%"}}/>

                    <TableContainer component={Paper} style={{margin: "2% 5%", width: "90%"}}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Variant</TableCell>
                                    <TableCell align="left">Sessions</TableCell>
                                    <TableCell align="left">Visitors</TableCell>
                                    <TableCell align="left">Visitors Converted</TableCell>
                                    <TableCell align="left">Goal Conversion (%)</TableCell>
                                    <TableCell align="left">Sales Conversion (%)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows.map((row) => (
                                    <TableRow key={row[0]}>
                                        <TableCell component="th" scope="row">
                                            {row[0]}
                                        </TableCell>
                                        <TableCell align="left">{row[1]}</TableCell>
                                        <TableCell align="left">{row[2]}</TableCell>
                                        <TableCell align="left">{row[3]}</TableCell>
                                        <TableCell align="left">{row[4]}</TableCell>
                                        <TableCell align="left">{row[5]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Divider style={{margin: "1% 5%"}}/>

                    <Card style={{margin: "2% 5%"}}>
                        <CardContent>
                            <div style={{margin: "0% 0.5% 1% 1.5%", width: "97%"}}>
                                <h3>
                                    Session Over Time
                                </h3>
                                <hr/>

                                <Bar
                                    width={100}
                                    height={40}
                                    data={this.state.BarDataSession}
                                    redraw={this.state.BarDataSession}
                                    options={{
                                        maintainAspectRatio: true,
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    min: 0,
                                                    max: (Math.round(this.state.session_max_value / 20) + 2) * 20,
                                                },
                                                scaleLabel: {
                                                    display: true,
                                                    labelString: "# Sessions"
                                                }
                                            }]
                                        }
                                    }}>
                                </Bar>
                            </div>
                        </CardContent>
                    </Card>
                    <Divider style={{margin: "1% 5%"}}/>
                    <Card style={{margin: "2% 5%"}}>
                        <CardContent>
                            <div style={{margin: "0% 0.5% 1% 1.5%", width: "97%"}}>
                                <h3>
                                    Visitor Over Time
                                </h3>
                                <hr/>
                                <Bar

                                    yAxisID="% Conversion"
                                    width={100}
                                    height={40}
                                    data={this.state.BarDataVisitors}
                                    redraw={this.state.BarDataVisitors}
                                    options={{
                                        maintainAspectRatio: true,
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    min: 0,
                                                    max: (Math.round(this.state.visitor_max_value / 10) + 2) * 10,
                                                },
                                                scaleLabel: {
                                                    display: true,
                                                    labelString: "# Visitors"
                                                }
                                            }]
                                        }
                                    }}>
                                </Bar>
                            </div>
                        </CardContent>
                    </Card>
                    <Divider style={{margin: "1% 5%"}}/>
                    <Card style={{margin: "2% 5%"}}>
                        <CardContent>
                            <div style={{margin: "0% 0.5% 1% 1.5%", width: "97%"}}>
                                <h3>
                                    Goal Conversion Over Time
                                </h3>
                                <hr/>
                                <Line
                                    width={100}
                                    height={40}
                                    data={this.state.ConversionData}
                                    redraw={this.state.ConversionData}
                                    options={{maintainAspectRatio: true}}>
                                </Line>
                            </div>
                        </CardContent>
                    </Card>

                    {/*/!*  APEX CHARTS TESTING  *!/*/}

                    {/*<Divider style={{margin: "1% 5%"}}/>*/}
                    {/*<Card style={{margin: "2% 5%"}}>*/}
                    {/*    <CardContent>*/}
                    {/*        <div className="mixed-chart" style={{margin: "0% 0.5% 1% 1.5%", width: "97%"}}>*/}
                    {/*            <Chart*/}
                    {/*                options={this.state.optionss}*/}
                    {/*                series={this.state.series}*/}
                    {/*                type="bar"*/}
                    {/*                height={430}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}


                    {/*<Divider style={{margin: "1% 5%"}}/>*/}
                    {/*<Card style={{margin: "2% 5%"}}>*/}
                    {/*    <CardContent>*/}
                    {/*        <div className="mixed-chart" style={{margin: "0% 0.5% 1% 1.5%", width: "97%"}}>*/}
                    {/*            <Chart*/}
                    {/*                options={this.state.optionssss}*/}
                    {/*                series={this.state.seriesss}*/}
                    {/*                type="line"*/}
                    {/*                height={430}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}


                </main>

            </div>
        )
    }
}

export default withRouter(withStyles(exp_style)(ABTestingDashboard))
