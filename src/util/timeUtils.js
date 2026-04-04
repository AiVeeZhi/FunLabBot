const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

function parseCSTDate(input) {
    const formats = [
        "M/D/YYYY[@]h:mmA",
        "M/D/YYYY[@]hA",
        "M/D[@]h:mmA",
        "M/D[@]hA",
        "M/D/YYYY[@]H:mm", // Matches military if am/pm is missing
        "M/D[@]H"
    ];

    const date = dayjs(input.toUpperCase(), formats).tz("America/Chicago", true);
    console.log(date);
    return date.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
}

const formatRegex = /^\d{1,2}\/\d{1,2}(\/\d{4})?@\d{1,2}(:\d{2})?([ap]m)?$/i;

function isValidDateTimeInput(input) {
    return formatRegex.test(input);
}

module.exports = {
    isValidDateTimeInput,
    parseCSTDate
}