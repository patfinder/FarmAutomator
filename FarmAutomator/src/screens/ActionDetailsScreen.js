import React from 'react';
import {
    Keyboard, KeyboardType,
    TextInput, View, Text, ActivityIndicator, Alert, Picker,
    ListView, SectionList, 
    TouchableOpacity,
    Linking, StyleSheet,
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

import QRCodeScanner from 'react-native-qrcode-scanner';

class ActionDetailsScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            qr: '',
            scanned: false,
        };

        this.onScanCage = this.onScanCage.bind(this);
        this.onScanQrSuccess = this.onScanQrSuccess.bind(this);
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
                        placeholder='QR Code'
                        maxLength={40}
                        value={this.state.qr}
                        onChangeText={(val) => this.setState({qr: val})}
                    />
                    <Button onPress={this.onScanCage}><Text>Scan QR</Text></Button>

                </Content>
            </Container>
        );
    }

    onScanCage(evt) {
        this.props.navigation.navigate('ScanQr');
    }

    onScanQrSuccess(evt) {

        console.log(evt);
        this.setState({ qr: e.data });

        //Linking
        //    .openURL(evt.data)
        //    .catch(err => console.error('An error occured', err));
    }
}

const styles = StyleSheet.create({
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
});

export default ActionDetailsScreen;
