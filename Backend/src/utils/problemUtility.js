const axios = require("axios");

const getLanguageById = (lang) => {
    const language = {
        'c++': 54,
        "java": 62,
        'javascript': 63,
        'python':71
    }
    return language[lang.toLowerCase()];
}

const submitBatch = async (submissions) => {
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'false'
        },
        headers: {
            'x-rapidapi-key': 'f53fae6751msh1cdf87700dd6d20p1e9e84jsn807c053e79e7',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;//return the tokenn:>>and then give this token to the judge0 
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const waiting = (timer) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timer);
    });
}

const submitToken = async (resultToken) => {
    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(","),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': 'f53fae6751msh1cdf87700dd6d20p1e9e84jsn807c053e79e7',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    while (true) {
        const result = await fetchData();
        if (result && result.submissions) {
            const IsResultObtained = result.submissions.every((r) => r.status_id > 2);
             if (IsResultObtained) {
                return result.submissions;
            }
        }
        await waiting(1000);
    }
}

module.exports = { getLanguageById, submitBatch, submitToken };