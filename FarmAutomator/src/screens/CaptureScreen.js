import React from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';

//import RNCamera from 'react-native-camera';
//import { RNCamera } from 'react-native-camera';
import { RNCamera } from 'react-native-camera';

//import { Icon } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { dirPictures, dirHome } from './dirStorage';
const moment = require('moment');

let { height, width } = Dimensions.get('window');
let orientation = height > width ? 'Portrait' : 'Landscape';

//move the attachment to app folder
const moveAttachment = async (filePath, newFilepath) => {
    return new Promise((resolve, reject) => {

        console.log('moveAttachment', { dirPictures });

        RNFS.mkdir(dirHome)
            .then(() => RNFS.mkdir(dirPictures))
            .then(() => {
                RNFS.moveFile(filePath, newFilepath)
                    .then(() => {
                        console.log('FILE MOVED', filePath, newFilepath);
                        resolve(true);
                    })
                    .catch(error => {
                        console.log('moveFile error', error);
                        reject(error);
                    });
            })
            .catch(err => {
                console.log('mkdir error', err);
                reject(err);
            });
    });
};

// https://medium.com/@masochist.aman/capturing-images-with-react-native-203e24f93eb9
// Reference: https://gist.github.com/amanthegreatone/5ec607b50074e4fa0d929dbf3245e9f6

class CaptureScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            orientation
        };

        this.takePicture = this.takePicture.bind(this);
        this.saveImage = this.saveImage.bind(this);

        this.cameraRef = React.createRef();
    }

    componentWillMount() {
        Dimensions.addEventListener('change', this.handleOrientationChange);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.handleOrientationChange);
    }

    handleOrientationChange = dimensions => {
        ({ height, width } = dimensions.window);
        orientation = height > width ? 'Portrait' : 'Landscape';
        this.setState({ orientation });
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" translucent />

                <RNCamera
                    //captureTarget={RNCamera.constants.CaptureTarget.disk}
                    //aspect={RNCamera.constants.Aspect.fill}
                    ref={this.cameraRef}
                    style={styles.container}
                    orientation="auto"
                >
                    <View
                        style={this.state.orientation === 'Portrait' ?
                            styles.buttonContainerPortrait :
                            styles.buttonContainerLandscape
                        }
                    >
                        <TouchableOpacity
                            onPress={() => this.takePicture()}
                            style={this.state.orientation === 'Portrait' ?
                                styles.buttonPortrait :
                                styles.buttonLandscape
                            }
                        >
                            <Icon name="camera" style={{ fontSize: 40, color: 'white' }} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={this.state.orientation === 'Portrait' ?
                                styles.buttonPortrait :
                                styles.buttonLandscape
                            }
                        >
                            <Icon name="window-close" style={{ fontSize: 40, color: 'white' }} />
                        </TouchableOpacity>
                    </View>
                </RNCamera>
            </View>
        );
    }

    // ************************** Capture and Save Image *************************

    async saveImage(filePath) {
        try {

            // set new image name and filepath
            const newFileName = `${moment().format('DDMMYY_HHmmSSS')}.jpg`;
            const newFilePath = `${dirPictures}/${newFileName}`;
            // move and save image to new filepath
            const imageMoved = await moveAttachment(filePath, newFilePath);
            console.log('image moved', imageMoved);

            return { name: newFileName, path: newFilePath };

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    takePicture() {
        if (!this.cameraRef.current) return;

        //const options = { quality: 0.5, base64: true };

        this.cameraRef.current.takePictureAsync() // options
            .then(async data => {
                console.log('takePicture', data);
                // TODO: Skip saveImage for now
                //var newFile = await this.saveImage(data.uri);
                //this.props.navigation.state.params.onTakePictureCallback(newFile.path);

                this.props.navigation.state.params.onTakePictureCallback(data.uri);
                this.props.navigation.goBack();
            });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonContainerPortrait: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)'
    },
    buttonContainerLandscape: {
        position: 'absolute',
        bottom: 0,
        top: 0,
        right: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    buttonPortrait: {
        backgroundColor: 'transparent',
        padding: 5,
        marginHorizontal: 20
    },
    buttonLandscape: {
        backgroundColor: 'transparent',
        padding: 5,
        marginVertical: 20
    }
});

export default CaptureScreen;
