import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  QrCode,
  Settings,
  Plus,
  Share2,
  Eye,
  TrendingUp,
  Clock,
} from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';

const Dashboard = () => {
  const stats = [
    { label: 'Total Scans', value: '2,847', icon: Eye, trend: '+12.5%' },
    { label: 'Active Menus', value: '3', icon: QrCode, trend: '+1 this month' },
    { label: 'Total Shares', value: '156', icon: Share2, trend: '+24.3%' },
    { label: 'Peak Hours', value: '6-8 PM', icon: Clock, trend: 'Consistent' },
  ];

  const recentActivity = [
    { action: 'Menu Updated', item: 'Dinner Menu', time: '2 hours ago' },
    { action: 'New QR Generated', item: 'Lunch Specials', time: '5 hours ago' },
    { action: 'Price Updated', item: 'Weekend Brunch', time: '1 day ago' },
    { action: 'Item Added', item: 'Seasonal Specials', time: '2 days ago' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="bg-indigo-50 rounded-full p-3">
                  <stat.icon className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-green-600">{stat.trend}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Analytics Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Analytics Overview</h3>
              <div className="flex items-center space-x-2">
                <button className="text-sm font-medium text-indigo-600">Month</button>
                <button className="text-sm text-gray-600 hover:text-gray-900">Year</button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <BarChart3 className="h-8 w-8" />
              <span className="ml-2">Analytics chart will be displayed here</span>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivity.map((activity, index) => (
                    <li key={activity.time}>
                      <div className="relative pb-8">
                        {index !== recentActivity.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                              <TrendingUp className="h-5 w-5 text-gray-500" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {activity.action} <span className="font-medium text-gray-900">{activity.item}</span>
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {activity.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;