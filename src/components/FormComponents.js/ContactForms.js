import { useState } from "react";
import { Form } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { SubmitButton } from "../ButtonsComponent/ConflictButtons";

//ContactUsForm
export const ContactUsForm = () => {
  const [contactUs, setcontactUs] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setcontactUs({ ...contactUs, [name]: value });
  };

  return (
    <>
      <h4 className="text-success">Send us a message</h4>
      <Form>
        <div>
          <Form.Group className="mb-3">
            <Form.Control
              className="labelStyle"
              type="text"
              placeholder="Enter Name"
              value={contactUs.name}
              onChange={handleChange}
              id="name"
              name="name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="text"
              className="labelStyle"
              placeholder="Email"
              value={contactUs.email}
              onChange={handleChange}
              id="email"
              name="email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <FloatingLabel
              className="labelStyle"
              controlId="floatingTextarea2"
              label="Enter your message"
            >
              <Form.Control as="textarea" placeholder="Enter your message" />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="mt-2 mb-3 fs-6 ">
            <Form.Check
              className="checkboxStyle"
              type="checkbox"
              label="I accept the Terms of Sevice"
            />
          </Form.Group>

          <div className="mt-1 d-flex justify-content-center">
            <SubmitButton />
          </div>
        </div>
        {/* Form Here End */}
      </Form>
    </>
  );
};

export const SubscribeForm = () => {
  const initialState = {
    email: " ",
  };
  const [values, setValue] = useState(initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleemailInputChange = (e) => {
    setValue({ ...values, email: e.target.value });
  };

  return (
    <form class="input-group">
      <input
        type="text"
        className="form-control p-3 rounded-4"
        placeholder="Enter email to receive updates and newsletter"
        aria-label="Subscribe"
        aria-describedby="basic-addon2"
        value={values.email}
        onChange={handleemailInputChange}
      />
      <span
        className="input-group-text btn border text-white bg-success  "
        id="basic-addon2"
        onClick={handleSubmit}
      >
        SUBSCRIBE
      </span>
    </form>
  );
};
