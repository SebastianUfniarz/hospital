export const isValidPesel = (pesel: string) => {
    if (!/^\d{11}$/.test(pesel)) {
        return false;
    }

    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let sum = 0;

    for (let i = 0; i < 10; i++) {
        sum += parseInt(pesel[i]) * weights[i];
    }

    const controlDigit = (10 - (sum % 10)) % 10;
    return controlDigit === parseInt(pesel[10]);
};

export const extractBirthDateFromPesel = (pesel: string) => {
    if (!isValidPesel(pesel)) {
        return null;
    }

    let year = parseInt(pesel.substring(0, 2), 10);
    let month = parseInt(pesel.substring(2, 4), 10);
    const day = parseInt(pesel.substring(4, 6), 10);

    if (month > 80) {
        year += 1800;
        month -= 80;
    } else if (month > 60) {
        year += 2200;
        month -= 60;
    } else if (month > 40) {
        year += 2100;
        month -= 40;
    } else if (month > 20) {
        year += 2000;
        month -= 20;
    } else {
        year += 1900;
    }

    return new Date(year, month - 1, day);
};
