// import { MiniProfileCard } from "../../components/CardComponents/UsersCards";
import { UpdateBankDetails } from "../../../components/FormComponents.js/UpdateForms";
import { UserUpdateProfile } from "../../../components/FormComponents.js/UpdateForms";
import { Reportissuesform } from "../../../components/FormComponents.js/IssuesComplaintForms";
import {
  BigLogoutIcon,
  ChangeBankIcon,
  ContactUsIcon,
  FaqIcon,
  FeedbackIcon,
  UpdateProfileIcon,
} from "../../../components/IconComponent/UserdashboardIcons";
import { useNavigate } from "react-router-dom";
import {
  UserDashboardCard,
  MiniProfileCard,
  MiniProfileCardSettings,
} from "../../../components/CardComponents/UsersCards";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";

const UserSettingsPage = () => {
  return (
    <div
      className="container-fluid px-0"
      style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}>
      <div className="row g-0">
        <div className="col-12">
          <UserDashboardNavbar />
          <div className="px-3 px-lg-4 py-2">
            <SettingsPage />
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const navigate = useNavigate();

  const nav = () => {
    navigate("/");
  };
  return (
    <>
      <div className="row mt-5 mb-5">
        <div className="col-lg-5 col-sm-12">
          <MiniProfileCardSettings />
        </div>
        <div className="col-lg-7 col-sm-12 row">
          <div className="col-12 row">
            <div className="col-sm-12 mb-2 col-lg-6 mt-4 mt-lg-0">
              <UserDashboardCard
                icon={<UpdateProfileIcon />}
                text={"Update Profile"}
                link={"../updateprofile"}
              />
            </div>
            <div className="col-sm-12 mb-2 col-lg-6">
              <UserDashboardCard
                icon={<ChangeBankIcon />}
                text={"Update Bank Details"}
                link={"../updatebank"}
              />
            </div>
          </div>
          <div className="col-12 row">
            <div className="col-sm-12 mb-2 col-lg-6">
              <UserDashboardCard
                icon={<FeedbackIcon />}
                text={"Report App Defect"}
                link={"../reportissues"}
              />
            </div>
            <div className="col-sm-12 mb-2 col-lg-6">
              <UserDashboardCard
                icon={<ContactUsIcon />}
                text={"Contact Us"}
                link={"/contactus"}
              />
            </div>
          </div>
          <div className="col-12 row">
            <div className="col-sm-12 col-lg-6">
              <UserDashboardCard
                icon={<FaqIcon />}
                text={"FAQs"}
                link={"/faqs"}
              />
            </div>
            <div className="col-sm-12 col-lg-6" onClick={nav}>
              <UserDashboardCard icon={<BigLogoutIcon />} text={"Logout"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const UpdateBankDetailsPage = () => {
  return (
    <>
      <div className="contestPage">
        <div className="row">
          <div className="col-lg-3 col-sm-12"></div>

          <div className="col-lg-9 col-sm-12">
            <UserDashboardNavbar />
            <div className="mt-5">
              <UpdateBankDetails />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export const UpdateProfilePage = () => {
  return (
    <div className="contestPage">
      <div className="row">
        <div className="col-lg-3 col-sm-12"></div>

        <div className="col-lg-9 col-sm-12">
          <UserDashboardNavbar />
          <div className="mt-5">
            <UserUpdateProfile />
          </div>
        </div>
      </div>
    </div>
  );
};
export const ReportIssuesformPage = () => {
  return (
    <div className="contestPage">
      <div className="row">
        <div className="col-lg-3 col-sm-12"></div>

        <div className="col-lg-9 col-sm-12">
          <UserDashboardNavbar />
          <div className="mt-5">
            <Reportissuesform />
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserSettingsPage;
