import React, { useState } from 'react'

const Seat = ({ i, step, columnStart, maxColumns, rowStart, maxRows, seatsTaken, buyHandler, maxTickets }) => {
  const [selectedSeats, setSelectedSeats] = useState([])

  const handleClick = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat))
    } else if (selectedSeats.length < maxTickets) {
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  return (
    <div
      onClick={() => handleClick(i + step)}
      className={`occasion__seats ${seatsTaken.find(seat => Number(seat) === (i + step)) ? "occasion__seats--taken" : ""} ${selectedSeats.includes(i + step) ? "occasion__seats--selected" : ""}`}
      style={{
        gridColumn: `${((i % maxColumns) + 1) + columnStart}`,
        gridRow: `${Math.ceil(((i + 1) / maxRows)) + rowStart}`
      }}
    >
      {i + step}
    </div>
  );
}

export default Seat;
