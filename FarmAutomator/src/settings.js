
export default settings = {
    API: {
        //API_ROOT: 'http://127.0.0.1:28205/',

        API_ROOT: 'http://192.168.1.107:84/',
        //API_ROOT: 'http://192.168.1.107:28205/',

        //API_ROOT: 'http://10.9.21.199:84/',
        //API_ROOT: 'http://10.9.21.199:28205/',
        AUTH: {
            LOGIN: 'auth/login',
        },
        DATA: {
            // Get feedType & feeds/medicine & cattles
            ACTION_DATA: 'data/actiondata',
        },
        ACTION: {
            UPLOAD_TASK: 'action/uploadtask',
            UPLOAD_CAGE: 'action/UploadCage',
        },
    }
};
