import { Button } from "react-bootstrap";

//Edit Profile Button
export const EditProfileButton = () => {
  return (
    <Button className="edit-profile-btn  all-btn border-0 rounded-1">
      Edit Profile
    </Button>
  );
};
//TicketButton
export const EditTicketButton = () => {
  return (
    <Button
      className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white"
      style={{ width: "140px" }}
    >
      EDIT TICKET
    </Button>
  );
};
//Resend Product
export const ResendProductButton = () => {
  return (
    <Button className="edit-ticket-btn all-btn border-0 rounded-1">
      RESEND PRODUCT
    </Button>
  );
};

//ContestComplaint Button
export const ContestComplaintButton = () => {
  return (
    <Button className="edit-ticket-btn all-btn border-0 rounded-1">
      CONTEST COMPLAINT
    </Button>
  );
};
