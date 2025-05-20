import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, Clock, Wallet } from 'lucide-react';
import type { RootState } from '../store';
import {
  fetchBookings
} from '../store/slices/bookingSlice';
import { AppDispatch } from '../store';

const Bookings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, isLoading } = useSelector((state: RootState) => state.bookings);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const filteredBookings = selectedStatus === 'all'
    ? bookings
    : bookings.filter(booking => booking.bookingStatus === selectedStatus);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="p-6 space-y-4 transition duration-200 ease-in-out bg-white rounded-lg shadow-sm hover:bg-blue-50 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Booking #{booking.id} of {booking.service} from {booking.provider} by {booking.user}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{new Date(booking.scheduledDate).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Wallet className="w-4 h-4 mr-2" />
                    <span>NPR {booking.amount}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.bookingStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : booking.bookingStatus === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : booking.bookingStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : booking.bookingStatus === 'confirmed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-400'
                  }`}
                >
                  {booking.bookingStatus}
                </span>
                <div className="block">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;