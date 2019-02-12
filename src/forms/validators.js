
import {multiply_reduce} from "../dkmath/dk-math";

/*
 *  Predicates that return true if the input is syntactically correct.
 */

export const validate = {
    email(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    phone(phone) {
        phone = phone.replace(/[-\s]/g, "");
        return (/^(\+47)?\d{8}$/).test(phone);
    },
    persnr(ssn) {
        if (ssn.length !== 11) return false;

        ssn = Array.from(ssn).map(v => parseInt(v, 10));
        const vekt1 = [3, 7, 6, 1, 8, 9, 4, 5, 2, 1, 0];
        const vekt2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 1];

        if (multiply_reduce(ssn, vekt1) % 11 !== 0) {
            return false;
        }
        return (multiply_reduce(ssn, vekt2) % 11 === 0);
    }
};
