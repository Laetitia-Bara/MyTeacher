import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEventToStore } from "../reducers/planning";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "../styles/BigCalendar.module.css";

const now = new Date();

const localizer = momentLocalizer(moment);

export default function BigCalendar(props) {
  const [eventsData, setEventsData] = useState(props.events);

  const handleSelectSlot = ({ start, end }) => {
    props.onClick();
    // const title = window.prompt("New Event name");
    // if (!title) {
    //   return;
    // } else {
    //   const desc = window.prompt("New Event desc");
    //   setEventsData([
    //     ...eventsData,
    //     {
    //       start,
    //       end,
    //       title,
    //       desc,
    //     },
    //   ]);
    // }
  };

  const handleSelectEvent = (event) => {
    // modifier ou supprimer
    const ok = window.confirm(`Supprimer "${event.title}" ?`);
    if (!ok) return;
    setEventsData((prev) => prev.filter((e) => e.id !== event.id));
  };

  return (
    <div className={styles.planningCalendar}>
      <Calendar
        localizer={localizer}
        views={["day", "week", "month"]}
        selectable
        defaultDate={new Date()}
        defaultView="month"
        events={eventsData}
        startAccessor="start"
        endAccessor="end"
        culture="fr"
        messages={{
          allDay: "Tous les jours",
          previous: "Précédent",
          next: "Suivant",
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          agenda: "Agenda",
          date: "Date",
          time: "Heure",
          event: "Evenement",
        }}
        style={{ height: "100%", width: "100%" }}
        tooltipAccessor={(event) => event.desc}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
}
