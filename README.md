# New Islington Departures

## Running locally

### Setup

A valid TFGM API key is needed to access the data. Create one [here](https://developer.tfgm.com/).

Create an `.env` file in the root directory and add your key e.g.

`TFGM_KEY=123`

### `alexa-skill-local`

This package allows you to test local changes using the Alexa Developer Console.

`npm i`

`alexa-skill-local`

Follow the link to authenticate the session. Log in using `.co.uk` credentials.

## Deploy

No pipeline is setup. `.zip` the folder and upload via AWS Lambda console.