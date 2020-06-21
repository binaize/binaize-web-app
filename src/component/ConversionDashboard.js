import React from 'react';
import {
    REACT_APP_BASE_URL,
    REACT_APP_URL_SHOP_FUNNEL,
    REACT_APP_URL_PRODUCT_CONVERSION,
    REACT_APP_URL_LANDING_PAGE
} from "../config"

import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import {fade} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {withRouter} from "react-router-dom";
import "./Experiments.css"
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {Bar} from "react-chartjs-2";
import AppToolbar from "./AppToolbar";
import SideDrawer from "./SideDrawer";
import Button from "@material-ui/core/Button";
import RefreshRoundedIcon from "@material-ui/icons/RefreshRounded";

import ChartDataLabels from 'chartjs-plugin-datalabels';
import {DatePicker, DateRangePicker} from "rsuite";
import $ from "jquery";

const {allowedRange} = DateRangePicker;

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

class ConversionDashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            access_token: localStorage.getItem("access_token"),
            creation_time: localStorage.getItem("creation_time"),
            start_yearMonthDate: '',
            end_yearMonthDate: '',
            select_val: "",
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
            bar_background_color: ['#2196f3', '#4caf50', '#ef6c00'],
            bar_background_hover_color: ['#006FBB', '#50B83C', '#DE3618'],
            variation_name2: ["Variation Yel", "Original", "Variation Blue"],
            experiment_names: [],
            experiment_ids: [],
            startDate: '',
            endDate: '',

            shop_funnels: {},
            shop_funnels_summary: '',
            shop_funnels_conclusion: '',

            product_conversion: {},
            product_conversion_summary: '',
            product_conversion_conclusion: '',

            landing_page_conversion: {},
            landing_page_conversion_summary: '',
            landing_page_conversion_conclusion: '',

            shop_funnel_per: [],
            shop_funnel_count_per: [],
            shop_funnel_max_val: '',
            conv_per: [],
            product_visit_max_val: '',
            landing_page_max_val: '',
            landing_per: []
        }

        if (this.state.access_token === "") {
            this.props.history.push("/");
        }

    }

    pad(n) {
        return n < 10 ? '0' + n : n
    }




    getAllData(start, end) {

        let startDate = new Date();

        let today_date = startDate.getDate();
        let today_month = startDate.getMonth();
        let today_year = startDate.getFullYear();
        let today_yearMonthDate = today_year + '-' + this.pad(today_month + 1) + "-" + this.pad(today_date);

        this.setState({selected: this.state.selected})
        const params = new URLSearchParams({
            start_date: start || this.state.creation_time + 'T00-00-00',
            end_date: end || today_yearMonthDate + 'T23-59-59'
        })




        // console.log(today_yearMonthDate + 'T23-59-59')



        console.log(params.toString())

        let access = "Bearer " + this.state.access_token;

        // SHOP FUNNEL API CALL
        fetch(REACT_APP_BASE_URL + REACT_APP_URL_SHOP_FUNNEL + `?${params.toString()}`, {
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

                let mainDataFunnel = [];
                let i = 0;
                let shop_funnel_per_data = []
                let shop_funnel_count_data = ''

                Object.keys(result["shop_funnel"]).sort().forEach((key) => {
                    if (key === "count") {
                        shop_funnel_count_data = result["shop_funnel"][key];
                    } else if (key === "percentage") {
                        shop_funnel_per_data.push(result["shop_funnel"][key])
                    }
                })

                this.setState({
                    shop_funnel_per: shop_funnel_per_data,
                    shop_funnel_count_per: shop_funnel_count_data,
                    shop_funnel_max_val: Math.max.apply(null, shop_funnel_count_data)
                })

                // console.log("blah" + this.state.shop_funnel_max_value)

                // alert("asdasd")

                // console.log(shop_funnel_per_data)

                Object.keys(result["shop_funnel"]).sort().forEach((key) => {

                    let localData;
                    if (key === "percentage") {
                        // console.log("something.............")
                        // console.log(result["shop_funnel"][key])
                        // console.log(shop_funnel_per_data)
                        localData = {
                            label: key,
                            type: 'line',
                            fill: false,
                            tooltips: {
                                enabled: false
                            },
                            borderWidth: 2,
                            backgroundColor: this.state.bar_background_color[i],
                            borderColor: this.state.bar_background_color[i],
                            hoverBackgroundColor: this.state.bar_background_hover_color[i],
                            hoverBorderColor: this.state.bar_background_hover_color[i],
                            data: shop_funnel_count_data,
                            yAxisID: "y-axis-1",
                            datalabels: {
                                display: true,
                                formatter: (value, context) => {
                                    // console.log("asdasdasdasdasdddddddddddddddddddddddddddddddddd")
                                    return this.state.shop_funnel_per[0][context.dataIndex]  + " %";
                                },
                                align: "top",
                                anchor: "end",
                                clip: true,
                                font: {
                                    size: "16",
                                    weight: "bold"
                                }
                            }
                        };
                    } else {
                        localData = {
                            label: key,
                            backgroundColor: this.state.bar_background_color[i],
                            borderColor: this.state.bar_background_color[i],
                            borderWidth: 1,
                            hoverBackgroundColor: this.state.bar_background_hover_color[i],
                            hoverBorderColor: this.state.bar_background_hover_color[i],
                            data: result["shop_funnel"][key],
                            yAxisID: "y-axis-2",
                            datalabels: {
                                display: false
                            }
                        }
                    }
                    i = i + 1;
                    mainDataFunnel.push(localData);

                });

                console.log("summary")
                console.log(result["summary"])

                let $shop_funnels_summary = $("#shop_funnels_summary"),
                    shop_funnels_summary_str = result["summary"],
                    shop_funnels_summary_html = $.parseHTML(shop_funnels_summary_str)

                $shop_funnels_summary.html(shop_funnels_summary_html);

                let $shop_funnels_conclusion = $("#shop_funnels_conclusion"),
                    shop_funnels_summary_conclusion_str = result["conclusion"],
                    shop_funnels_summary_conclusion_html = $.parseHTML(shop_funnels_summary_conclusion_str)

                $shop_funnels_conclusion.html(shop_funnels_summary_conclusion_html);



                this.setState({
                    shop_funnels: {
                        labels: result.pages,
                        datasets: mainDataFunnel
                    }
                })

            })
            .catch(err => {
                console.log(err);
            });


        // PRODUCT CONVERSION API CALL
        fetch(REACT_APP_BASE_URL + REACT_APP_URL_PRODUCT_CONVERSION + `?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {

                // console.log("HELLLLLLLLLLOOOOOOOOOOO");
                // console.log(result);


                let mainDataProduct = [];
                let i = 0;

                let per_data = [];
                let max_visitor_count

                Object.keys(result["product_conversion"]).forEach((key) => {
                    if (key === "conversion_percentage") {
                        per_data.push(result["product_conversion"][key])
                    } else if (key === "visitor_count") {
                        max_visitor_count = result["product_conversion"][key]
                    }
                })

                // // console.log(max_visitor_count.sort())
                // // console.log(Math.max.apply(null, max_visitor_count))

                this.setState({
                    conv_per: per_data,
                    product_visit_max_val: Math.max.apply(null, max_visitor_count)
                })

                Object.keys(result["product_conversion"]).forEach((key) => {

                    let localData;

                    if (key === "visitor_count") {
                        localData = {
                            label: key,
                            backgroundColor: this.state.bar_background_color[i],
                            borderColor: this.state.bar_background_color[i],
                            borderWidth: 1,
                            hoverBackgroundColor: this.state.bar_background_hover_color[i],
                            hoverBorderColor: this.state.bar_background_hover_color[i],
                            data: result["product_conversion"][key],
                            datalabels: {
                                display: false,
                            }
                        }

                        i = i + 1
                        mainDataProduct.push(localData);

                    } else if (key === "conversion_count") {

                        localData = {
                            label: key,
                            backgroundColor: this.state.bar_background_color[i],
                            borderColor: this.state.bar_background_color[i],
                            borderWidth: 1,
                            hoverBackgroundColor: this.state.bar_background_hover_color[i],
                            hoverBorderColor: this.state.bar_background_hover_color[i],
                            data: result["product_conversion"][key],

                            datalabels: {
                                display: true,
                                formatter: (value, context) => {
                                    return this.state.conv_per[0][context.dataIndex] + "%";
                                },
                                align: "top",
                                anchor: "end",
                                clip: true,
                                font: {
                                    size: "16",
                                    weight: "bold"
                                }
                            }
                        }

                        i = i + 1
                        mainDataProduct.push(localData);

                    }


                });


                let $product_conversion_summary = $("#product_conversion_summary"),
                    product_conversion_summary_str = result["summary"],
                    product_conversion_summary_html = $.parseHTML(product_conversion_summary_str)

                $product_conversion_summary.html(product_conversion_summary_html);

                let $product_conversion_conclusion = $("#product_conversion_conclusion"),
                    product_conversion_conclusion_str = result["conclusion"],
                    product_conversion_conclusion_html = $.parseHTML(product_conversion_conclusion_str)

                $product_conversion_conclusion.html(product_conversion_conclusion_html);



                this.setState({
                    product_conversion: {
                        labels: result.products,
                        datasets: mainDataProduct
                    }
                })

            })
            .catch(err => {
                console.log(err);
            })


        // LANDING PAGE API CALL
        fetch(REACT_APP_BASE_URL + REACT_APP_URL_LANDING_PAGE + `?${params.toString()}`, {
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

                let mainDataLanding = [];

                let i = 0;
                let landing_per_data = [];
                let lading_max_visitor_count

                Object.keys(result["landing_conversion"]).forEach((key) => {
                    if (key === "conversion_percentage") {
                        landing_per_data.push(result["landing_conversion"][key])
                    } else if (key === "visitor_count") {
                        lading_max_visitor_count = result["landing_conversion"][key]
                    }
                })

                this.setState({
                    landing_per: landing_per_data,
                    landing_page_max_val: Math.max.apply(null, lading_max_visitor_count)
                })


                Object.keys(result["landing_conversion"]).forEach((key) => {

                    let localData = {}
                    // localData = {
                    //     label: key,
                    //     backgroundColor: this.state.bar_background_color[i],
                    //     borderColor: this.state.bar_background_color[i],
                    //     borderWidth: 1,
                    //     hoverBackgroundColor: this.state.bar_background_hover_color[i],
                    //     hoverBorderColor: this.state.bar_background_hover_color[i],
                    //     data: result["landing_conversion"][key]
                    // }
                    // i = i + 1
                    // mainDataLanding.push(localData);


                    if (key === "visitor_count") {
                        localData = {
                            label: key,
                            backgroundColor: this.state.bar_background_color[i],
                            borderColor: this.state.bar_background_color[i],
                            borderWidth: 1,
                            hoverBackgroundColor: this.state.bar_background_hover_color[i],
                            hoverBorderColor: this.state.bar_background_hover_color[i],
                            data: result["landing_conversion"][key],
                            datalabels: {
                                display: false,
                            }
                        }

                        i = i + 1
                        mainDataLanding.push(localData);

                    } else if (key === "conversion_count") {

                        localData = {
                            label: key,
                            backgroundColor: this.state.bar_background_color[i],
                            borderColor: this.state.bar_background_color[i],
                            borderWidth: 1,
                            hoverBackgroundColor: this.state.bar_background_hover_color[i],
                            hoverBorderColor: this.state.bar_background_hover_color[i],
                            data: result["landing_conversion"][key],

                            datalabels: {
                                display: true,
                                formatter: (value, context) => {
                                    return this.state.landing_per[0][context.dataIndex] + "%";
                                },
                                align: "top",
                                anchor: "end",
                                clip: true,
                                font: {
                                    size: "16",
                                    weight: "bold"
                                }
                            }
                        }

                        i = i + 1
                        mainDataLanding.push(localData);

                    }


                });


                //
                //
                //
                // Object.keys(data3.landing_conversion).forEach(function (key) {
                //     data.push(key)
                //     datasets.push(data3.landing_conversion[key])
                // });
                // // // console.log(data);
                // // // console.log(datasets);
                //
                // let localdata = {}
                //
                // let i = 0;
                // for (i; i < data.length; i++) {
                //
                //     localdata = {
                //         label: data[i],
                //         backgroundColor: this.state.bar_background_color[i],
                //         borderColor: this.state.bar_background_color[i],
                //         borderWidth: 1,
                //         hoverBackgroundColor: this.state.bar_background_hover_color[i],
                //         hoverBorderColor: this.state.bar_background_hover_color[i],
                //         data: datasets[i]
                //     }
                //     mainDataLanding.push(localdata);
                //     localdata = {}
                // }

                let $landing_page_conversion_summary = $("#landing_page_conversion_summary"),
                    landing_page_conversion_summary_str = result["summary"],
                    landing_page_conversion_summary_html = $.parseHTML(landing_page_conversion_summary_str)

                $landing_page_conversion_summary.html(landing_page_conversion_summary_html);

                let $landing_page_conversion_conclusion = $("#landing_page_conversion_conclusion"),
                    landing_page_conversion_conclusion_str = result["conclusion"],
                    landing_page_conversion_conclusion_html = $.parseHTML(landing_page_conversion_conclusion_str)

                $landing_page_conversion_conclusion.html(landing_page_conversion_conclusion_html);


                this.setState({
                    landing_page_conversion: {
                        labels: result["pages"],
                        datasets: mainDataLanding
                    }
                })


            })
            .catch(err => {
            console.log(err);
        });

    }

    componentDidMount() {
        this.getAllData();
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
                        <h2 style={{margin: "2% 1% 1% 5%"}}>Conversion Dashboard</h2>


                        <Button
                            color="primary"
                            className={classes.button}
                            onClick={() => {
                                if (this.state.start_yearMonthDate !== "") {
                                    this.getAllData(this.state.start_yearMonthDate + 'T00-00-00', this.state.end_yearMonthDate + 'T23-59-59');
                                } else {
                                    this.getAllData(this.state.creation_time + 'T00-00-00', this.state.creation_time + 'T23-59-59');

                                }
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

                    <DateRangePicker
                        placeholder="Till Today"
                        size="lg"
                        style={{ width: 280, margin: "0% 0% 1% 5%", color: "#111"}}
                        disabledDate={allowedRange(this.state.creation_time, '2022-10-01')}
                        onChange={(selectedStartEndDate) => {

                            function pad(n) {
                                return n < 10 ? '0' + n : n
                            }

                            try{
                                let startDate = selectedStartEndDate[0]
                                let endDate = selectedStartEndDate[1]

                                let s_date = startDate.getDate();
                                let s_month = startDate.getMonth();
                                let s_year = startDate.getFullYear();
                                let s_yearMonthDate = s_year + '-' + pad(s_month + 1) + "-" + pad(s_date);


                                let e_date = endDate.getDate();
                                let e_month = endDate.getMonth();
                                let e_year = endDate.getFullYear();
                                let e_yearMonthDate = e_year + '-' + pad(e_month + 1) + "-" + pad(e_date);

                                // Takes sometime to set the state
                                this.setState({
                                    start_yearMonthDate: s_yearMonthDate,
                                    end_yearMonthDate: e_yearMonthDate,
                                })

                                this.getAllData(s_yearMonthDate + 'T00-00-00', e_yearMonthDate + 'T23-59-59')

                            }catch (e) {
                                console.log(e)
                            }

                        }}
                    />


                    <Divider style={{margin: "0% 5%"}}/>


                    <Card style={{margin: "2% 5%"}}>
                        <CardContent>

                            <h3 style={{margin: "0.5% 0% 0% 2%"}}>
                                SHOP FUNNEL ANALYSIS
                            </h3>
                            <Divider/>
                            <div style={{padding: "0.5%", margin: "1% 0% 0% 2%", width: "97%"}}>
                                <p id={"shop_funnels_summary"}/>
                                <p id={"shop_funnels_conclusion"}/>
                            </div>


                            <div style={{margin: "0% 0.5% 1% 1.5%", width: "80%"}}>

                                <hr/>
                                <Bar
                                    width={45}
                                    height={20}
                                    type={'bar'}
                                    data={this.state.shop_funnels}
                                    redraw={this.state.shop_funnels}
                                    options={{
                                        maintainAspectRatio: true,
                                        tooltips: {
                                            callbacks: {
                                                title: function(tooltipItem, data) {
                                                    return data['labels'][tooltipItem[0]['index']];
                                                },
                                                label: function(tooltipItem, data) {
                                                    return data['datasets'][0]['data'][tooltipItem['index']];
                                                }
                                            },
                                            displayColors: false
                                        },

                                        scales: {
                                            xAxes: [{
                                                barPercentage: 0.5,
                                                linePercentage: 0.5
                                            }],
                                            yAxes: [{
                                                type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                                display: true,
                                                position: "left",
                                                id: "y-axis-2",

                                                // grid line settings
                                                gridLines: {
                                                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                                                },
                                                scaleLabel: {
                                                    display: true,
                                                    labelString: "# Visitors"
                                                },
                                                ticks: {
                                                    min: 0,
                                                    max: (Math.round(this.state.shop_funnel_max_val / 100) + 2)  * 100,
                                                    callback: function (value) {
                                                        return value
                                                    }
                                                },
                                            },{
                                                type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                                display: false,
                                                position: "left",
                                                id: "y-axis-1",
                                                ticks: {
                                                    max: (Math.round(this.state.shop_funnel_max_val / 100) + 2)  * 100,
                                                    callback: function (value) {
                                                        return value
                                                    }
                                                },
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

                            <h3 style={{margin: "0.5% 0% 0% 2%"}}>
                                PRODUCT CONVERSION ANALYSIS
                            </h3>
                            <Divider/>
                            <div style={{padding: "0.5%", margin: "1% 0% 0% 2%", width: "97%"}}>
                                <p id={"product_conversion_summary"}/>
                                <p id={"product_conversion_conclusion"}/>
                            </div>

                            <div style={{margin: "0% 0.5% 1% 1.5%", width: "85%"}}>

                                <hr/>

                                <Bar
                                    yAxisID="Unique Visitors"
                                    width={45}
                                    height={20}
                                    data={this.state.product_conversion}
                                    redraw={this.state.product_conversion}
                                    options={{
                                        maintainAspectRatio: true,
                                        scales: {
                                            xAxes: [{
                                                stacked: true,
                                                barPercentage: 0.5
                                            }],
                                            yAxes: [{
                                                stacked: true,
                                                ticks: {
                                                    min: 0,
                                                    max: (Math.round(this.state.product_visit_max_val / 10) + 2) * 10,
                                                    callback: function (value) {
                                                        return value
                                                    }
                                                },
                                                scaleLabel: {
                                                    display: true,
                                                    labelString: "Unique Visitors"
                                                }
                                            }]
                                        },

                                    }}>
                                </Bar>
                            </div>
                        </CardContent>
                    </Card>

                    <Divider style={{margin: "1% 5%"}}/>

                    <Card style={{margin: "2% 5%"}}>
                        <CardContent>
                            <h3 style={{margin: "0.5% 0% 0% 2%"}}>
                                LANDING PAGE ANALYSIS
                            </h3>
                            <Divider/>
                            <div style={{padding: "0.5%", margin: "1% 0% 0% 2%", width: "97%"}}>
                                <p id={"landing_page_conversion_summary"}/>
                                <p id={"landing_page_conversion_conclusion"}/>
                            </div>

                            <div style={{margin: "0% 0.5% 1% 1.5%", width: "80%"}}>
                                <hr/>
                                <Bar
                                    width={50}
                                    height={20}
                                    data={this.state.landing_page_conversion}
                                    redraw={this.state.landing_page_conversion}
                                    options={{
                                        maintainAspectRatio: true,
                                        scales: {
                                            xAxes: [{
                                                stacked: true,
                                                barPercentage: 0.3
                                            }],
                                            yAxes: [{
                                                stacked: true,
                                                ticks: {
                                                    min: 0,
                                                    max: (Math.round(this.state.landing_page_max_val / 100) + 2) * 100,
                                                    callback: function (value) {
                                                        return value
                                                    }
                                                },
                                                scaleLabel: {
                                                    display: true,
                                                    labelString: "Unique Visitors"
                                                }
                                            }]
                                        }
                                    }}>
                                </Bar>
                            </div>
                        </CardContent>
                    </Card>


                </main>
            </div>
        )
    }
}

export default withRouter(withStyles(exp_style)(ConversionDashboard))
