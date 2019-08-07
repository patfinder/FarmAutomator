import React from 'react';
import {
    Keyboard, KeyboardType,
    TextInput, View, Text, ActivityIndicator, Alert, Picker,
    ListView, SectionList, StyleSheet, Image, 
} from 'react-native';

import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Feather';
import i18n from '../i18n';
import settings from '../settings';
//import { Button } from '../components/common';
import { Switch } from 'react-native-gesture-handler';

import {
    Container, Header, Footer, FooterTab, Content,
    Left, Right, Body, List,
    Form, Item, Label, Input,
    Title, Accordion, Button, Segment,
    SwipeRow,
    Card,
    CardItem,
} from "native-base";

//import { Grid, Row, Col } from "react-native-easy-grid";

import QualtityInput from './Shared/QuantityInput';
import { file } from '@babel/types';
import { API } from '../const';

/**
 * This screen allow user to input data for a user do action (feed, give medicine) to a set of cage.
 * */
class ActionScreen extends React.Component {

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            cattles: null,
            feedTypes: null,
            feeds: null,

            cattleId: null,
            feedId: null,
            feedType: null,
            quantity: '',

            // cage: {qr, quantity, picturePaths}
            cages: [], 
        };

        // Common
        this.toggleFeedType = this.toggleFeedType.bind(this);
        this.onQuantityChange = this.onQuantityChange.bind(this);

        // Cage
        this.onScanCage = this.onScanCage.bind(this);
        this.onScanCageCallback = this.onScanCageCallback.bind(this);
        this.onRemoveCage = this.onRemoveCage.bind(this);

        // Complete
        this.onCompleteTask = this.onCompleteTask.bind(this);
        this.uploadCage = this.uploadCage.bind(this);
    }

    componentDidMount() {
        // Retrieve data
        fetch(`${settings.API.API_ROOT}${settings.API.DATA.ACTION_DATA}`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => res.json())
            .then(res => {

                var { data: { cattles, feedTypes, feeds } } = res;
                var feedType = feedTypes[0];

                this.setState({ cattles, feedTypes, feeds, feedType });

                console.log('ActionScreen.componentDidMount', { cattles, feedTypes, feeds });
            })
            .catch(error => {
                Alert.alert('Error', JSON.stringify(error));
            })
    }

    render() {

        var { cattles, feeds, feedTypes } = this.state; // feedTypes

        if (!cattles || !feeds) return null;

        feeds = feeds.filter(feed => feed.feedType === this.state.feedType);

        return (
            <Container style={styles.container}>
                <Header>
                    <Left />
                    <Body>
                        <Title>Feed Cattle</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Form>
                        {/* Cattle */}
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            //style={{ width: undefined }}
                            placeholder="Select Cattle"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.cattleId}
                            onValueChange={(val) => this.setState({ cattleId: val })}
                        >
                            {cattles.map(cattle => <Picker.Item key={cattle.id} label={cattle.name} value={cattle.id} />)}
                        </Picker>

                        {/* Feed */}
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            //style={{ width: undefined }}
                            placeholder="Select Cattle"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.feedId}
                            onValueChange={(val) => this.setState({ feedId: val })}
                        >
                            {feeds.map(feed => <Item key={feed.id} label={feed.name} value={feed.id} />)}
                        </Picker>

                        {/* FeedType */}
                        <Segment>
                            <Button first active={this.state.feedType === this.state.feedTypes[0]} onPress={this.toggleFeedType}><Text>{feedTypes[0]}</Text></Button>
                            <Button last active={this.state.feedType === this.state.feedTypes[1]} onPress={this.toggleFeedType}><Text>{feedTypes[1]}</Text></Button>
                        </Segment>

                        {/* Qualtity */}
                        <QualtityInput
                            style={styles.textInput}
                            placeholder={i18n.t('action.quantity_placeholder')}
                            maxLength={40}
                            onBlur={Keyboard.dismiss}
                            value={this.state.quantity}
                            onQuantityChange={this.onQuantityChange}
                        />

                        {/* Scan List */}
                        {this.state.cages.map((cage, index) => (
                            <Card key={cage.qr}>
                                <CardItem cardBody>
                                    <Image key={cage.picturePaths[0]} source={{ uri: cage.picturePaths[0] }} style={{ height: 200, width: null, flex: 1 }} />
                                </CardItem>
                                <Card style={{flexDirection: 'row'}}>
                                    <CardItem>
                                        <Text style={{width: '80%'}}>QR: {cage.qr}</Text>
                                        <Button style={{ ...styles.button, width: '15%'}} onPress={() => this.onRemoveCage(index)}><Text>Remove</Text></Button>
                                    </CardItem>
                                </Card>
                            </Card>
                        ))}

                        {
                            //<Item>
                            //    <Button onPress={this.onScanCage}><Text>Scan Cage</Text></Button>
                            //</Item>
                        }

                    </Form>
                </Content>

                <Footer>
                    <FooterTab>
                        <Button onPress={this.onScanCage}>
                            <Text>Scan Cage</Text>
                        </Button>

                        <Button onPress={this.onCompleteTask}>
                            <Text>Complete</Text>
                        </Button>

                    </FooterTab>
                </Footer>
            </Container>
        );
    }

    toggleFeedType() {
        try {
            var index = 1 - this.state.feedTypes.indexOf(this.state.feedType);
            this.setState({ feedType: this.state.feedTypes[index] });
        }
        catch (error) {
            console.log('toggleFeedType', error);
        }
    }

    onQuantityChange(val) {
        this.setState({ quantity: val.trim() });
    }

    // ================================================================================
    // Cage

    onScanCage() {
        this.props.navigation.navigate('ActionDetails', { quantity: this.state.quantity, onScanCageCallback: this.onScanCageCallback });
    }

    onScanCageCallback(cage) {
        var cages = [...this.state.cages, cage];
        this.setState({ cages });
    }

    onRemoveCage(index) {
        var cages = [...this.state.cages];
        cages.splice(index, 1);
        this.setState({ cages });
    }

    // ================================================================================
    // Complete Task

    /**
     * Start uploading process.
     * */
    onCompleteTask() {

        var { cattleId, feedId, feedType, quantity, } = { ...this.state }; // task
        var task = {
            CattleId: cattleId, FeedId: feedId, FeedType: feedType, 
            ActionTime: new Date(), Quantity: parseFloat(quantity)
        };

        var cages = [...this.state.cages];

        fetch(`${settings.API.API_ROOT}${settings.API.ACTION.UPLOAD_TASK}`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            data: task,
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => {
                return res.json();
            })
            .then((res) => {

                if (res.resultCode === API.RESULT_CODE.SUCCESS) {
                    return Promise.all(cages.map(cage => this.uploadCage(cage)));
                }
                throw res;
            }) 
            .catch(error => {
                Alert.alert('onCompleteTask Error', JSON.stringify(error));
            })
    }

    /**
     * Upload cages data (qr, quantity, pictures) for one cage.
     * @param {{qr, quantity, picturePaths}} cage
     */
    uploadCage(cage) {

        var formData = new FormData();
        formData.append('Id', cage.qr);
        formData.append('Quanity', cage.quantity);

        // Pictures
        var files = cage.picturePaths.map(path => RNFS.readFile(path, 'base64'));

        return Promise.all(files).then(files => {
            // Append files
            for (let i = 0; i < files.length; i++) {
                let name = `Picture-${i + 1}.jpg`;
                formData.append(name, files[i], name);
            }

            return fetch(
                `${settings.API.API_ROOT}${settings.API.ACTION.UPLOAD_CAGE}`, {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                    body: formData,
                })
                .then(res => console.warn('uploadCage fetch DONE.', res))
                .catch(error => {
                    Alert.alert('uploadCage Error', JSON.stringify(error));
                });
        });
    }

    /**
     * Upload cages data (qr, quantity, pictures) for one cage.
     * @param {{qr, quantity, picturePaths}} cage
     */
    uploadCage2(cage) {

        // TODO: not working for now.
        // REF: https://github.com/itinance/react-native-fs#file-upload-android-and-ios-only

        var files = cage.picturePaths.map((path, index) => {
            var dd = index + 1;
            dd = (dd <= 9 ? '0' : '') + dd.toString();
            var name = `Picture-${dd}.jpg`;

            return {
                name,
                filename: name,
                filepath: path,
                filetype: 'image/jpeg' // ?
            };
        });

        function uploadBegin(response) {
            var jobId = response.jobId;
            console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
        };

        function uploadProgress(response) {
            var percentage = Math.floor((response.totalBytesSent / response.totalBytesExpectedToSend) * 100);
            console.log('UPLOAD IS ' + percentage + '% DONE!');
        };

        var url = `${settings.API.API_ROOT}${settings.API.ACTION.UPLOAD_CAGE}`;

        return RNFS.uploadFiles({
            toUrl: url,
            files: files,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            fields: {
                Qr: cage.qr,
                Quantity: cage.quantity,
            },
            begin: uploadBegin,
            progress: uploadProgress
        })
            .promise
            .then((response) => {
                if (response.statusCode == 200) {
                    console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
                } else {
                    console.log('SERVER ERROR');
                }
            })
            .catch((err) => {
                if (err.description === "cancelled") {
                    // cancelled by user
                }
                console.log(err);
            });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    captionCol: {
        width: '40%'
    },
    inputCol: {
        width: '55%'
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
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputContainer: {
        paddingTop: 15
    },
    practiceButtonContainer: {
        marginTop: 'auto',
        width: '95%',
        marginBottom: 30
    },
    button: {
        width: 100,
    }
});

export default ActionScreen;
