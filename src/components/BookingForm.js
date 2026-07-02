"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./BookingForm.module.css";

const MONTHS_DEFAULT = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS_DEFAULT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const TIME_SLOTS = [
  { value: "08:00", label: "08:00 AM" },
  { value: "09:00", label: "09:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "14:00", label: "02:00 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "16:00", label: "04:00 PM" },
  { value: "17:00", label: "05:00 PM" },
  { value: "18:00", label: "06:00 PM" }
];

export default function BookingForm({ workshop, booking, onBookingSuccess, onResetBooking, dict = {}, lang = "en" }) {
  const [bookingError, setBookingError] = useState(null);
  
  // Selection States
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Dropdown UI States
  const [tierOpen, setTierOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  // Calendar Navigation States
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Refs for click outside
  const tierRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const monthsList = dict.months || MONTHS_DEFAULT;
  const weekdaysList = dict.weekdays || WEEKDAYS_DEFAULT;

  useEffect(() => {
    function handleClickOutside(event) {
      if (tierRef.current && !tierRef.current.contains(event.target)) {
        setTierOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setDateOpen(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target)) {
        setTimeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (lang === "hu") {
      const monthsHU = [
        "január", "február", "március", "április", "május", "június",
        "július", "augusztus", "szeptember", "október", "november", "december"
      ];
      const weekdaysHU = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
      const day = date.getDate();
      const monthName = monthsHU[date.getMonth()];
      const weekdayName = weekdaysHU[date.getDay()];
      return `${date.getFullYear()}. ${monthName} ${day}. (${weekdayName})`;
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedTier) {
      setBookingError(dict.errorTier || "Please select a service tier.");
      return;
    }
    if (!selectedDate) {
      setBookingError(dict.errorDate || "Please select an appointment date.");
      return;
    }
    if (!selectedTime) {
      setBookingError(dict.errorTime || "Please select an appointment time.");
      return;
    }
    setBookingError(null);

    const ticketNumber = `ERT-${Math.floor(10000 + Math.random() * 90000)}`;
    onBookingSuccess({
      status: "success",
      date: selectedDate,
      time: selectedTime,
      serviceType: selectedTier,
      ticketNumber
    });
  };

  const handleReset = () => {
    setSelectedTier("");
    setSelectedDate("");
    setSelectedTime("");
    setBookingError(null);
    onResetBooking();
  };

  // Calendar Helpers
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
      return; // Cannot go to past months
    }
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const selectDay = (day) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    setSelectedDate(`${currentYear}-${formattedMonth}-${formattedDay}`);
    setDateOpen(false);
  };

  const isDayDisabled = (day) => {
    const checkDate = new Date(currentYear, currentMonth, day);
    const comparisonDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return checkDate < comparisonDate;
  };

  const isDaySelected = (day) => {
    if (!selectedDate) return false;
    const [selYear, selMonth, selDay] = selectedDate.split("-").map(Number);
    return selYear === currentYear && selMonth === currentMonth + 1 && selDay === day;
  };

  // Generate Calendar Days Array
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayIndex = getFirstDayOfMonth(currentMonth, currentYear);
  const calendarCells = [];

  // Empty cells for weekday alignment
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push({ type: "empty", key: `empty-${i}` });
  }

  // Actual day cells
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push({
      type: "day",
      day,
      key: `day-${day}`,
      disabled: isDayDisabled(day),
      selected: isDaySelected(day)
    });
  }

  // Pad with empty cells at the end to always have exactly 42 cells (6 rows)
  const totalCells = 42;
  const currentLength = calendarCells.length;
  for (let i = currentLength; i < totalCells; i++) {
    calendarCells.push({ type: "empty", key: `empty-end-${i}` });
  }

  // Human friendly label for selected date
  const getDateTriggerLabel = () => {
    if (!selectedDate) return dict.selectDate || "Select Date";
    const dateObj = new Date(selectedDate);
    if (lang === "hu") {
      const monthsHU = [
        "jan.", "febr.", "márc.", "ápr.", "máj.", "jún.",
        "júl.", "aug.", "szept.", "okt.", "nov.", "dec."
      ];
      return `${dateObj.getFullYear()}. ${monthsHU[dateObj.getMonth()]} ${dateObj.getDate()}.`;
    }
    return dateObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const getTimeTriggerLabel = () => {
    if (!selectedTime) return dict.selectTime || "Select Time";
    return dict.timeSlots?.[selectedTime] || selectedTime;
  };

  const getTierDisplayName = (tier) => {
    return lang === "hu" ? `${tier} szerviz` : `${tier} Service`;
  };

  return (
    <div className={styles.bookingContainer}>
      {booking && booking.status === "success" ? (
        <div className={styles.bookingSuccess}>
          <div className={styles.successBadge}>
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className={styles.successHeader}>
            <h5>{dict.bookingConfirmed || "Appointment Confirmed"}</h5>
            <span className={styles.ticketNumber}>
              {booking.ticketNumber || "ERT-7732"}
            </span>
          </div>
          <div className={styles.ticketBody}>
            <div className={styles.ticketRow}>
              <span className={styles.ticketLabel}>{dict.workshop || "Workshop"}</span>
              <span className={styles.ticketValue}>{workshop.title}</span>
            </div>
            <div className={styles.ticketRow}>
              <span className={styles.ticketLabel}>{dict.tier || "Tier"}</span>
              <span className={styles.tierTag}>{getTierDisplayName(booking.serviceType)}</span>
            </div>
            <div className={styles.ticketRow}>
              <span className={styles.ticketLabel}>{dict.date || "Date"}</span>
              <span className={styles.ticketValue}>{formatDate(booking.date)}</span>
            </div>
            <div className={styles.ticketRow}>
              <span className={styles.ticketLabel}>{dict.time || "Time"}</span>
              <span className={styles.ticketValue}>
                {dict.timeSlots?.[booking.time] || booking.time}
              </span>
            </div>
          </div>
          <div className={styles.ticketFooter}>
            <button onClick={handleReset} className={styles.rescheduleBtn}>
              {dict.reschedule || "Reschedule Appointment"}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.bookingCard}>
          <div className={styles.bookingFormHeader}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className={styles.bookingFormHeaderTitle}>{dict.scheduleAppointment || "Schedule Appointment"}</span>
          </div>
          <form onSubmit={handleBookingSubmit} className={styles.bookingForm}>
            
            {/* 1. Custom Service Tier Dropdown */}
            <div style={{ width: "100%", position: "relative" }} ref={tierRef}>
              <button
                type="button"
                className={styles.bookingInput}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textAlign: "left",
                  background: "#FFFFFF"
                }}
                onClick={() => {
                  setTierOpen(!tierOpen);
                  setDateOpen(false);
                  setTimeOpen(false);
                }}
              >
                <span style={{ color: selectedTier ? "var(--brand-darker)" : "var(--muted-foreground)" }}>
                  {selectedTier ? getTierDisplayName(selectedTier) : (dict.selectServiceTier || "Select Service Tier")}
                </span>
                <svg
                  style={{
                    transform: tierOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    color: "var(--muted-foreground)"
                  }}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              
              {tierOpen && (
                <ul className={styles.customDropdownOptions}>
                  {workshop.tiers.map((tier) => (
                    <li
                      key={tier}
                      className={`${styles.customDropdownOption} ${selectedTier === tier ? styles.activeOption : ""}`}
                      onClick={() => {
                        setSelectedTier(tier);
                        setTierOpen(false);
                      }}
                    >
                      <span>{getTierDisplayName(tier)}</span>
                      {selectedTier === tier && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 2. Custom Date & Time Picker Row */}
            <div className={styles.formGrid}>
              
              {/* Custom Date Picker */}
              <div style={{ position: "relative" }} ref={dateRef}>
                <button
                  type="button"
                  className={styles.bookingInput}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textAlign: "left",
                    background: "#FFFFFF"
                  }}
                  onClick={() => {
                    setDateOpen(!dateOpen);
                    setTierOpen(false);
                    setTimeOpen(false);
                  }}
                >
                  <span style={{ color: selectedDate ? "var(--brand-darker)" : "var(--muted-foreground)" }}>
                    {getDateTriggerLabel()}
                  </span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted-foreground)" }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </button>

                {dateOpen && (
                  <div className={styles.calendarDropdown}>
                    <div className={styles.calendarHeader}>
                      <button
                        type="button"
                        className={styles.calendarNavBtn}
                        onClick={handlePrevMonth}
                        disabled={currentMonth === today.getMonth() && currentYear === today.getFullYear()}
                      >
                        &larr;
                      </button>
                      <span className={styles.calendarTitle}>
                        {lang === "hu" ? `${currentYear}. ${monthsList[currentMonth]}` : `${monthsList[currentMonth]} ${currentYear}`}
                      </span>
                      <button
                        type="button"
                        className={styles.calendarNavBtn}
                        onClick={handleNextMonth}
                      >
                        &rarr;
                      </button>
                    </div>
                    <div className={styles.calendarWeekdays}>
                      {weekdaysList.map(day => (
                        <div key={day} className={styles.calendarWeekday}>{day}</div>
                      ))}
                    </div>
                    <div className={styles.calendarDaysGrid}>
                      {calendarCells.map((cell) => {
                        if (cell.type === "empty") {
                          return <div key={cell.key} className={styles.calendarDayEmpty} />;
                        }
                        return (
                          <button
                            key={cell.key}
                            type="button"
                            disabled={cell.disabled}
                            onClick={() => selectDay(cell.day)}
                            className={`${styles.calendarDay} ${cell.selected ? styles.calendarDaySelected : ""} ${cell.disabled ? styles.calendarDayDisabled : ""}`}
                          >
                            {cell.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Time Picker */}
              <div style={{ position: "relative" }} ref={timeRef}>
                <button
                  type="button"
                  className={styles.bookingInput}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textAlign: "left",
                    background: "#FFFFFF"
                  }}
                  onClick={() => {
                    setTimeOpen(!timeOpen);
                    setTierOpen(false);
                    setDateOpen(false);
                  }}
                >
                  <span style={{ color: selectedTime ? "var(--brand-darker)" : "var(--muted-foreground)" }}>
                    {getTimeTriggerLabel()}
                  </span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted-foreground)" }}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </button>

                {timeOpen && (
                  <ul className={`${styles.customDropdownOptions} ${styles.timeDropdownOptions}`} style={{ maxHeight: "200px" }}>
                    {TIME_SLOTS.map((slot) => (
                      <li
                        key={slot.value}
                        className={`${styles.customDropdownOption} ${selectedTime === slot.value ? styles.activeOption : ""}`}
                        onClick={() => {
                          setSelectedTime(slot.value);
                          setTimeOpen(false);
                        }}
                      >
                        <span>{dict.timeSlots?.[slot.value] || slot.label}</span>
                        {selectedTime === slot.value && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>

            {bookingError && <p className={styles.bookingError}>{bookingError}</p>}
            
            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "4px" }}>
              {dict.confirmAppointment || "Confirm Appointment"}
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
