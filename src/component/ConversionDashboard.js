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
import {DateRangePicker} from "rsuite";
import $ from "jquery";
import Demo from "./SideDrawer_rsuit";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const {allowedRange} = DateRangePicker;

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
        margin: "0.5% 0% 0% 2%",
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

        this.shop_funnel_ref = React.createRef();
        this.product_conversion_ref = React.createRef();
        this.landing_page_ref = React.createRef();

        let startDate = new Date();

        let today_date = startDate.getDate();
        let today_month = startDate.getMonth();
        let today_year = startDate.getFullYear();

        this.state = {
            access_token: localStorage.getItem("access_token"),
            creation_time: localStorage.getItem("creation_time"),
            start_yearMonthDate: '',
            end_yearMonthDate: '',

            experiment_names: [
                "default-spo",
                "disabled-spo",
                "default-spo_disabled-spo_subscription",
            ],

            select_val: '',
            barWidth: '',

            step_size_shop_funnel: '',
            step_size_product_conversion: '',
            step_size_landing_page: '',

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

            experiment_ids: [],

            startDate: '',
            endDate: '',
            today_yearMonthDate: today_year + '-' + this.pad(today_month + 1) + "-" + this.pad(today_date),

            shop_funnels: {},
            shop_funnels_summary: '',
            shop_funnels_conclusion: '',

            full_product_data: {
                tags: [0, 0],
                results: [0]
            },
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

    getProductTag(nn) {

        if (this.state.full_product_data.results[nn]["products"].length <= 3) {
            this.setState({
                barWidth: 0.2
            })
        } else {
            this.setState({
                barWidth: 0.3
            })
        }


        this.setState({
            select_val: nn,
            full_product_data_tags: this.state.full_product_data.tags
        })

        console.log(this.state.select_val);

        const tickSizes = [
            1, 2, 5,
            10, 20, 50,
            100, 200, 500,
            1000, 2000, 5000,
            10000, 20000, 50000,
            100000, 200000, 500000,
            1000000, 2000000, 5000000
        ];

        let mainDataProduct = [];


        let per_data = [];
        let max_visitor_count = []


        Object.keys(this.state.full_product_data.results[nn]["product_conversion"]).forEach((key) => {
            if (key === "conversion_percentage") {
                per_data.push(this.state.full_product_data.results[nn]["product_conversion"][key])
            } else if (key === "non_conversion_count") {

                for (let ij = 0; ij < this.state.full_product_data.results[nn]["product_conversion"][key].length; ij++) {
                    max_visitor_count.push(this.state.full_product_data.results[nn]["product_conversion"][key][ij] + this.state.full_product_data.results[nn]["product_conversion"]["conversion_count"][ij]);
                }
            }
        })


        console.log("MAX")
        console.log(max_visitor_count)
        // console.log(Math.max.apply(null, max_visitor_count))


        let maxVal = Math.max.apply(null, max_visitor_count)

        for (let r = 0; r < tickSizes.length; r++) {
            console.log("-------" + maxVal);
            let val = maxVal / tickSizes[r]
            if (val < 6) {
                console.log(tickSizes[r]);
                this.setState({
                    step_size_product_conversion: tickSizes[r]
                })
                break
            }
        }


        this.setState({
            conv_per: per_data,
            product_visit_max_val: maxVal
        })

        let i = 0;

        Object.keys(this.state.full_product_data.results[nn]["product_conversion"]).forEach((key) => {

            let localData;

            if (key === "non_conversion_count") {
                localData = {
                    label: "Non Conversion Count",
                    backgroundColor: this.state.bar_background_color[i],
                    borderColor: this.state.bar_background_color[i],
                    borderWidth: 1,
                    hoverBackgroundColor: this.state.bar_background_hover_color[i],
                    hoverBorderColor: this.state.bar_background_hover_color[i],
                    data: this.state.full_product_data.results[nn]["product_conversion"][key],
                    datalabels: {
                        display: false,
                    }
                }

                i = i + 1
                mainDataProduct.push(localData);

            } else if (key === "conversion_count") {

                localData = {
                    label: "Conversion Count",
                    backgroundColor: this.state.bar_background_color[i],
                    borderColor: this.state.bar_background_color[i],
                    borderWidth: 1,
                    hoverBackgroundColor: this.state.bar_background_hover_color[i],
                    hoverBorderColor: this.state.bar_background_hover_color[i],
                    data: this.state.full_product_data.results[nn]["product_conversion"][key],

                    datalabels: {
                        display: true,
                        formatter: (value, context) => {
                            return this.state.conv_per[0][context.dataIndex] + "%";
                        },
                        align: "top",
                        anchor: "end",
                        clip: true,
                        font: {
                            size: "12",
                            weight: "bold"
                        }
                    }
                }

                i = i + 1
                mainDataProduct.push(localData);

            }


        });


        let $product_conversion_summary = $("#product_conversion_summary"),
            product_conversion_summary_str = this.state.full_product_data.results[nn]["summary"],
            product_conversion_summary_html = $.parseHTML(product_conversion_summary_str)

        $product_conversion_summary.html(product_conversion_summary_html);

        let $product_conversion_conclusion = $("#product_conversion_conclusion"),
            product_conversion_conclusion_str = this.state.full_product_data.results[nn]["conclusion"],
            product_conversion_conclusion_html = $.parseHTML(product_conversion_conclusion_str)

        $product_conversion_conclusion.html(product_conversion_conclusion_html);


        this.setState({
            product_conversion: {
                labels: this.state.full_product_data.results[nn]["products"],
                datasets: mainDataProduct
            }
        })

        let shop_fun_ref = this.shop_funnel_ref.chartInstance
        shop_fun_ref.update()


    }


    getAllData(start, end) {

        const tickSizes = [
            1, 2, 5,
            10, 20, 50,
            100, 200, 500,
            1000, 2000, 5000,
            10000, 20000, 50000,
            100000, 200000, 500000,
            1000000, 2000000, 5000000
        ];

        const params = new URLSearchParams({
            start_date: start || this.state.creation_time + 'T00-00-00',
            end_date: end || this.state.today_yearMonthDate + 'T23-59-59'
        })

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
                    if (key === "visitor_count") {
                        shop_funnel_count_data = result["shop_funnel"][key];
                    } else if (key === "percentage") {
                        shop_funnel_per_data.push(result["shop_funnel"][key])
                    }
                })

                let max = Math.max.apply(null, shop_funnel_count_data)

                for (let s = 0; s < tickSizes.length; s++) {
                    let val = max / tickSizes[s]
                    if (val < 6) {
                        this.setState({
                            step_size_shop_funnel: tickSizes[s]
                        })
                        break
                    }
                }

                this.setState({
                    shop_funnel_per: shop_funnel_per_data,
                    shop_funnel_count_per: shop_funnel_count_data,
                    shop_funnel_max_val: max
                })

                // console.log("blah" + this.state.shop_funnel_max_value)

                // alert("asdasd")

                // console.log(shop_funnel_per_data)

                Object.keys(result["shop_funnel"]).forEach((key) => {

                    let localData;
                    if (key === "percentage") {
                        // console.log("something.............")
                        // console.log(result["shop_funnel"][key])
                        // console.log(shop_funnel_per_data)
                        localData = {
                            label: "Traffic Percentage",
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
                                    return this.state.shop_funnel_per[0][context.dataIndex] + "%";
                                },
                                align: "top",
                                anchor: "end",
                                clip: true,
                                font: {
                                    size: "12",
                                    weight: "bold"
                                }
                            }
                        };
                    } else {
                        localData = {
                            label: "Visitor Count",
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
                });

                let shop_fun_ref = this.shop_funnel_ref.chartInstance
                shop_fun_ref.update()


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
            .then(product_result => {

                this.setState({
                    full_product_data: {
                        results: product_result["results"],
                        tags: product_result["tags"]
                    }
                })

                this.getProductTag(0);


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
                let lading_max_visitor_count = []

                Object.keys(result["landing_conversion"]).forEach((key) => {
                    if (key === "conversion_percentage") {
                        landing_per_data.push(result["landing_conversion"][key])
                    } else if (key === "non_conversion_count") {
                        // lading_max_visitor_count = result["landing_conversion"][key]

                        for (let ij = 0; ij < result["landing_conversion"][key].length; ij++) {
                            lading_max_visitor_count.push(result["landing_conversion"][key][ij] + result["landing_conversion"]["conversion_count"][ij]);
                        }

                    }
                })

                let maxVal = Math.max.apply(null, lading_max_visitor_count)

                for (let r = 0; r < tickSizes.length; r++) {
                    console.log("-------" + maxVal);
                    let val = maxVal / tickSizes[r]
                    if (val < 6) {
                        console.log(tickSizes[r]);
                        this.setState({
                            step_size_landing_page: tickSizes[r]
                        })
                        break
                    }
                }


                this.setState({
                    landing_per: landing_per_data,
                    landing_page_max_val: maxVal
                })


                Object.keys(result["landing_conversion"]).forEach((key) => {

                    let localData = {}

                    if (key === "non_conversion_count") {
                        localData = {
                            label: "Non Conversion Count",
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
                            label: "Conversion Count",
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
                                    size: "12",
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

                let shop_fun_ref = this.shop_funnel_ref.chartInstance
                shop_fun_ref.update()


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

                {/*<SideDrawer/>*/}
                <Demo active={localStorage.getItem("activeKey")}/>

                {/* MAIN LAYOUT */}
                <main className={classes.content}>
                    <div className={classes.toolbar}/>

                    <div style={{display: "flex"}}>
                        <h3 style={{margin: "2% 1% 1% 5%"}}>Conversion Dashboard</h3>


                        <Button
                            color="primary"
                            className={classes.button}
                            onClick={() => {
                                if (this.state.start_yearMonthDate !== "") {
                                    this.getAllData(this.state.start_yearMonthDate + 'T00-00-00', this.state.end_yearMonthDate + 'T23-59-59');
                                } else {
                                    this.getAllData(this.state.creation_time + 'T00-00-00', this.state.today_yearMonthDate + 'T23-59-59');
                                }
                            }}
                        ><RefreshRoundedIcon/></Button>

                    </div>

                    <DateRangePicker
                        placeholder="Till Today"
                        size="lg"
                        style={{width: 280, margin: "0% 0% 1% 5%", color: "#111"}}
                        disabledDate={allowedRange(this.state.creation_time, this.state.today_yearMonthDate)}
                        onChange={(selectedStartEndDate) => {

                            function pad(n) {
                                return n < 10 ? '0' + n : n
                            }

                            try {
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

                            } catch (e) {
                                // console.log(e)

                                this.setState({
                                    start_yearMonthDate: ''
                                })

                                this.getAllData(this.state.creation_time + 'T00-00-00', this.state.today_yearMonthDate + 'T23-59-59');
                            }

                        }}
                    />


                    <Divider style={{margin: "0% 5%"}}/>

                    <div style={{display: "flex"}}>
                        <Card style={{margin: "2% 1% 0 5%", width: "44%"}}>
                            <CardContent>

                                <h4 style={{margin: "0.5% 0% 0% 2%"}}>
                                    SHOP FUNNEL ANALYSIS
                                </h4>
                                <Divider style={{margin: "1% 2%"}}/>
                                <div style={{padding: "0.5%", margin: "1% 0% 0% 1%", width: "100%"}}>
                                    <p id={"shop_funnels_summary"}/>
                                    <p id={"shop_funnels_conclusion"}/>
                                </div>

                                <div style={{margin: "0% 0.5% 1% 1.5%", width: "96%"}}>

                                    <Divider style={{margin: "1% 1%"}}/>

                                    <center>
                                        <Bar
                                            width={100}
                                            height={50}
                                            type={'bar'}
                                            ref={(reference) => this.shop_funnel_ref = reference}
                                            data={this.state.shop_funnels}
                                            options={{
                                                maintainAspectRatio: true,
                                                tooltips: {
                                                    callbacks: {
                                                        title: function (tooltipItem, data) {
                                                            return data['labels'][tooltipItem[0]['index']];
                                                        },
                                                        label: function (tooltipItem, data) {
                                                            return data['datasets'][0]['data'][tooltipItem['index']];
                                                        }
                                                    },
                                                    displayColors: false,
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
                                                            stepSize: this.state.step_size_shop_funnel,
                                                            max: (Math.round(this.state.shop_funnel_max_val / this.state.step_size_shop_funnel) + 2) * this.state.step_size_shop_funnel,
                                                            // suggestedMax: 200,
                                                            callback: function (value) {
                                                                return value
                                                            }
                                                        },
                                                    }, {
                                                        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                                        display: false,
                                                        position: "left",
                                                        id: "y-axis-1",
                                                        ticks: {
                                                            min: 0,
                                                            stepSize: this.state.step_size_shop_funnel,
                                                            // suggestedMax: 200,
                                                            max: (Math.round(this.state.shop_funnel_max_val / this.state.step_size_shop_funnel) + 2) * this.state.step_size_shop_funnel,
                                                            callback: function (value) {
                                                                return value
                                                            }
                                                        },
                                                    }]
                                                }
                                            }}>
                                        </Bar>
                                    </center>
                                </div>
                            </CardContent>
                        </Card>

                        <Card style={{margin: "2% 0 0 0", width: "44%"}}>
                            <CardContent>
                                <h4 style={{margin: "0.5% 0% 0% 2%"}}>
                                    LANDING PAGE ANALYSIS
                                </h4>
                                <Divider/>
                                <div style={{padding: "0.5%", margin: "1% 0% 0% 1%", width: "100%"}}>
                                    <p id={"landing_page_conversion_summary"}/>
                                    <p id={"landing_page_conversion_conclusion"}/>
                                </div>

                                <div style={{margin: "0% 0.5% 1% 1.5%", width: "96%"}}>
                                    <hr/>
                                    <Bar
                                        width={100}
                                        height={50}
                                        data={this.state.landing_page_conversion}
                                        ref={(reference) => this.landing_page_ref = reference}
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
                                                        stepSize: this.state.step_size_landing_page,
                                                        max: (Math.round(this.state.landing_page_max_val / this.state.step_size_landing_page) + 2) * this.state.step_size_landing_page,
                                                        callback: function (value) {
                                                            return value
                                                        }
                                                    },
                                                    scaleLabel: {
                                                        display: true,
                                                        labelString: "# Unique Visitors"
                                                    }
                                                }]
                                            }
                                        }}>
                                    </Bar>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Divider style={{margin: "1% 5%"}}/>

                    <Card style={{margin: "2% 5%"}}>
                        <CardContent>

                            <h3 style={{margin: "0.5% 0% 0% 2%"}}>
                                PRODUCT CONVERSION ANALYSIS
                            </h3>

                            <Divider style={{margin: "1% 2%"}}/>

                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">Product Tag</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    value={this.state.select_val}
                                    onChange={(e) => {
                                        console.log(this.state.select_val);
                                        this.setState({select_val: e.target.value})
                                        this.getProductTag(e.target.value);
                                    }}
                                    label="Product Tag">

                                    {this.state.full_product_data.tags.map((pro_tag) => (
                                        <MenuItem
                                            className={classes.expMenu}
                                            key={this.state.full_product_data.tags.indexOf(pro_tag)}
                                            value={this.state.full_product_data.tags.indexOf(pro_tag)}>
                                            {pro_tag}
                                        </MenuItem>
                                    ))}

                                    {/*{this.state.experiment_names.map((exp_name) => (*/}
                                    {/*    <MenuItem className={classes.expMenu} value={exp_name[0]}>{exp_name[0]}</MenuItem>*/}
                                    {/*))}*/}

                                </Select>
                            </FormControl>

                            <Divider style={{margin: "1% 2%"}}/>

                            <div style={{padding: "0.5%", margin: "1% 0% 0% 2%", width: "97%"}}>
                                <p id={"product_conversion_summary"}/>
                                <p id={"product_conversion_conclusion"}/>
                            </div>

                            <div style={{margin: "0% 0.5% 1% 1.5%", width: "96%"}}>

                                <hr/>

                                <Bar
                                    yAxisID="Unique Visitors"
                                    width={100}
                                    height={50}
                                    redraw={true}
                                    ref={(reference) => this.product_conversion_ref = reference}
                                    data={this.state.product_conversion}
                                    options={{
                                        maintainAspectRatio: true,
                                        scales: {
                                            xAxes: [{
                                                stacked: true,
                                                barPercentage: this.state.barWidth
                                            }],
                                            yAxes: [{
                                                stacked: true,
                                                ticks: {
                                                    min: 0,
                                                    stepSize: this.state.step_size_product_conversion,
                                                    max: (Math.round(this.state.product_visit_max_val / this.state.step_size_product_conversion) + 2) * this.state.step_size_product_conversion,
                                                    callback: function (value) {
                                                        return value
                                                    }
                                                },
                                                scaleLabel: {
                                                    display: true,
                                                    labelString: "# Unique Visitors"
                                                }
                                            }]
                                        },

                                    }}>
                                </Bar>
                            </div>
                        </CardContent>
                    </Card>

                    <Divider style={{margin: "1% 5%"}}/>


                </main>
            </div>
        )
    }
}

export default withRouter(withStyles(exp_style)(ConversionDashboard))
