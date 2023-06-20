import { useState } from "react";
import { Navigate } from 'react-router-dom';
import { differenceInCalendarDays } from 'date-fns';
import axios from 'axios';

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState(getToday());
  const [checkOut, setCheckOut] = useState(getTomorrow());
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');

  function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  }

  function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const year = tomorrow.getFullYear();
    let month = tomorrow.getMonth() + 1;
    let day = tomorrow.getDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  }

  let numberOfNights = 0;

  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookThisPlace() {
    const response = await axios.post('/bookings', { checkIn, checkOut, numberOfGuests, name, phone, place: place._id, price: numberOfNights * place.price });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const isButtonDisabled = name.trim() === '' || phone.trim() === '';

  return (
<div className="relative">
  <div className="sticky top-12 p-4 border-[1px] border-gray-200 rounded-lg shadow-xl shadow-gray">
    <strong>${place.price}</strong> night

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="border-[1px] border-gray-200 p-2 rounded-t-lg">
        <label htmlFor="checkIn">Check-in:</label>
        <input
          id="checkIn"
          type="date"
          value={checkIn}
          onChange={ev => setCheckIn(ev.target.value)}
          className="w-full"
        />
      </div>
      <div className="border-[1px] border-gray-200 p-2 rounded-t-lg mt-4 md:mt-0">
        <label htmlFor="checkOut">Check-out:</label>
        <input
          id="checkOut"
          type="date"
          value={checkOut}
          onChange={ev => setCheckOut(ev.target.value)}
          className="w-full"
        />
      </div>
    </div>

    <div className="border-[1px] border-gray-200 p-2 rounded-b-lg border-t-0 mt-4 md:mt-0">
      <label htmlFor="guests">Guests:</label>
      <input
        id="guests"
        type="number"
        min="1"
        value={numberOfGuests}
        onChange={ev => setNumberOfGuests(ev.target.value)}
        className="w-full"
      />
    </div>

    {numberOfNights > 0 && (
      <div className="my-4">
        <label htmlFor="fullName">Your full name:</label>
        <input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={ev => setName(ev.target.value)}
          className="w-full"
        />
        <label htmlFor="phoneNumber">Your phone number:</label>
        <input
          id="phoneNumber"
          type="tel"
          placeholder="+3162345678"
          value={phone}
          onChange={ev => setPhone(ev.target.value)}
          className="w-full"
        />
      </div>
    )}

    <div>
      <button
        onClick={bookThisPlace}
        className="primary mt-4"
        disabled={isButtonDisabled}
      >
        Reserve
        {numberOfNights > 0 && (
          <span> ${numberOfNights * place.price}</span>
        )}
      </button>
    </div>
  </div>
</div>
  );
}