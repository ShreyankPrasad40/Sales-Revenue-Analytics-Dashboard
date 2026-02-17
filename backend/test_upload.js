const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testUpload() {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream('test_sales.csv'));

        console.log('Sending upload request...');
        const response = await axios.post('http://localhost:5000/api/sales/upload', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Status:', response.status);
        console.log('Body:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Error Status:', error.response.status);
            console.log('Error Body:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

testUpload();
