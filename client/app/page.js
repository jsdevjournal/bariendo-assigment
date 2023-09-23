'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { getAppointment, clearToken } from '../apis';
import { format, isToday, isTomorrow, formatDistanceToNow } from 'date-fns';
import useSession from '../lib/useSession';
import Layout from '../components/Layout';
import Button from '../components/Button';

function formatAppointmentDate(dateString) {
  const date = new Date(dateString);

  if (isToday(date)) {
    return 'Today';
  } else if (isTomorrow(date)) {
    return 'Tomorrow';
  } else {
    const formattedDate = format(date, 'EEEE, MMMM d, yyyy');
    const distance = formatDistanceToNow(date);

    if (distance === 'less than a minute') {
      return 'Just now';
    } else if (distance === '1 minute') {
      return '1 minute ago';
    } else {
      return `${formattedDate}`;
    }
  }
}

export default function Page() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);

  useSession({
    redirectTo: '/login',
  });

  useEffect(() => {
    get();
  }, []);

  const get = async () => {
    try {
      const res = await getAppointment();
      setAppointments(res);
    } catch (e) {
      console.error(e);
    }
  }

  const now = new Date();
  const futureAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(`${appointment.date} ${appointment.time}`);
    return appointmentDate >= now;
  });

  // Sort appointments by date and time (earliest first)
  const sortedAppointments = [...futureAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA - dateB;
  });

  // Group sorted appointments by date
  const groupedAppointments = {};
  sortedAppointments.forEach((appointment) => {
    const date = appointment.date;
    if (!groupedAppointments[date]) {
      groupedAppointments[date] = [];
    }
    groupedAppointments[date].push(appointment);
  });

  const handleLogout = () => {
    clearToken();
    router.replace('/login');
  };

  const handleNew = () => {
    router.push('/appointment');
  }

  return (
    <Layout>
      <div className="flex flex-col justify-center">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Appointments</h2>
            {Object.keys(groupedAppointments).map((date) => (
              <div key={date} className="mb-8">
                <h3 className="text-lg font-semibold mb-4">{formatAppointmentDate(date)}</h3>
                <ul className="space-y-2">
                  {groupedAppointments[date].map((appointment, index) => (
                    <div
                      key={index}
                      href={`/appointment/${appointment.id}`}
                      className="bg-white rounded-md shadow-md p-4 flex items-center justify-between"
                    >
                      <div className="text-lg font-medium">{appointment.doctor.name}</div>
                      <div className="text-gray-600">{appointment.time}</div>
                    </div>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Button
          onClick={handleNew}
        >
          New Appointment
        </Button>
        <Button
          onClick={handleLogout}
          className="bg-red-500"
        >
          Logout
        </Button>
      </div>
    </Layout>
  );
}