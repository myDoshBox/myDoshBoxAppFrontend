import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
// import { Icon } from "@iconify/react";

// CalendarButton
// export const CalendarButton = () => {
//   return (
//     <Button className="CalendarBtnStyle border-0 mt-5 ms-3">
//       <span className="">
//         <Icon
//           className="mx-2"
//           icon="material-symbols:calendar-month-outline-sharp"
//           color="#A2A5AA"
//           width="20"
//         />
//         8 Aug 20 - 14 Aug 22
//       </span>
//     </Button>
//   );
// };

// CancelButton
export const CancelButton = () => {
  return (
    <Button
      className="border-0 mt-3 btn btn-danger text-white pale-red"
      style={{ width: "140px" }}
    >
      CANCEL
    </Button>
  );
};

export const GoBackHomeBtn = () => {
  return (
    <Button
      className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white"
      style={{ width: "160px" }}
    >
      Go Back Home
    </Button>
  );
};
// Ireject
// export const Ireject = () => {
//   return (
//     <Button
//       className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white pale-red"
//       style={{ width: "110px" }}
//     >
//       I Reject
//     </Button>
//   );
// };
// DeleteProduct;
export const DeleteProduct = () => {
  return (
    <Button
      className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white pale-red"
      style={{ width: "110px" }}
    >
      Delete Product
    </Button>
  );
};

export const ModalBtn = ({
  text,
  link,

  styles,
  onclick,
}) => {
  return (
    <Link to={link} type="submit" className={styles} onClick={onclick}>
      <span className="ms-1 me-2">{text}</span>
    </Link>
  );
};

// const CustomBtn = (props) => {
//   const { value, lefticon, righticon, ...rest } = props;

//   const btnContent = (
//     <BtnContent value={value} lefticon={lefticon} righticon={righticon} />
//   );

//   if (props.to) {
//     return (
//       <Link to={props.to} {...rest}>
//         {btnContent}
//       </Link>
//     );
//   }
//   else if (props.href) {
//     return (
//       <a href={props.href} {...rest}>
//         {btnContent}
//       </a>
//     );
//   }
//   return <button {...rest}>{btnContent}</button>;
// };

// export default CustomBtn;
/*
 * To pass the tests for the CustomBtn component, make sure to include the following attributes:
 *
 * - aria-label or text content: A clear and descriptive label that communicates the button's function.
 * - type: Specify the type of button as "button", "submit", or "reset".
 * - form: If the button is used inside a form, include this attribute with the value set to the id of the parent form.
 *
 * Additionally, make sure that the button is designed to be responsive and work well on all devices,
 * has sufficient contrast between its text and background, and is accessible to people with disabilities.
 *
 * Here are some common button types and their associated class names:
 *
 * - GetStarted /SignUp /SignIn /ResolveConflict /SellersStatement /BuyersFault /SellersFault /DropConflict /InvolveNeutrals /Submit /EditProfile /EditTicket /ResendProduct /ContestComplaint /ViewMore /ViewComplaint /LearnMore /NewTransactionButton /ProceedButton /IAgreeButton
 * - BuyersStatement/InitiateDispute/ConfirmDeliveryButton/ConfirmButton/DeliverProductButton
 * - SignUpOrganization/SignUpIndividual|className(Sign Up as an Organization|SignUpGroup, btn)
 * - GoogleSignUpButton/GoogleSignUpButton(Sign Up with Google/Sign In with Google|GoogleAuthBtn, btn)
 * - PreviousButton/NextButton/BackButton/StartTransactionButton - className(GeneralBtnStyle1 btn all-btn text-white)
 * - ViewMoreButton - className(ViewComplaintBtnStyle border-0 mt-5 ms-3)
 * - ScrollUpButton - className(ScrollUpBtnStyle border )
 * - CancelButton - className(CancelBtn border-0)
 * - LearnMoreCardButton - className(d-none d-sm-block LearnMoreCardButton)
 */
