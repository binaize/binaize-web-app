import React, {useState} from 'react';

import '@shopify/polaris/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider, Page, Card, Button, TextField} from '@shopify/polaris';

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";


import '../App.css';
import Experiments from "./component/Experiments";


const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [access_token, setAccessToken] = useState('');

    const getUserName = (e) => {
        setUsername(e);
    }
    const getPassword = (e) => {
        setPassword(e);
    }

    const getAccessToken = async (e) => {
        console.log("Token: " + e)
        await setAccessToken(e);
    }

    const loginUser = async () => {

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            console.log(username);
            console.log(password);


            await fetch('https://api.dev.binaize.com/token', {
                method: 'post',
                body: formData
            })
                .then(response => response.json())
                .then(result => {
                    console.log("Success:", result.access_token);
                    getAccessToken(result.access_token);
                });

        } catch (e) {
            console.error("Error!", e);
        }
    }


    return (<Page title="Binaize Login">
        <Card sectioned>

            <TextField type="email" label="Username" value={username} onChange={(e) => {
                getUserName(e)
            }}/>

            <TextField type="password" label="Password" value={password} onChange={(e) => {getPassword(e)}}/>

            {/*get token after click and send to FullDataTable down.. */}
            <Button primary onClick={() => {
                loginUser().then(() => console.log(access_token));
            }}>Example button</Button>
        </Card>
    </Page>)

};


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            access_token: ''
        };
    }




    //
    // FullDataTable() {
    //
    //     try {
    //         // const formData = new FormData();
    //         // formData.append('username', this.state.username);
    //         // formData.append('password', this.state.password);
    //
    //         fetch('https://api.dev.binaize.com/list_experiments', {
    //             method: 'get',
    //             headers : {
    //                 'Authorization': "props.access_token"
    //             }
    //         })
    //             .then(response => response.json())
    //             .then(result => {
    //                 console.log("Success:", result);
    //             });
    //
    //     } catch (e) {
    //         console.error("Error!", e);
    //     }
    //
    //
    //     const rows = [
    //         [
    //             <Link url="https://www.example.com" key="emerald-silk-gown" >
    //                 Emerald Silk Gown
    //             </Link>,
    //             '$875.00',
    //             124689,
    //             140,
    //             '$121,500.00',
    //             '$121,500.00',
    //         ],
    //         [
    //             <Link url="https://www.example.com" key="mauve-cashmere-scarf" >
    //                 Mauve Cashmere Scarf
    //             </Link>,
    //             '$230.00',
    //             124533,
    //             83,
    //             '$19,090.00',
    //             '$19,090.00',
    //         ],
    //         [
    //             <Link url="https://www.example.com" key="navy-merino-wool" >
    //                 Navy Merino Wool Blazer with khaki chinos and yellow belt
    //             </Link>,
    //             '$445.00',
    //             124518,
    //             32,
    //             '$14,240.00',
    //             '$14,240.00',
    //         ],
    //     ];
    //
    //     return (
    //         <Page title="Sales by product">
    //             <Card>
    //                 <DataTable
    //                     columnContentTypes={[
    //                         'text',
    //                         'text',
    //                         'text',
    //                         'text',
    //                         'text',
    //                         'text'
    //                     ]}
    //                     headings={[
    //                         'Experiments',
    //                         'Type',
    //                         'Status',
    //                         'Page',
    //                         'Created On',
    //                         'Last Updated On'
    //                     ]}
    //                     rows={rows}
    //                     footerContent={`Showing ${rows.length} of ${rows.length} results`}
    //                 />
    //             </Card>
    //         </Page>
    //     );
    //
    // }
    //


    render() {
        return (
            <AppProvider i18n={enTranslations}>

                <Router>

                    <Switch>

                        <Route exact={true} path={"/"} render={() => (
                            <Login/>
                        )}/>



                        <Route exact={true} path={"/exp"} component={Experiments} />

                    </Switch>

                </Router>


            </AppProvider>
        );
    }

}

export default App;
