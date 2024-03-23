# To run locally

1. Install Node 20.11.1
2. Install [Azure Function Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-typescript)
3. Install [Azurite](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=visual-studio%2Cblob-storage#install-azurite)
4. Create account and get API key from [Open Weather](https://openweathermap.org/api) 
5. Set the following values in local.settings.json:
    - `OPENWEATHER_API_KEY` : API Key from Open Weather API account
    - `LAT` : Latitude of where you want weather from
    - `LON` : Longitude of where you want weather from
    - `KAFKA_USER` : User for your Kafka producer
    - `KAFKA_PASSWORD` : Password of your kafka producer
    - `KAFKA_BROKER` : URL of your kafka broker
6. Navigate to ./latest-producer
7. Run `npm install`
8. Run `npm run start`

