import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DriverOnboarding from "./pages/DriverOnboarding";
import DriverOnboardingTest from "./components/DriverOnboardingTest";
import DriverOnboardingTestPage from "./components/DriverOnboardingTestPage";
import DriverInfoVerification from "./components/DriverInfoVerification";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import RideSearchResults from "./pages/RideSearchResults";
import BookingConfirmation from "./pages/BookingConfirmation";
import BestOffers from "./pages/BestOffers";
import BookingForm from "./components/booking/BookingForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookingSuccess from "./pages/BookingSuccess";
import DatabaseSettings from "./pages/DatabaseSettings";
import DataManagement from "./pages/DataManagement";
import ProfilePage from "./pages/ProfilePage";
import MapDemo from "./pages/MapDemo";
import ProfessionalBookingDemo from './pages/ProfessionalBookingDemo';
import GoogleSignUpSlides from './components/GoogleSignUpSlides';
import AdminNotificationTestPage from './pages/AdminNotificationTestPage';
import BookingConfirmationTestPage from './pages/BookingConfirmationTestPage';
import CurrentTrips from './pages/CurrentTrips';
import TestPage from './pages/TestPage';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import TripTracking from './pages/TripTracking';
import DriversMap from './pages/DriversMap';
import TripTrackingMapbox from './pages/TripTrackingMapbox';
import DriversMapMapbox from './pages/DriversMapMapbox';
// Mapbox imports
import DriverMapMapbox from './components/driver/DriverMapMapbox';
import DriverMap from './components/driver/DriverMap';
import PassengerMapMapbox from './components/passenger/PassengerMapMapbox';
import MapDemoMapbox from './pages/MapDemoMapbox';
import { TranslationProvider } from "./hooks/useTranslation";
import { ScheduledTasksService } from "./integrations/database/scheduledTasksService";
import BottomNavigationBar from "./components/layout/BottomNavigationBar";
import AuthCallback from './pages/AuthCallback';
import { LocationPermissionRequest } from "./components/LocationPermissionRequest";

// Initialize scheduled tasks
ScheduledTasksService.startScheduledTasks();

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <LocationPermissionRequest>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/driver" element={<DriverOnboarding />} />
                <Route path="/driver-test" element={<DriverOnboardingTest />} />
                <Route path="/driver-test-page" element={<DriverOnboardingTestPage />} />
                <Route path="/driver-verify" element={<DriverInfoVerification />} />
              </Route>
              <Route element={<ProtectedRoute requireRole="admin" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/settings" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/notification-test" element={<AdminNotificationTestPage />} />
                <Route path="/admin/booking-confirmation-test" element={<BookingConfirmationTestPage />} />
                <Route path="/database-settings" element={<DatabaseSettings />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/booking-confirmation-test" element={<BookingConfirmationTestPage />} />
              </Route>
              <Route path="/about" element={<About />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route path="/auth/signin" element={<SignIn />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/google-signup" element={<GoogleSignUpSlides />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/ride-search" element={<RideSearchResults />} />
              <Route path="/current-trips" element={<CurrentTrips />} />
              <Route path="/best-offers" element={<BestOffers />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/booking-form" element={<BookingForm />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/data-management" element={<DataManagement />} />
              <Route path="/test" element={<TestPage />} />
              {/* Map routes - Admin only */}
              <Route element={<ProtectedRoute requireRole="admin" />}>
                <Route path="/map-demo" element={<MapDemo />} />
                <Route path="/drivers-map" element={<DriversMap />} />
                <Route path="/driver-map" element={<DriverMap />} />
                <Route path="/drivers-map-mapbox" element={<DriversMapMapbox />} />
                <Route path="/driver-map-mapbox" element={<DriverMapMapbox />} />
                <Route path="/passenger-map-mapbox" element={<PassengerMapMapbox bookingId={1} />} />
                <Route path="/map-demo-mapbox" element={<MapDemoMapbox />} />
              </Route>
              {/* Trip tracking - Available for all authenticated users */}
              <Route path="/trip-tracking" element={<TripTracking />} />
              <Route path="/trip-tracking-mapbox" element={<TripTrackingMapbox />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              {/* Professional Booking Demo Route */}
              <Route path="/professional-booking-demo" element={<ProfessionalBookingDemo />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNavigationBar />
            </LocationPermissionRequest>
          </BrowserRouter>
        </TooltipProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
}

export default App;