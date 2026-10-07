import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { AppShell } from '@/components/layout/AppShell'

import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import JobDetails from '@/pages/JobDetails'
import Messages from '@/pages/Messages'
import Notifications from '@/pages/Notifications'
import Profile from '@/pages/Profile'

import SeekerDashboard from '@/pages/seeker/SeekerDashboard'
import FindJobs from '@/pages/seeker/FindJobs'
import MyApplications from '@/pages/seeker/MyApplications'
import Earnings from '@/pages/seeker/Earnings'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/seeker" element={<AppShell role="jobSeeker" />}>
            <Route index element={<SeekerDashboard />} />
            <Route path="jobs" element={<FindJobs />} />
            <Route path="jobs/:id" element={<JobDetails role="jobSeeker" />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
