import { useEffect, useRef, useState } from "react";

import "./style.css";

export default function App() {
    return <AgeCalculator />;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

const monthsDays = {
    1: 31,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
};

function AgeCalculator() {
    const [days, setDays] = useState("");
    const [months, setMonths] = useState("");
    const [years, setYears] = useState("");

    const [resultDays, setResultDays] = useState("--");
    const [resultmonths, setResultMonths] = useState("--");
    const [resultyears, setResultYears] = useState("--");

    const [invalidDays, setInvalidDays] = useState("");
    const [invalidMonths, setInvalidMonths] = useState("");
    const [invalidYears, setInvalidYears] = useState("");

    const dayField = useRef(null);

    useEffect(() => {
        window.addEventListener("load", () => dayField.current.focus());
    }, []);

    function handleSubmit(e) {
        let flagInvalid = false;
        e.preventDefault();

        if (!days) {
            setInvalidDays("Required field");
            flagInvalid = true;
        } else if (days > monthsDays[String(months)] || days > 31) {
            setInvalidDays("Must be a valid day");
            flagInvalid = true;
        } else {
            setInvalidDays("");
        }

        if (!months) {
            setInvalidMonths("Required field");
            flagInvalid = true;
        } else if (months > 12) {
            setInvalidMonths("Must be a valid month");
            flagInvalid = true;
        } else if (months === 2) {
            if ((isLeapYear(years) && days > 29) || (!isLeapYear(years) && days > 28)) {
                setInvalidDays("Must be a valid day");
                flagInvalid = true;
            }
        } else {
            setInvalidMonths("");
        }

        const currentDate = new Date();

        if (!years) {
            setInvalidYears("Required field");
            flagInvalid = true;
        } else if (years > currentDate.getFullYear()) {
            setInvalidYears("Must be in past");
            flagInvalid = true;
        } else {
            setInvalidYears("");
        }

        const birthDate = new Date(`${years}-${months}-${days}`);

        if (birthDate > currentDate) {
            setInvalidDays("Must be in past");
            setInvalidMonths("Must be in past");
            setInvalidYears("Must be in past");
            flagInvalid = true;
        }

        if (flagInvalid === true) return;

        let resultYears = currentDate.getFullYear() - birthDate.getFullYear();
        let resultMonths = currentDate.getMonth() - birthDate.getMonth();
        let resultDays = currentDate.getDate() - birthDate.getDate();

        if (resultDays < 0) {
            resultMonths--;
            const lastMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
            resultDays += lastMonthDays;
        }

        if (resultMonths < 0) {
            resultYears--;
            resultMonths += 12;
        }

        setInvalidDays(false);
        setInvalidMonths(false);
        setInvalidYears(false);

        setResultYears(resultYears);
        setResultMonths(resultMonths);
        setResultDays(resultDays);
    }

    function handleDays(e) {
        if (e.nativeEvent.data === ".") return;
        let value = e.target.value;
        setDays(() => (isNaN(value) ? days : Number(value)));
    }

    function handleMonths(e) {
        if (e.nativeEvent.data === ".") return;

        let value = e.target.value;
        setMonths(() => (isNaN(value) ? months : Number(value)));
    }

    function handleYears(e) {
        if (e.nativeEvent.data === ".") return;

        let value = e.target.value;
        setYears(() => (isNaN(value) ? years : Number(value)));
    }

    return (
        <>
            <form className="app-container" onSubmit={handleSubmit}>
                <div className="inputs-holder">
                    <InputContainer field="Day" validityState={invalidDays}>
                        <input ref={dayField} type="text" value={days} onChange={handleDays} placeholder="DD" />
                    </InputContainer>

                    <InputContainer field="Month" validityState={invalidMonths}>
                        <input type="text" value={months} onChange={handleMonths} placeholder="MM" />
                    </InputContainer>

                    <InputContainer field="Year" validityState={invalidYears}>
                        <input type="text" value={years} onChange={handleYears} placeholder="YYYY" />
                    </InputContainer>
                </div>

                <Button />

                <div className="result">
                    <Result field="years" result={resultyears} />
                    <Result field="months" result={resultmonths} />
                    <Result field="days" result={resultDays} />
                </div>
            </form>
            <Attribution />
        </>
    );
}

function Result({ field, result }) {
    return (
        <p>
            <span>{result === "" ? "--" : result}</span> {field}
        </p>
    );
}

function InputContainer({ field, validityState, children }) {
    return (
        <div className={validityState ? "invalid" : ""}>
            <label>{field}</label>
            {children}
            {validityState ? <small>{validityState}</small> : ""}
        </div>
    );
}

function Button() {
    return (
        <div className="btn-container">
            <button>
                <img alt="icon-submit" src="assets/icon-arrow.svg" />
            </button>
        </div>
    );
}

function Attribution() {
    return (
        <div className="attribution">
            Challenge by <a href="https://www.frontendmentor.io?ref=challenge">Frontend Mentor</a>. Coded by{" "}
            <a href="https://github.com/OthmaneNissoukin">Othmane Nissoukin</a>.
        </div>
    );
}
