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

import QRCodeScanner from 'react-native-qrcode-scanner';
import console = require('console');

class ScanQRScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            qr: '',
            scanned: false,
        }

        this.onScanQrSuccess = this.onScanQrSuccess.bind(this);
    }

    render() {
        return (
            <Container style={styles.container}>
                <QRCodeScanner
                    onRead={this.onScanQrSuccess}
                    topContent={
                        <Text style={styles.centerText}>Please scan cage QR code</Text>
                    }
                />
            </Container>
        );
    }

    onScanQrSuccess(evt) {

        console.lo('ScanQRScreen.onScanQrSuccess', evt);
        this.props.onQrScanned(evt.data);
        this.props.navigation.goBack();

        //Linking
        //    .openURL(evt.data)
        //    .catch(err => console.error('An error occured', err));
    }}

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
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
});

export default ScanQRScreen;
