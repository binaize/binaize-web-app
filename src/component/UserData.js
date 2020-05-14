import {extendObservable} from "mobx";
import {AppProvider, Button, Card, Page} from "@shopify/polaris";
import enTranslations from '@shopify/polaris/locales/en.json';
import React from "react";

class UserData {
    constructor() {
        extendObservable(this, {
            loading: true,
            isLoggedIn: false,
            username: ''
        });
    }

    render(){
        return(
            <AppProvider i18n={enTranslations}>
                <Page title="Binaize Login">
                    <Card sectioned>
                        <Button primary>Example button</Button>
                    </Card>
                </Page>
            </AppProvider>
        )
    }


}

export default new UserData();