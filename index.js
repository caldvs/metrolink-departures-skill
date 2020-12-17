'use strict';
require('dotenv').config()

const Alexa = require('ask-sdk-core');
const axios = require('axios');
const dummyData = require('./dummy.json');

const extract = trams => {
    return trams.filter((tram) => tram.Dest0 !== "" && tram['Wait1'] !== "").map((tram) => {
        return {
            'Destination': tram.Dest0,
            'Waits': [tram['Wait0'], tram['Wait1'], tram['Wait2']].filter(function (el) {
                return el != "";
            })
        }
    });
}

function formatArray(arr) {
    var outStr = "";
    if (arr.length === 1) {
        outStr = arr[0];
    } else if (arr.length === 2) {
        //joins all with "and" but no commas
        //example: "bob and sam"
        outStr = arr.join(' and ');
    } else if (arr.length > 2) {
        //joins all with commas, but last one gets ", and" (oxford comma!)
        //example: "bob, joe, and sam"
        outStr = arr.slice(0, -1).join(', ') + ', and ' + arr.slice(-1);
    }
    return outStr;
}

const get = async () => {
    let raw;

    if (process.env.NODE_ENV === "development") {
        raw = dummyData;
    } else {
        const rawData = await axios.get('https://api.tfgm.com/odata/Metrolinks', {
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.TFGM_KEY,
            }
        });
        raw = rawData.data.value.filter((object) => object.StationLocation === 'New Islington');
    }

    const extracted = extract(raw);
    const text = extracted.map((service) => `Trams to ${service.Destination} leaving in ${formatArray(service.Waits)} minutes.`).join(" ");

    return text;
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const trams = await get();
        return handlerInput.responseBuilder
            .speak(trams)
            .withShouldEndSession(true)
            .getResponse();
    }
}

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(LaunchRequestHandler)
    .lambda();