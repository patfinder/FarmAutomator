import { Platform } from 'react-native';
const RNFS = require('react-native-fs');

export const dirHome = Platform.select({
    ios: `${RNFS.DocumentDirectoryPath}/FarmAutomator`,
    android: `${RNFS.ExternalStorageDirectoryPath}/FarmAutomator`
});

export const dirPictures = `${dirHome}/Pictures`;
export const dirAudio = `${dirHome}/Audio`;
