'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { format, addDays, isSameDay } from 'date-fns';
import { getDoctorAvailability, getDoctors, postAppointment } from '../../apis';
import useSession from '../../lib/useSession';
import Button from '../../components/Button';

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
function getFirstDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default function Page() {
  const router = useRouter()
  const [doctors, setDoctors] = useState([]);
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  useSession({
    redirectTo: '/login',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchDoctorAvailability(selectedDoctor?.id);
    setSelectedMonth(new Date());
  }, [selectedDoctor]);

  useEffect(() => {
    setSelectedDate(null);
    setSelectedTime([]);
  }, [selectedMonth, selectedDoctor]);

  useEffect(() => {
    setSelectedTime([]);
  }, [selectedDate]);

  // Calculate available dates based on filtered appointments
  useEffect(() => {
    if (selectedMonth) {
      const dates = [];
      const firstDay = getFirstDay(selectedMonth);
      const enabledDates = doctorSlots.map(val => new Date(val.date));
      for (let i = 0; i < daysInMonth(selectedMonth); i++) {
        const currentDate = addDays(firstDay, i);
        const enable = enabledDates.some(val => isSameDay(val, currentDate));
        dates.push({ date: currentDate, disabled: !enable });
      }
      setAvailableDates(dates);
    }
  }, [selectedMonth, doctorSlots]);

  // Filter appointments based on selected doctor and month
  const filtedDoctorSlots = doctorSlots.filter((appointment) => {
    return isSameDay(new Date(appointment.date), selectedDate);
  });

  const fetchDoctors = async () => {
    try {
      const res = await getDoctors();
      setDoctors(res);
    } catch (e) {
      console.error(e);
    }
  }

  const fetchDoctorAvailability = async (doctorId) => {
    if (doctorId) {
      const res = await getDoctorAvailability(doctorId);
      setDoctorSlots(res);
    }
  }

  const onToggleTime = (time) => {
    if (selectedTime.includes(time.id)) {
      setSelectedTime(selectedTime.filter(val => val !== time.id));
    } else {
      setSelectedTime([...selectedTime, time.id]);
    }
  }

  const handleBookAppointment = async () => {
    try {
      await postAppointment([...new Set(selectedTime)]);
      alert('Success');
      router.replace('/');
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Book an Appointment
        </h2>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <label className="text-lg">Select Doctor:</label>
          <select
            className="border p-2 rounded-md"
            onChange={(e) =>
              setSelectedDoctor(
                doctors.find((doc) => doc.id === e.target.value)
              )
            }
            value={selectedDoctor?.id}
          >
            <option disabled selected>
              Select Doctor
            </option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>
        {
          selectedDoctor ? (
            <>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <label className="text-lg">Select Month/Year:</label>
                <input
                  type="month"
                  className="border p-2 rounded-md"
                  value={selectedMonth ? format(selectedMonth, 'yyyy-MM') : null}
                  onChange={(e) => setSelectedMonth(new Date(e.target.value))}
                />
              </div>
              {
                selectedMonth ? (
                  <>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <label className="text-lg">Select Date:</label>
                      <div className="overflow-x-auto border p-2 rounded-md">
                        {availableDates.map((date) => (
                          <button
                            key={date.date}
                            onClick={() => setSelectedDate(date.date)}
                            className={`disabled:text-slate-500 p-2 m-1 rounded-md ${isSameDay(selectedDate, date.date) ? 'bg-blue-500 text-white' : ''
                              }`}
                            disabled={date.disabled}
                          >
                            {format(date.date, 'E dd')}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <label className="text-lg">Select Time Slot:</label>
                      <div className="flex space-x-2">
                        {filtedDoctorSlots.map((time) => (
                          <button
                            key={time.id}
                            onClick={() => onToggleTime(time)}
                            className={`disabled:text-slate-500 ${time.reserved ? ' cursor-not-allowed' : ''
                              } p-2 rounded-md ${selectedTime.includes(time.id) ? 'bg-blue-500 text-white' : ''
                              }`}
                            disabled={time.reserved}
                          >
                            {time.time}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center mt-6">
                      <Button
                        className="disabled:bg-slate-500"
                        onClick={handleBookAppointment}
                        disabled={!selectedTime.length}
                      >
                        Book
                      </Button>
                    </div>
                  </>
                ) : false
              }
            </>
          ) : false
        }
      </div>
    </div>
  );
}