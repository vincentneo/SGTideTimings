# SGTideTimings
This project generates tide timings JSONs by web scrapping from https://www.nea.gov.sg/weather/tide-timings tables.

## Usage
Current month's tide timings can be accessed by:
```
https://vincentneo.github.io/SGTideTimings/latest.json
```

## Why make this?
NEA / data.gov.sg currently does not have an API for tide timings, unlike many other data provided on the NEA website.

This uses GitHub Actions to auto scrape, generate usable JSON files and deploy to the `gh-pages` branch of this repo, automatically.

## License

### Regarding code
Codes in the `main` branch repository, which contains code that does the web scraping, etc, is licensed under MIT License.

### Regarding generated contents
Generated contents contains information from Tide Timings table, and will be accessed every 1st and 2nd day of each month from [NEA](https://www.nea.gov.sg/weather/tide-timings) which is made available under the terms of the [Singapore Open Data Licence version 1.0](https://www.nea.gov.sg/open-data-licence)
