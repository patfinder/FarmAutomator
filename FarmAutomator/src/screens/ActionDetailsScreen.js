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

import QualtityInput from './Shared/QuantityInput';

/**
 * This screen allow user to go to a cage, scan QR code, input quantity and capture pictures.
 * */
class ActionDetailsScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            qr: '',
            quantitty: '',
            picturePaths: [],
        };

        this.onScanQr = this.onScanQr.bind(this);
        this.onScanQrCallback = this.onScanQrCallback.bind(this);
        this.onQuantityChange = this.onQuantityChange.bind(this);

        this.onTakePicture = this.onTakePicture.bind(this);
        this.onTakePictureCallback = this.onTakePictureCallback.bind(this);
        this.onRemovePicture = this.onRemovePicture.bind(this);

        this.onGoBack = this.onGoBack.bind(this);
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
                
                <Content style={{ margin: 10 }}>

                    {/* Scan QR */}
                    <View style={styles.row}>
                        <TextInput
                            style={styles.textInput}
                            placeholder='QR Code'
                            maxLength={40}
                            value={this.state.qr}
                            onChangeText={(val) => this.setState({qr: val})}
                        />

                        <Button style={styles.button} onPress={this.onScanQr}><Text>Scan QR</Text></Button>
                    </View>

                    {/* Qualtity */}
                    <QualtityInput
                        style={styles.textInput}
                        placeholder={i18n.t('action.quantity_placeholder')}
                        maxLength={40}
                        onBlur={Keyboard.dismiss}
                        value={this.state.quantity}
                        onQuantityChange={this.onQuantityChange}
                    />

                    {/* Picture */}
                    {this.state.picturePaths.map((picturePath, index) => (
                        <Card>
                            <CardItem cardBody>
                                <Image key={picturePath} source={{ uri: picturePath }} style={{ height: 200, width: null, flex: 1 }} />
                            </CardItem>
                            <CardItem>
                                <Button style={styles.button} onPress={() => this.onRemovePicture(index)}><Text>Remove</Text></Button>
                            </CardItem>
                        </Card>
                    ))}

                    <View style={styles.row}>
                        <Button style={styles.button} onPress={this.onTakePicture} ><Text>Take Picture</Text></Button>
                        <Text style={{margin: 10}}></Text>
                        <Button style={styles.button} onPress={this.onTakePicture} ><Text>Done</Text></Button>
                    </View>

                </Content>
            </Container>
        );
    }

    // QR
    onScanQr(evt) {
        this.props.navigation.navigate('ScanQr', { onScanQrCallback: this.onScanQrCallback });
    }

    onScanQrCallback(qr) {
        this.setState({ qr });
    }

    // Quantity
    onQuantityChange(val) {
        this.setState({ quantity: val.trim() });
    }

    // Picture
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

    // Done
    onGoBack() {

        var errors = [];

        // Validate
        if (!this.state.qr) errors.push("Please scan QR");

        if (!this.state.quantitty) errors.push("Please input quantity");

        if (errors.length) {
            Alert.alert(errors.join('\r\n'));
            return;
        }

        this.props.navigation.state.params.onScanQrCallback(this.);
        this.props.navigation.goBack();
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    row: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        width: '80%',
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20,
    },
    button: {
        width: 100,
    }
});

export default ActionDetailsScreen;
