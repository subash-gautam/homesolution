import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Users, Briefcase, Calendar, Wallet } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import StatsCard from '../components/Dashboard/StatsCard';
import type { RootState, AppDispatch } from '../store';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, isLoading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);
  
  if (isLoading || !stats) {
    return <div>Loading...</div>;
  }

  const bookingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Bookings',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Service Providers"
          value={stats.totalProviders}
          icon={Briefcase}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Revenue"
          value={`Rs ${stats.totalRevenue}`}
          icon={Wallet}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Booking Trends</h2>
          <Line data={bookingData} />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Recent Bookings</h2>
          <div className="space-y-4">
            {stats.recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 transition duration-200 ease-in-out bg-white rounded-lg shadow-sm bg-gray-50 hover:bg-blue-50 hover:shadow-lg"
              >
                <div>
                  <p className="font-medium">Booking #{booking.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    booking.bookingStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : booking.bookingStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {booking.bookingStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;