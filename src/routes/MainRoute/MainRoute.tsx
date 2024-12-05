import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { pl } from "date-fns/locale";

import styles from "./MainRoute.module.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const messages = {
    next: "Następny",
    previous: "Poprzedni",
    today: "Dziś",
    month: "Miesiąc",
    week: "Tydzień",
    day: "Dzień",
    allDay: "Cały dzień",
    noEventsInRange: "Brak wydarzeń w tym zakresie",
};

; const locales = { "pl": pl };

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const MainRoute: React.FC = () => {
    const [events, setEvents] = useState([
        {
            start: new Date(2024, 10, 21, 10, 0), // 21 listopada 2024, godzina 10:00
            end: new Date(2024, 10, 21, 11, 0),
            title: "Spotkanie z zespołem",
        },
        {
            start: new Date(2024, 10, 22, 14, 0), // 22 listopada 2024, godzina 14:00
            end: new Date(2024, 10, 22, 15, 0),
            title: "Prezentacja projektu",
        },
    ]);

    return (
        <div className={styles.root}>
            <h3>Mój harmonogram</h3>
            <Calendar
                localizer={localizer}
                culture="pl"
                messages={messages}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 512 }}
            />
        </div>
    );
};

export default MainRoute;
