import React from 'react';
import {
    Keyboard, KeyboardType,
    TextInput, View, Text, ActivityIndicator, Alert, Picker,
    ListView, SectionList, 
    TouchableOpacity,
    Linking, 
} from 'react-native';

import {
    Container, Header, Footer, FooterTab, Content,
    Left, Right, Body, List,
    Form, Item, Label, Input,
    Title, Accordion, Button, Segment,
    SwipeRow,
} from "native-base";

import { Grid, Row, Col } from "react-native-easy-grid";

import Icon from 'react-native-vector-icons/Feather';
import i18n from '../i18n';

class ActionDetailsScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            qr: '',
        };
    }

    render() {

        return (
            <Container style={styles.container}>
                <Header>
                    <Left />
                    <Body>
                        <Title>Feed Details</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <TextInput
                        style={styles.textInput}
                        placeholder={i18n.t('action_details.qr_code')}
                        maxLength={40}
                        value={this.state.qr}
                        onChangeText={(val) => this.setState({qr: val})}
                    />

                </Content>
            </Container>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    textInput: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        width: '80%',
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20
    },
};

export default ActionDetailsScreen;
