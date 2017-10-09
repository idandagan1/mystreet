import React, { PropTypes } from 'react';
import sha1 from 'sha1';


export default function FileLoader(props) {

    function onChange(e) {

        const { onFileUpload } = props;

        e.preventDefault();

        const image = e.target.files[0];
        const cloudName = 'dijclad0h';
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const timestamp = Date.now() / 1000;
        const uploadPreset = 'jyrh9tu2';
        const paramsStr = `timestamp=${timestamp}&upload_preset=${uploadPreset}ODHQYjPRRnOAtiDPDzBNVuV2I5E`;
        const signature = sha1(paramsStr);
        const params = {
            api_key: '651362167991894',
            timestamp,
            upload_preset: uploadPreset,
            signature,
        }

        onFileUpload(url, params, image);
    }

    return (
        <input
            type='file'
            id='fileInputId'
            className='filepicker'
            onChange={onChange}
        />
    );
}

FileLoader.propTypes = {
    onFileUpload: PropTypes.func.isRequired,
}
