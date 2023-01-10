// NotificationCard
// LearnMoreCard

import { height } from "@mui/system";
import Learning_illustration from "../../images/Learninge.png";

export const LearnMoreCard = () => {
  return (
    <div
      className="d-flex card-body p-2 border rounded-3 LearnMoreCard "
      style={{ width: "100%" }}
    >
      <div className="">
        <div>
          <h6 className="fw-bold text-white">Learn More</h6>
          <p className="text-wrap text-white">
            About how we ensure maximum security for your transactions
          </p>
        </div>
        <span>
          <button
            type="button"
            className="btn LearnMoreCard text-white border border-white"
          >
            Get Started
          </button>
        </span>
      </div>
      <div className="w-25 d-none d-md-block">
        <img src={Learning_illustration} className=" img-fluid" alt="" />
      </div>
      <div className="w-75 d-md-none .d-lg-block">
        <img src={Learning_illustration} className=" img-fluid mt-4" alt="" />
      </div>
    </div>
  );
};
