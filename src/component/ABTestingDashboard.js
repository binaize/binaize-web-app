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
// import "./Experiments.css"
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {Bar, Line} from "react-chartjs-2";
import $ from 'jquery';

import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';

import {
    REACT_APP_BASE_URL,
    REACT_APP_URL_CONVERSION_OVER_TIME,
    REACT_APP_URL_CONVERSION_TABLE,
    REACT_APP_URL_EXPERIMENTS,
    REACT_APP_EXPERIMENT_SUMMARY
} from "../config"
import AppToolbar from "./AppToolbar";
import SideDrawer from "./SideDrawer";
import Button from "@material-ui/core/Button";
import Demo from "./SideDrawer_rsuit";
// import Chart from "react-apexcharts";

const drawerWidth = 280;
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
        marginLeft: "300px"
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

const tickSizes = [
    1, 2, 5,
    10, 20, 50,
    100, 200, 500,
    1000, 2000, 5000,
    10000, 20000, 50000,
    100000, 200000, 500000,
    1000000, 2000000, 5000000
];


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

            full_conversion_over_time: {},

            SessionCountData: {},
            VisitorCountData: {},

            GoalConversionData: {},
            GoalConversionPercentData: {},

            SalesConversionData: {},
            SalesConversionPercentData: {},

            step_size_session: '',
            step_size_visitor: '',
            step_size_goal_conversion: '',
            step_size_sales_conversion: '',

            session_max_value: '',
            visitor_max_value: '',
            goal_conversion_max_value: '',
            sales_conversion_max_value: '',

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


    getSession() {


        // SESSION COUNT DATA
        let i = 0;
        let mainDatasetSession = [];

        try {

            let max = []

            Object.keys(this.state.full_conversion_over_time["session_count"]).forEach((key) => {
                max.push(Math.max.apply(null, this.state.full_conversion_over_time["session_count"][key]))
            })

            let max_session_value = Math.max.apply(null, max)

            for (let s = 0; s < tickSizes.length; s++) {
                console.log("-------" + max_session_value);
                let val = max_session_value / tickSizes[s]
                if (val < 6) {
                    console.log(tickSizes[s]);
                    this.setState({
                        step_size_session: tickSizes[s]
                    })
                    break
                }
            }

            this.setState({
                session_max_value: max_session_value
            })

            Object.keys(this.state.full_conversion_over_time["session_count"]).sort().forEach((key) => {

                let localData;
                localData = {
                    label: key,
                    backgroundColor: this.state.bar_background_color[i],
                    borderColor: this.state.bar_background_color[i],
                    borderWidth: 1,
                    hoverBackgroundColor: this.state.bar_background_hover_color[i],
                    hoverBorderColor: this.state.bar_background_hover_color[i],
                    data: this.state.full_conversion_over_time["session_count"][key],
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
            SessionCountData: {
                labels: this.state.full_conversion_over_time.date,
                datasets: mainDatasetSession
            }
        })

    }


    getVisitor() {

        // VISITOR COUNT DATA
        let visitor_counter = 0;
        let mainDatasetVisitors = [];

        try {

            let max = [];

            Object.keys(this.state.full_conversion_over_time["visitor_count"]).sort().forEach((key) => {
                max.push(Math.max.apply(null, this.state.full_conversion_over_time["visitor_count"][key]))
            })

            console.log(max)
            let max_visitor_value = Math.max.apply(null, max)

            console.log(max_visitor_value)

            for (let s = 0; s < tickSizes.length; s++) {
                // console.log("-------" + max_visitor_value);
                let val = max_visitor_value / tickSizes[s]
                if (val < 6) {
                    // console.log(tickSizes[s]);
                    this.setState({
                        step_size_visitor: tickSizes[s]
                    })
                    break
                }
            }

            this.setState({
                visitor_max_value: max_visitor_value
            })

            Object.keys(this.state.full_conversion_over_time["visitor_count"]).sort().forEach((key) => {

                let localDataVisitor
                localDataVisitor = {
                    label: key,
                    backgroundColor: this.state.bar_background_color[visitor_counter],
                    borderColor: this.state.bar_background_color[visitor_counter],
                    hoverBackgroundColor: this.state.bar_background_hover_color[visitor_counter],
                    hoverBorderColor: this.state.bar_background_hover_color[visitor_counter],
                    data: this.state.full_conversion_over_time["visitor_count"][key],
                    datalabels: {
                        display: false,
                    }
                }
                visitor_counter = visitor_counter + 1
                mainDatasetVisitors.push(localDataVisitor);

            })
        } catch (e) {
            console.log(e);
        }

        this.setState({
            VisitorCountData: {
                labels: this.state.full_conversion_over_time.date,
                datasets: mainDatasetVisitors
            }
        })


    }


    getGoalConversion() {

        // GOAL CONVERSION COUNT DATA
        let goal_conversion_counter = 0;
        let mainDatasetConversion = [];

        try {

            let max = [];
            Object.keys(this.state.full_conversion_over_time["goal_conversion_count"]).sort().forEach((key) => {
                max.push(Math.max.apply(null, this.state.full_conversion_over_time["goal_conversion_count"][key]))
            })

            let max_goal_value = Math.max.apply(null, max)

            for (let s = 0; s < tickSizes.length; s++) {
                console.log("-------" + max_goal_value);
                let val = max_goal_value / tickSizes[s]
                if (val < 6) {
                    console.log(tickSizes[s]);
                    this.setState({
                        step_size_goal_conversion: tickSizes[s]
                    })
                    break
                }
            }

            this.setState({
                goal_conversion_max_value: max_goal_value
            })


            Object.keys(this.state.full_conversion_over_time["goal_conversion_count"]).sort().forEach((key) => {

                let localData
                localData = {
                    label: key,
                    backgroundColor: this.state.bar_background_color[goal_conversion_counter],
                    borderColor: this.state.bar_background_color[goal_conversion_counter],
                    hoverBackgroundColor: this.state.bar_background_hover_color[goal_conversion_counter],
                    hoverBorderColor: this.state.bar_background_hover_color[goal_conversion_counter],
                    data: this.state.full_conversion_over_time["goal_conversion_count"][key],
                    datalabels: {
                        display: false,
                    }
                }
                goal_conversion_counter = goal_conversion_counter + 1;
                mainDatasetConversion.push(localData);

            })
        } catch (e) {
            console.log(e);
        }

        this.setState({
            GoalConversionData: {
                labels: this.state.full_conversion_over_time.date,
                datasets: mainDatasetConversion
            }
        })


    }


    getSalesConversion() {

        // SALES CONVERSION COUNT DATA
        let sales_counter = 0;
        let mainDatasetSales = [];

        try {

            let max = [];

            Object.keys(this.state.full_conversion_over_time["sales_conversion_count"]).forEach((key) => {
                max.push(Math.max.apply(null, this.state.full_conversion_over_time["sales_conversion_count"][key]))
            })

            let max_visitor_value = Math.max.apply(null, max)

            for (let s = 0; s < tickSizes.length; s++) {
                console.log("-------" + max_visitor_value);
                let val = max_visitor_value / tickSizes[s]
                if (val < 6) {
                    console.log(tickSizes[s]);
                    this.setState({
                        step_size_sales_conversion: tickSizes[s]
                    })
                    break
                }
            }

            this.setState({
                sales_conversion_max_value: max_visitor_value
            })

            Object.keys(this.state.full_conversion_over_time["sales_conversion_count"]).sort().forEach((key) => {

                let localDataSales
                localDataSales = {
                    label: key,
                    backgroundColor: this.state.bar_background_color[sales_counter],
                    borderColor: this.state.bar_background_color[sales_counter],
                    hoverBackgroundColor: this.state.bar_background_hover_color[sales_counter],
                    hoverBorderColor: this.state.bar_background_hover_color[sales_counter],
                    data: this.state.full_conversion_over_time["sales_conversion_count"][key],
                    datalabels: {
                        display: false,
                    }
                }
                sales_counter = sales_counter + 1
                mainDatasetSales.push(localDataSales);

            })
        } catch (e) {
            console.log(e);
        }

        console.log(mainDatasetSales)

        this.setState({
            SalesConversionData: {
                labels: this.state.full_conversion_over_time.date,
                datasets: mainDatasetSales
            }
        })


    }


    getGoalConversionPercentage() {

        // GOAL CONVERSION PERCENTAGE DATA
        let goal_percent_counter = 0;
        let mainDatasetGoalPercent = [];

        try {

            Object.keys(this.state.full_conversion_over_time["goal_conversion_percentage"]).sort().forEach((key) => {

                let localDataGoalPercent
                localDataGoalPercent = {
                    label: key,
                    borderColor: this.state.bar_background_color[goal_percent_counter],
                    borderWidth: 3,
                    fill: false,
                    hoverBackgroundColor: this.state.bar_background_hover_color[goal_percent_counter],
                    hoverBorderColor: this.state.bar_background_hover_color[goal_percent_counter],
                    data: this.state.full_conversion_over_time["goal_conversion_percentage"][key],
                    datalabels: {
                        display: false,
                    }
                }
                goal_percent_counter = goal_percent_counter + 1
                mainDatasetGoalPercent.push(localDataGoalPercent)

            })
        } catch (e) {
            console.log(e);
        }

        this.setState({
            GoalConversionPercentData: {
                labels: this.state.full_conversion_over_time.date,
                datasets: mainDatasetGoalPercent
            }
        })

    }


    getSalesConversionPercentage() {
        // SALES CONVERSION PERCENTAGE DATA
        let sales_percent_counter = 0;
        let mainDatasetSalesPercent = [];

        try {

            // let max = [];

            // Object.keys(this.state.full_conversion_over_time["sales_conversion_percentage"]).forEach((key) => {
            //     max.push(Math.max.apply(null, this.state.full_conversion_over_time["sales_conversion_percentage"][key]))
            // })
            //
            // let max_visitor_value = Math.max.apply(null, max)
            //
            // for (let s = 0; s < tickSizes.length; s++) {
            //     console.log("-------" + max_visitor_value);
            //     let val = max_visitor_value / tickSizes[s]
            //     if (val < 6) {
            //         console.log(tickSizes[s]);
            //         this.setState({
            //             step_size_visitor: tickSizes[s]
            //         })
            //         break
            //     }
            // }
            //
            // this.setState({
            //     sales_conversion_max_value: max_visitor_value
            // })

            Object.keys(this.state.full_conversion_over_time["sales_conversion_percentage"]).sort().forEach((key) => {

                let localDataSalesPercent
                localDataSalesPercent = {
                    label: key,
                    borderColor: this.state.bar_background_color[sales_percent_counter],
                    borderWidth: 3,
                    fill: false,
                    hoverBackgroundColor: this.state.bar_background_hover_color[sales_percent_counter],
                    hoverBorderColor: this.state.bar_background_hover_color[sales_percent_counter],
                    data: this.state.full_conversion_over_time["sales_conversion_percentage"][key],
                    datalabels: {
                        display: false,
                    }
                }
                sales_percent_counter = sales_percent_counter + 1
                mainDatasetSalesPercent.push(localDataSalesPercent)

            })
        } catch (e) {
            console.log(e);
        }

        this.setState({
            SalesConversionPercentData: {
                labels: this.state.full_conversion_over_time.date,
                datasets: mainDatasetSalesPercent
            }
        })

    }


    getAllData(exp_id) {

        this.setState({selected: this.state.selected})
        const params = new URLSearchParams({
            experiment_id: exp_id
        })

        let access = "Bearer " + this.state.access_token;

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


                    for (i; i < result.length; i++) {

                        localData.push(result[i]["variation_name"]);
                        localData.push(result[i]["num_session"]);
                        localData.push(result[i]["num_visitor"]);
                        localData.push(result[i]["goal_conversion_count"]);
                        localData.push(result[i]["goal_conversion"]);
                        localData.push(result[i]["sales_conversion_count"]);
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



        // CONVERSION OVER TIME API CALL
        const urlSession = REACT_APP_URL_CONVERSION_OVER_TIME + `?${params.toString()}`

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

                this.setState({
                    full_conversion_over_time: result
                })

                console.log(this.state.full_conversion_over_time)

                this.getSession();
                this.getVisitor();
                this.getGoalConversion();
                this.getSalesConversion();
                this.getGoalConversionPercentage();
                this.getSalesConversionPercentage();

            })
            .catch(err => {
                console.log(err)
            })



    }


    componentDidMount() {
        this.getAllData(localStorage.getItem("experiment_id"));
    }

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline/>

                <AppToolbar/>

                {/*<SideDrawer/>*/}
                <Demo active={localStorage.getItem("activeKey")}/>

                {/* MAIN LAYOUT */}
                <main className={classes.content}>
                    <div className={classes.toolbar}/>

                    <div style={{display: "flex"}}>
                        {/*<h2 style={{margin: "2% 2%"}}>A/B Testing  Dashboard</h2>*/}
                        <h3 style={{margin: "2% 1% 1% 5%"}}> {this.state.exp_name} </h3>

                        <Button
                            color="primary"
                            className={classes.button}
                            onClick={() => {
                                this.getAllData(localStorage.getItem("experiment_id"))
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
                        {/*            this.getAllData(e.target.value);*/}
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
                    <Card style={{margin: "2% 5%"}}>
                        <CardContent>
                            <div style={{padding: "0.5%", margin: "0% 1%", width: "95%", fontSize: "14px"}}>
                                <p id="summary"/>
                                <p id="summary_conclusion"/>
                                <p id="summary_recommendation"/>
                            </div>
                        </CardContent>
                    </Card>

                    <Divider style={{margin: "0% 5%"}}/>

                    <TableContainer component={Paper} style={{margin: "2% 5%", width: "90%"}}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Variant</strong></TableCell>
                                    <TableCell align="left"><strong>Sessions</strong></TableCell>
                                    <TableCell align="left"><strong>Visitors</strong></TableCell>
                                    <TableCell align="left"><strong>Goal Conversion (Count)</strong></TableCell>
                                    <TableCell align="left"><strong>Goal Conversion (%)</strong></TableCell>
                                    <TableCell align="left"><strong>Sales Conversion (Count)</strong></TableCell>
                                    <TableCell align="left"><strong>Sales Conversion (%)</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows.map((row) => (
                                    <TableRow key={row[0]}>
                                        <TableCell component="th" scope="row">
                                            <strong>{row[0]}</strong>
                                        </TableCell>
                                        <TableCell align="left">{row[1]}</TableCell>
                                        <TableCell align="left">{row[2]}</TableCell>
                                        <TableCell align="left">{row[3]}</TableCell>
                                        <TableCell align="left">{row[4]}</TableCell>
                                        <TableCell align="left">{row[5]}</TableCell>
                                        <TableCell align="left">{row[6]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Divider style={{margin: "0% 5%"}}/>


                    <div style={{display: "flex"}}>
                        <Card style={{margin: "2% 1% 0 5%", width: "44%"}}>
                            <CardContent style={{display: "flex"}}>
                                <div style={{margin: "0% 1.5% 1% 1.5%", width: "96%"}}>
                                    <h4>
                                        Session Over Time
                                    </h4>
                                    <hr/>

                                    <Bar
                                        width={100}
                                        height={60}
                                        data={this.state.SessionCountData}
                                        redraw={true}
                                        options={{
                                            maintainAspectRatio: true,
                                            scales: {
                                                yAxes: [{
                                                    ticks: {
                                                        min: 0,
                                                        stepSize: this.state.step_size_session,
                                                        max: (Math.round(this.state.session_max_value / this.state.step_size_session) + 2) * this.state.step_size_session,
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

                        <Card style={{margin: "2% 0 0 0", width: "44%"}}>
                            <CardContent style={{display: "flex"}}>

                                <div style={{margin: "0% 0.5% 1% 1.5%", width: "96%"}}>
                                    <h4>
                                        Visitor Count
                                    </h4>
                                    <hr/>

                                    <Bar
                                        width={100}
                                        height={60}
                                        data={this.state.VisitorCountData}
                                        redraw={true}
                                        options={{
                                            maintainAspectRatio: true,
                                            scales: {
                                                yAxes: [{
                                                    ticks: {
                                                        min: 0,
                                                        stepSize: this.state.step_size_visitor,
                                                        max: (Math.round(this.state.visitor_max_value / this.state.step_size_visitor) + 2) * this.state.step_size_visitor,
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
                    </div>

                    <div style={{display: "flex"}}>
                        <Card style={{margin: "2% 1% 0 5%", width: "44%"}}>
                            <CardContent style={{display: "flex"}}>
                                <div style={{margin: "0% 0.5% 1% 1.5%", width: "96%"}}>
                                    <h4>
                                        Goal Conversion Count
                                    </h4>
                                    <hr/>

                                    <Bar
                                        width={100}
                                        height={60}
                                        data={this.state.GoalConversionData}
                                        redraw={true}
                                        options={{
                                            maintainAspectRatio: true,
                                            scales: {
                                                yAxes: [{
                                                    ticks: {
                                                        min: 0,
                                                        stepSize: this.state.step_size_goal_conversion,
                                                        max: (Math.round(this.state.goal_conversion_max_value / this.state.step_size_goal_conversion) + 2) * this.state.step_size_goal_conversion,
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
                        <Card style={{margin: "2% 0 0 0", width: "44%"}}>

                            <CardContent style={{display: "flex"}}>
                                <div style={{margin: "0% 0.5% 1% 1.5%", width: "96%"}}>
                                    <h4>
                                        Goal Conversion
                                    </h4>
                                    <hr/>

                                    <Line
                                        width={100}
                                        height={60}
                                        data={this.state.GoalConversionPercentData}
                                        redraw={true}
                                        options={{
                                            tooltips: {
                                                intersect: false,
                                            },
                                            hover: {
                                                intersect: false
                                            },
                                            maintainAspectRatio: true,
                                            scales: {
                                                yAxes: [{
                                                    ticks: {
                                                        min: 0,
                                                        max: 100,
                                                        stepSize: 20
                                                    },
                                                    scaleLabel: {
                                                        display: true,
                                                        labelString: "% Conversion"
                                                    }
                                                }]
                                            }
                                        }}>
                                    </Line>

                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/*LINE*/}

                    <div style={{display: "flex"}}>


                        <Card style={{margin: "2% 1% 0 5%", width: "44%"}}>
                            <CardContent style={{display: "flex"}}>
                                <div style={{margin: "0% 0.5% 1% 1.5%", width: "96%"}}>
                                    <h4>
                                        Sales Conversion Count
                                    </h4>
                                    <hr/>

                                    <Bar
                                        width={100}
                                        height={60}
                                        data={this.state.SalesConversionData}
                                        redraw={true}
                                        options={{
                                            maintainAspectRatio: true,
                                            scales: {
                                                yAxes: [{
                                                    ticks: {
                                                        min: 0,
                                                        stepSize: this.state.step_size_sales_conversion,
                                                        max: (Math.round(this.state.sales_conversion_max_value / this.state.step_size_sales_conversion) + 2) * this.state.step_size_sales_conversion,
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




                        <Card style={{margin: "2% 0 0 0", width: "44%"}}>
                            <CardContent style={{display: "flex"}}>
                                <div style={{margin: "0% 0.5% 1% 1.5%", width: "96%"}}>
                                    <h4>
                                        Sales Conversion
                                    </h4>
                                    <hr/>

                                    <Line
                                        width={100}
                                        height={60}
                                        data={this.state.SalesConversionPercentData}
                                        redraw={true}
                                        options={{
                                            tooltips: {
                                                intersect: false,
                                            },
                                            hover: {
                                                intersect: false
                                            },
                                            maintainAspectRatio: true,
                                            scales: {
                                                yAxes: [{
                                                    ticks: {
                                                        min: 0,
                                                        max: 100,
                                                        stepSize: 20
                                                    },
                                                    scaleLabel: {
                                                        display: true,
                                                        labelString: "% Conversion"
                                                    }
                                                }]
                                            }
                                        }}>
                                    </Line>
                                </div>

                            </CardContent>

                        </Card>
                    </div>

                    <Divider style={{margin: "1% 5%"}}/>


                    {/*<Card style={{margin: "2% 5%"}}>*/}
                    {/*    <CardContent>*/}
                    {/*        <div style={{margin: "0% 0.5% 1% 1.5%", width: "96%"}}>*/}
                    {/*            <h3>*/}
                    {/*                Sales Conversion Percentage*/}
                    {/*            </h3>*/}
                    {/*            <hr/>*/}
                    {/*            <Bar*/}

                    {/*                yAxisID="% Conversion"*/}
                    {/*                width={100}*/}
                    {/*                height={40}*/}
                    {/*                data={this.state.SalesConversionPercentData}*/}
                    {/*                redraw={true}*/}
                    {/*                options={{*/}
                    {/*                    maintainAspectRatio: true,*/}
                    {/*                    scales: {*/}
                    {/*                        yAxes: [{*/}
                    {/*                            ticks: {*/}
                    {/*                                min: 0,*/}
                    {/*                                stepSize: this.state.step_size_visitor,*/}
                    {/*                                max: (Math.round(this.state.visitor_max_value / this.state.step_size_visitor) + 2) * this.state.step_size_visitor,*/}
                    {/*                            },*/}
                    {/*                            scaleLabel: {*/}
                    {/*                                display: true,*/}
                    {/*                                labelString: "# Visitors"*/}
                    {/*                            }*/}
                    {/*                        }]*/}
                    {/*                    }*/}
                    {/*                }}>*/}
                    {/*            </Bar>*/}
                    {/*        </div>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}
                    {/*<Divider style={{margin: "1% 5%"}}/>*/}
                    {/*<Card style={{margin: "2% 5%"}}>*/}
                    {/*    <CardContent>*/}
                    {/*        <div style={{margin: "0% 0.5% 1% 1.5%", width: "96%"}}>*/}
                    {/*            <h3>*/}
                    {/*                Goal Conversion Over Time*/}
                    {/*            </h3>*/}
                    {/*            <hr/>*/}
                    {/*            <Line*/}
                    {/*                width={100}*/}
                    {/*                height={40}*/}
                    {/*                data={this.state.GoalConversionData}*/}
                    {/*                redraw={this.state.GoalConversionData}*/}
                    {/*                options={{*/}
                    {/*                    tooltips: {*/}
                    {/*                        intersect: false,*/}
                    {/*                    },*/}
                    {/*                    hover: {*/}
                    {/*                        intersect: false*/}
                    {/*                    },*/}
                    {/*                    maintainAspectRatio: true,*/}
                    {/*                    scales: {*/}
                    {/*                        yAxes: [{*/}
                    {/*                            ticks: {*/}
                    {/*                                min: 0,*/}
                    {/*                                max: 100,*/}
                    {/*                            },*/}
                    {/*                            scaleLabel: {*/}
                    {/*                                display: true,*/}
                    {/*                                labelString: "% Goal Conversion"*/}
                    {/*                            }*/}
                    {/*                        }]*/}
                    {/*                    }*/}
                    {/*                }}>*/}
                    {/*            </Line>*/}
                    {/*        </div>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}

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
