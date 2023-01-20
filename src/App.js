import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  NeutralsSidenav,
  UserSidenav,
} from "./components/NavbarComponents/SideNavbar";
import { GuestNavbar } from "./components/NavbarComponents/TopNavbars";
import Homepage from "./pages/GENERAL_PAGES/Homepage";
import AboutUs from "./pages/GENERAL_PAGES/AboutUs";
import ContactUs from "./pages/GENERAL_PAGES/ContactUs";
import PricingPage from "./pages/GENERAL_PAGES/PricingPage";
import FAQs from "./pages/GENERAL_PAGES/FAQs";
import Error404 from "./pages/GENERAL_PAGES/Error404";
import { Footer } from "./components/FooterComponents";
import UsersSideNav from "./components/NavbarComponents/UsersSideNav";
import UserDashboardPage from "./pages/DASHBOARDS/USER_DASHBOARD/UserDashboardPage";
import NotifictionPage from "./pages/DASHBOARDS/USER_DASHBOARD/NotifictionPage";
// import FAQs from "./pages/GENERAL_PAGES/FAQs";
import UserDisputeHistory from "./pages/DASHBOARDS/USER_DASHBOARD/UserDisputesHistory";
import UserSettingsPage from "./pages/DASHBOARDS/USER_DASHBOARD/UserSettingsPage";
import UserTransactionHistory from "./pages/DASHBOARDS/USER_DASHBOARD/UserTransactionHistory";
import NeutralsSideNav from "./components/NavbarComponents/NeutralsSideNav";
// import GeneralPagesRoutes from "./pages/ROUTES/GeneralPagesRoutes";

// Neutral Pages
import { CloseConflict } from "./pages/DASHBOARDS/NEUTRALS_PAGES/CloseConflict";
import { NeutralSetting } from "./pages/DASHBOARDS/NEUTRALS_PAGES/NeutralSetting";
import { NeutralViewTransaction } from "./pages/DASHBOARDS/NEUTRALS_PAGES/NeutralViewTransaction";
import NeutralDashboard from "./pages/DASHBOARDS/neutral_dashboard";
import {
  ClosedConflicts,
  OngoingConflicts,
  OpenConflicts,
} from "./pages/DISPUTE_PAGES/Conflicts";
import SignInPage from "./pages/AUTHENTICATION_PAGES/SignIn";
import SignUpPage from "./pages/AUTHENTICATION_PAGES/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        {/* GENERAL PAGE ROUTE CAN BE FOUND AT GeneralPagesRoutes */}
        <Route element={<GuestNavbar />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/pricingpage" element={<PricingPage />} />
          <Route path="/faqs" element={<FAQs />} />
          ``
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        <Route path="userdashboard" element={<UsersSideNav />}>
          <Route path="userdashboardpage" element={<UserDashboardPage />} />
          <Route path="usersettings" element={<UserSettingsPage />} />
          <Route path="usertransaction" element={<UserTransactionHistory />} />
          <Route path="userdispute" element={<UserDisputeHistory />} />
          <Route path="notification" element={<NotifictionPage />} />
        </Route>

        <Route path="neutraldashboard" element={<NeutralsSideNav />}>
          <Route path="open-conflicts" element={<OpenConflicts />} />
          <Route path="closed-conflicts" element={<ClosedConflicts />} />
          <Route path="ongoing-conflicts" element={<OngoingConflicts />} />
          <Route path="neutralsetting" element={<NeutralSetting />} />
          <Route
            path="neutralviewtransaction"
            element={<NeutralViewTransaction />}
          />
          <Route path="notification" element={<NotifictionPage />} />

          <Route path="neutraldashboardpage" element={<NeutralDashboard />} />
        </Route>
        {/* <Route path="*" element={<Navigate to={<Error404 />} />} /> */}
        {/* <Route path="*" element={<Error404 />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
