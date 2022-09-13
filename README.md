# SGTideTimings
This project generates tide timings JSONs by web scraping from https://www.nea.gov.sg/weather/tide-timings tables.


## Usage of codes

Codes are tested on Node.js v16 only, as of point of writing. Other versions, use at own risk!
- Run `npm run start` to generate current and next month's JSONs on your own machine. 
- Run `npm run actions` to generate with an extra `latest.json` to reflect current month tide timings, and save all months at `archives/` directory. Designed for current GitHub Actions script use.

Always remember to install the dependencies! 🙂

## Usage of APIs
Current month's tide timings can be accessed by:
```
https://vincentneo.github.io/SGTideTimings/latest.json
```
Previous/Future month's tide timings, by month and year, can be accessed by:
```
https://vincentneo.github.io/SGTideTimings/archives/2022-09.json
https://vincentneo.github.io/SGTideTimings/archives/{yyyy}-{MM}.json
```
You must adhere to the terms of the [Singapore Open Data Licence version 1.0](https://www.nea.gov.sg/open-data-licence) when using the tide timings data.

## Format
JSONs are formatted as array with objects of such format:
```JSON
{
  "date": "2022-09-01T01:39:00.000+08:00",
  "height": 2.8,
  "classification": "H"
}
```
#### date
Formatted according to ISO 8601 standard, with Singapore's timezone offset, as it represents local time in Singapore. 

Seconds and milliseconds can be disregarded.

#### height
In metres, and according to [NEA](https://www.nea.gov.sg/weather/tide-timings):

> Tidal height is in metres above the ‘Chart Datum’, which is the lowest water level recorded over a fixed period (usually 18 years) at a particular point.

#### classification
Whether if tide is classified as high (H) or low (L). 

## How it works

This uses GitHub Actions to automatically scrape, generate usable JSON files and deploy to the `gh-pages` branch of this repo, automatically.

## Why make this?
NEA / data.gov.sg currently does not have an API for tide timings prediction, unlike many other data provided on the NEA website.

## License

### Regarding code
Codes in the `main` branch of the repository, which contains code that does the web scraping, etc, is licensed under MIT License.

### Regarding generated contents
Generated contents (including `gh-pages` branch contents) contains information from Tide Timings table, and will be accessed every 1st and 2nd day of each month from [National Environment Agency (NEA) / Maritime and Port Authority of Singapore (MPA)](https://www.nea.gov.sg/weather/tide-timings) which is made available under the terms of the [Singapore Open Data Licence version 1.0](https://www.nea.gov.sg/open-data-licence).
