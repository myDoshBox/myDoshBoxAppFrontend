import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
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
export const Ireject = () => {
  return (
    <Button
      className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white pale-red"
      style={{ width: "110px" }}
    >
      I Reject
    </Button>
  );
};
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

export const FilterButton = () => {
  return (
    <Button className="FilteBtnStyle bg-transparent border-0">
      <span className="">
        <svg
          className="mb-1 me-2"
          width="18"
          height="17"
          viewBox="0 0 18 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.3484 8.55969H13.4978M4.94587 1.9082C5.19788 1.9082 5.43957 2.00831 5.61777 2.18651C5.79597 2.36471 5.89608 2.6064 5.89608 2.85842V4.75884C5.89608 5.01085 5.79597 5.25254 5.61777 5.43074C5.43957 5.60894 5.19788 5.70905 4.94587 5.70905C4.69386 5.70905 4.45217 5.60894 4.27397 5.43074C4.09577 5.25254 3.99566 5.01085 3.99566 4.75884V2.85842C3.99566 2.6064 4.09577 2.36471 4.27397 2.18651C4.45217 2.00831 4.69386 1.9082 4.94587 1.9082V1.9082ZM16.3484 3.80863H5.89608H16.3484ZM3.99566 3.80863H1.14502H3.99566ZM4.94587 11.4103C5.19788 11.4103 5.43957 11.5104 5.61777 11.6886C5.79597 11.8668 5.89608 12.1085 5.89608 12.3605V14.261C5.89608 14.513 5.79597 14.7547 5.61777 14.9329C5.43957 15.1111 5.19788 15.2112 4.94587 15.2112C4.69386 15.2112 4.45217 15.1111 4.27397 14.9329C4.09577 14.7547 3.99566 14.513 3.99566 14.261V12.3605C3.99566 12.1085 4.09577 11.8668 4.27397 11.6886C4.45217 11.5104 4.69386 11.4103 4.94587 11.4103ZM16.3484 13.3107H5.89608H16.3484ZM3.99566 13.3107H1.14502H3.99566ZM12.5476 6.65926C12.7996 6.65926 13.0413 6.75937 13.2195 6.93757C13.3977 7.11577 13.4978 7.35746 13.4978 7.60947V9.5099C13.4978 9.76191 13.3977 10.0036 13.2195 10.1818C13.0413 10.36 12.7996 10.4601 12.5476 10.4601C12.2956 10.4601 12.0539 10.36 11.8757 10.1818C11.6975 10.0036 11.5974 9.76191 11.5974 9.5099V7.60947C11.5974 7.35746 11.6975 7.11577 11.8757 6.93757C12.0539 6.75937 12.2956 6.65926 12.5476 6.65926V6.65926ZM11.5974 8.55969H1.14502H11.5974Z"
            stroke="#4B4453"
            stroke-width="1.90042"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Sort by: <b> Recent </b>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-chevron-down"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </span>
    </Button>
  );
};
