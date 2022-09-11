import axios from "axios";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { JSDOM } from "jsdom";
import { DateTime } from "luxon";

const args = process.argv.slice(2);
const forGitHubActions = args[0] === "-a";

const singaporeTimeZone = "Asia/Singapore";

try {

    // Retrieval
    console.log("Retrieve HTML from nea.gov.sg...");
    const response = await axios.get("https://www.nea.gov.sg/weather/tide-timings");
    console.log("HTML Retrieval from nea.gov.sg complete!\n");

    // Parsing
    console.log("Start parsing of HTML as DOM\n");
    /**
     * @type {JSDOM}
     */
    const dom = new JSDOM(response.data);

    console.log("Preparing directories\n");

    const rootResultsFolderName = "results/";
    const archivesFolderName = `${rootResultsFolderName}archives/`;

    if (!existsSync(rootResultsFolderName)) {
        mkdirSync(rootResultsFolderName);
    }

    if (forGitHubActions && !existsSync(archivesFolderName)) {
        mkdirSync(archivesFolderName, {recursive: true});
    }

    let yearsByMonth = {};

    const tableButtons = dom.window.document.querySelectorAll("button.tab__nav-item");
    for (const button of tableButtons) {
        const month = button.getAttribute("data-box"); 
        const contents = button.textContent;
        const datetime = DateTime.fromFormat(contents, "LLL yyyy");
        yearsByMonth[month] = datetime.year;
    }

    const tableContainers = dom.window.document.getElementsByClassName("forecast-widget__content");
    for (const container of tableContainers) {
        const monthText = container.getAttribute("data-box");
        const year = yearsByMonth[monthText];
        const month = DateTime.fromFormat(monthText, "MMM").month;

        console.log(`Start parsing for ${month}/${year}`);

        const table = container.querySelector("table");
        const rows = table.querySelectorAll("tr");

        let data = [];

        let currentDay = 1;
        // skip first 2 rows
        for (let rowIdx = 2; rowIdx < rows.length; rowIdx++) {
            const row = rows[rowIdx];
            const cells = row.querySelectorAll("td");

            let isParentRow = false;
            if (cells[0].getAttribute("rowspan") !== null) {
                currentDay = Number.parseInt(cells[0].textContent);
                isParentRow = true;
            }

            const time = DateTime.fromFormat(cells[isParentRow ? 1 : 0].textContent, "HHmm");
            const height = Number.parseFloat(cells[isParentRow ? 2 : 1].textContent);
            const classification = cells[isParentRow ? 3 : 2].textContent;

            const date = DateTime.fromObject(
                { 
                    year: year, 
                    month: month, 
                    day: currentDay, 
                    hour: time.hour, 
                    minute: time.minute
                }, { zone: singaporeTimeZone });

            data.push(
                {
                    date: date.toISO(),
                    height: height,
                    classification: classification
                }
            );
        }

        console.log(`Completed parsing for ${month}/${year}`);

        const filenameDt = DateTime.fromObject({year: year, month: month}).toFormat("yyyy-LL");
        const filename = `${filenameDt}.json`;

        let path;

        if (forGitHubActions) {
            path = `${archivesFolderName}${filename}`;

            if (DateTime.now().setZone(singaporeTimeZone).month === month) {
                const latestPath = `${rootResultsFolderName}latest.json`;
                writeFileAndIgnore(latestPath, JSON.stringify(data));
            }
        } 
        else {
            path = `${rootResultsFolderName}${filename}`;
        }

        writeFileAndIgnore(path, JSON.stringify(data));
    }

}
catch (error) {
    console.error(`Failed with error: ${error}`);
}


function writeFileAndIgnore(path, serializedData) {
    console.log(`Start writing ${path}`);
    writeFile(path, serializedData)
    .then(() => {
        console.log(`Completed writing ${path}`);
    })
    .catch((error) => {
        console.error(`Failed writing with error: ${error}`);
    });
}