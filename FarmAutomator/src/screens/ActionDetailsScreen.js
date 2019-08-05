import React from 'react';
import {
    Keyboard, KeyboardType,
    TextInput, View, Text, ActivityIndicator, Alert, Picker,
    ListView, SectionList, 
    TouchableOpacity,
    Linking, StyleSheet,
    Image,
} from 'react-native';

import {
    Container, Header, Footer, FooterTab, Content,
    Left, Right, Body, List,
    Form, Item, Label, Input,
    Title, Accordion, Button, Segment,
    SwipeRow,
    Card, CardItem,
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
            picturePaths: [],
        };

        this.onScanQr = this.onScanQr.bind(this);
        this.onScanQrCallback = this.onScanQrCallback.bind(this);
        this.onTakePicture = this.onTakePicture.bind(this);
        this.onTakePictureCallback = this.onTakePictureCallback.bind(this);
        this.onRemovePicture = this.onRemovePicture.bind(this);
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

                    <Button onPress={this.onScanQr}><Text>Scan QR</Text></Button>

                    {this.state.picturePaths.map((picturePath, index) => (
                        <Card>
                            <CardItem cardBody>
                                <Image key={picturePath} source={{ uri: picturePath }} style={{ height: 200, width: null, flex: 1 }} />
                            </CardItem>
                            <CardItem>
                                <Button onPress={() => this.onRemovePicture(index)}><Text>Remove</Text></Button>
                            </CardItem>
                        </Card>
                    ))}

                    <Button onPress={this.onTakePicture}><Text>Take Picture</Text></Button>

                </Content>
            </Container>
        );
    }

    onScanQr(evt) {
        this.props.navigation.navigate('ScanQr', { onScanQrCallback: this.onScanQrCallback });
    }

    onScanQrCallback(qr) {
        this.setState({ qr });
    }

    onTakePicture(evt) {
        this.props.navigation.navigate('TakePicture', { onTakePictureCallback: this.onTakePictureCallback });
    }
            
    onTakePictureCallback(picturePath) {
        this.setState({ picturePaths: [...this.state.picturePaths, picturePath] });
    }

    onRemovePicture(index) {
        var pics = [...this.state.picturePaths];
        pics.splice(index, 1);
        this.setState({ picturePaths: [...pics] });
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
