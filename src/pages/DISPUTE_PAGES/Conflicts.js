import { AllConflictsTable } from "../../components/TableComponents/ConflictsTable";
import { UserDashboardNavbar } from "../../components/NavbarComponents/TopNavbars";

export const OpenConflicts = () => {
  return (
    <div>
      <div className="row">
        <div className="col-lg-3 col-sm-12 px-0"></div>

        <div className="col-lg-9 col-sm-12 px-0">
          <div className="mt-3 pe-lg-5">
            <UserDashboardNavbar />
          </div>
          <div className="center-card">
            <AllConflictsTable conflictType="Open" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ClosedConflicts = () => {
  return (
    <div>
      <div className="row">
        <div className="col-lg-3 col-sm-12 px-0"></div>

        <div className="col-lg-9 col-sm-12 px-0">
          <div className="mt-3 pe-lg-5">
            <UserDashboardNavbar />
          </div>
          <div className="center-card">
            <AllConflictsTable conflictType="Closed" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const OngoingConflicts = () => {
  return (
    <div>
      <div className="row">
        <div className="col-lg-3 col-sm-12 px-0"></div>

        <div className="col-lg-9 col-sm-12 px-0">
          <div className="mt-3 pe-lg-5">
            <UserDashboardNavbar />
          </div>
          <div className="center-card">
            <AllConflictsTable conflictType="Ongoing" />
          </div>
        </div>
      </div>
    </div>
  );
};
