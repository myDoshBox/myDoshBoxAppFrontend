import Container from "react-bootstrap/Container";
import { useState } from "react";
import UsersSideNav from "../../components/NavbarComponents/UsersSideNav";

const ContestComplaintForm = () => {
  return (
    <div>
      <ContestForm />
    </div>
  );
};

const ContestForm = () => {
  const initialValues = {
    phoneNumber: "",
    file: File,
    commentSection: "",
  };

  const [contest, setContest] = useState(initialValues);
  const [contestDetails, setContestDetails] = useState([]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setContest({ ...contest, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contest.phoneNumber && contest.file && contest.commentSection) {
      setContestDetails([...contestDetails, contest]);
      setContest(initialValues);
    }
  };

  return (
    <>
      <div className="w-75 mx-auto">
        <div className="mt-5 text-center">
          <h5 className="fw-bold">COMPLAINT FORM</h5>
        </div>

        {/* Form Section Starts */}

        <form className="form mt-5">
          <div className="mb-3">
            <input
              onChange={handleChange}
              value={contest.phoneNumber}
              placeholder="Phone Number"
              type="tel"
              className="form-control"
              id="phoneNumber"
              name="phoneNumber"
            />

            <span
              id="nameHelp"
              className="form-text text-danger fst-italic fw-lighter"
            >
              *This field is required
            </span>
          </div>

          <div className="input-group mb-3">
            <input
              onChange={handleChange}
              value={contest.file}
              type="file"
              className="form-control"
              id="file"
              name="file"
              placeholder="Attach Image(s)"
            />
          </div>

          <div className="mb-3 mt-4">
            <textarea
              onChange={handleChange}
              value={contest.commentSection}
              placeholder="Reasons for contesting this complaint"
              className="form-control "
              id="commentSection"
              name="commentSection"
              rows="5"
            ></textarea>
          </div>

          <div className="d-grid w-25 mx-auto mt-4">
            <button
              className="btn btn-success"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ContestComplaintForm;
