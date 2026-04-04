const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const formats = [
        "M/D/YYYYh:mmA",
        "M/D/YYYYhA",
        "M/Dh:mmA",
        "M/DhA",
        "M/D/YYYYH:mm", // Matches military if am/pm is missing
        "M/DH"
    ];

function parseCSTDate(input) {

    const date = dayjs(input.toUpperCase(), formats).tz("America/Chicago", true);
    console.log(date);
    return date.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
}

function isValidDateTimeInput(input) {
    return dayjs(input, formats).isValid();
}

module.exports = {
    isValidDateTimeInput,
    parseCSTDate
}