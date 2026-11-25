import dayjs from 'dayjs';
import utc from'dayjs/plugin/utc';
import timezone from'dayjs/plugin/timezone';
import customParseFormat from'dayjs/plugin/customParseFormat';

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

export function parseCSTDate(input: string): string {

    const date = dayjs(input.toUpperCase(), formats).tz("America/Chicago", true);
    console.log(date);
    return date.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
}

export function isValidDateTimeInput(input: string): boolean {
    return dayjs(input, formats).isValid();
}