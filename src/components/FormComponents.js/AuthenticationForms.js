import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  useCreateIndUserMutation,
  useCreateOrgUserMutation,
} from "../../redux/slices/userSlices/allUsersAPISlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ============================================
// SHARED COMPONENTS
// ============================================

const ButtonSpinner = () => (
  <span
    className="spinner-border spinner-border-sm me-2"
    role="status"
    aria-hidden="true"
  ></span>
);

const ShowPassWordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    fill="gray"
    viewBox="0 0 16 16"
  >
    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
  </svg>
);

const HidePassWordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    fill="gray"
    viewBox="0 0 16 16"
  >
    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
  </svg>
);

// ============================================
// INDIVIDUAL SIGN UP
// ============================================

// Add to your existing AuthenticationForms.js

export const SignUpIndividual = ({
  isVendorInvite = false,
  prefillEmail = "",
  transactionId = "",
}) => {
  const initialValues = {
    email: prefillEmail || "", // Pre-fill email from URL if available
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    checked: false,
  };

  const [person, setPerson] = useState(initialValues);
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [passwordToggle1, setPasswordToggle1] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [signup] = useCreateIndUserMutation();

  // Update initialValues when prefillEmail changes
  useEffect(() => {
    if (prefillEmail) {
      setPerson((prev) => ({ ...prev, email: prefillEmail }));
    }
  }, [prefillEmail]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPerson({
      ...person,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleShowHide = (e) => {
    e.preventDefault();
    setPasswordToggle(!passwordToggle);
  };

  const handleShowHide2 = (e) => {
    e.preventDefault();
    setPasswordToggle1(!passwordToggle1);
  };

  const validate = () => {
    const errors = {};

    if (!person.email) {
      errors.email = "Email is required";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(person.email)
    ) {
      errors.email = "Email is not valid";
    }

    if (!person.phoneNumber) {
      errors.phoneNumber = "Phone Number is required";
    } else if (
      !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(person.phoneNumber)
    ) {
      errors.phoneNumber = "Phone Number is not valid";
    }

    if (!person.password) {
      errors.password = "Password is required";
    } else if (
      !/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
        person.password,
      )
    ) {
      errors.password =
        "Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, and one number or special character";
    }

    if (!person.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (person.password !== person.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!person.checked) {
      errors.checked =
        "You must agree to the terms and conditions before submitting";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validate();
    setErrors(validationErrors);

    // Stop if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    const postDataInfo = {
      email: person.email,
      phone_number: person.phoneNumber,
      password: person.password,
      confirm_password: person.confirmPassword,
    };

    try {
      const res = await signup(postDataInfo).unwrap();

      if (res?.status === "true" || res?.status === "success") {
        toast.success(res?.message || "Account created successfully!");

        // If vendor invite, redirect to transaction confirmation
        if (isVendorInvite && transactionId) {
          navigate(`/vendor/confirm-order?transaction_id=${transactionId}`);
        } else {
          navigate("/linkverification", {
            state: { email: person.email },
          });
        }
      } else {
        toast.error(res?.message || "Sign up failed");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Sign up failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-100"
      style={{ maxWidth: "600px" }}
      onSubmit={handleSubmit}
    >
      {/* Email Field - Disabled for vendor invites */}
      <div className="mb-3">
        <input
          type="email"
          name="email"
          value={person.email}
          onChange={handleChange}
          className={`form-control form-control-lg ${errors.email ? "is-invalid" : ""}`}
          placeholder="Email address"
          disabled={loading || isVendorInvite} // Disable email field for vendor invites
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        {isVendorInvite && (
          <small className="text-muted">
            Your email has been pre-filled from the invitation
          </small>
        )}
      </div>

      {/* Phone Number Field */}
      <div className="mb-3">
        <input
          type="tel"
          name="phoneNumber"
          value={person.phoneNumber}
          onChange={handleChange}
          className={`form-control form-control-lg ${errors.phoneNumber ? "is-invalid" : ""}`}
          placeholder="Phone Number"
          disabled={loading}
        />
        {errors.phoneNumber && (
          <div className="invalid-feedback">{errors.phoneNumber}</div>
        )}
      </div>

      {/* Password Field */}
      <div className="mb-3">
        <div className="input-group">
          <input
            type={passwordToggle ? "text" : "password"}
            name="password"
            value={person.password}
            onChange={handleChange}
            className={`form-control form-control-lg ${errors.password ? "is-invalid" : ""}`}
            placeholder="Password"
            disabled={loading}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={handleShowHide}
            type="button"
            disabled={loading}
          >
            {passwordToggle ? <HidePassWordIcon /> : <ShowPassWordIcon />}
          </button>
          {errors.password && (
            <div className="invalid-feedback d-block">{errors.password}</div>
          )}
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="mb-3">
        <div className="input-group">
          <input
            type={passwordToggle1 ? "text" : "password"}
            name="confirmPassword"
            value={person.confirmPassword}
            onChange={handleChange}
            className={`form-control form-control-lg ${errors.confirmPassword ? "is-invalid" : ""}`}
            placeholder="Confirm Password"
            disabled={loading}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={handleShowHide2}
            type="button"
            disabled={loading}
          >
            {passwordToggle1 ? <HidePassWordIcon /> : <ShowPassWordIcon />}
          </button>
          {errors.confirmPassword && (
            <div className="invalid-feedback d-block">
              {errors.confirmPassword}
            </div>
          )}
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          name="checked"
          id="checked"
          checked={person.checked}
          onChange={handleChange}
          disabled={loading}
        />
        <label className="form-check-label text-muted" htmlFor="checked">
          By ticking this box you are indicating you have read and accept our
          terms and privacy policy.
        </label>
        {errors.checked && (
          <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
            {errors.checked}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="d-grid">
        <Button
          type="submit"
          className="btn btn-success btn-lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <ButtonSpinner />
              {isVendorInvite
                ? "Creating Account & Confirming Order..."
                : "Creating Account..."}
            </>
          ) : isVendorInvite ? (
            "Create Account & Accept Order"
          ) : (
            "Sign Up"
          )}
        </Button>
      </div>

      {/* Vendor Invite Note */}
      {isVendorInvite && (
        <div className="mt-3 text-center">
          <small className="text-muted">
            By creating an account, you'll automatically be directed to confirm
            your pending order.
          </small>
        </div>
      )}
    </form>
  );
};

// ============================================
// ORGANIZATION SIGN UP
// ============================================

export const SignUpOrganization = () => {
  const initialValues = {
    organization_name: "",
    organization_email: "",
    contact_email: "",
    contact_number: "",
    password: "",
    password_confirmation: "",
    checked: false,
  };

  const [organization, setOrganization] = useState(initialValues);
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [passwordToggle1, setPasswordToggle1] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [orgsignup] = useCreateOrgUserMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrganization({
      ...organization,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleShowHide = (e) => {
    e.preventDefault();
    setPasswordToggle(!passwordToggle);
  };

  const handleShowHide2 = (e) => {
    e.preventDefault();
    setPasswordToggle1(!passwordToggle1);
  };

  const validate = () => {
    const errors = {};

    if (!organization.organization_name) {
      errors.organization_name = "Organization Name is Required";
    }

    if (!organization.organization_email) {
      errors.organization_email = "Organization Email is Required";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(
        organization.organization_email,
      )
    ) {
      errors.organization_email = "Email is not valid";
    }

    if (!organization.contact_email) {
      errors.contact_email = "Contact person email is Required";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
        organization.contact_email,
      )
    ) {
      errors.contact_email = "Contact person Email is not valid";
    }

    if (!organization.contact_number) {
      errors.contact_number = "Contact person Phone Number is required";
    } else if (
      !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(
        organization.contact_number,
      )
    ) {
      errors.contact_number = "Phone Number is not valid";
    }

    if (!organization.password) {
      errors.password = "Password is required";
    } else if (
      !/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
        organization.password,
      )
    ) {
      errors.password =
        "Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, and one number or special character";
    }

    if (!organization.password_confirmation) {
      errors.password_confirmation = "Please confirm your password";
    } else if (organization.password !== organization.password_confirmation) {
      errors.password_confirmation = "Passwords do not match";
    }

    if (!organization.checked) {
      errors.checked =
        "You must agree to the terms and conditions before submitting";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validate();
    setErrors(validationErrors);

    // Stop if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    const postDataInfo = {
      organization_name: organization.organization_name,
      organization_email: organization.organization_email,
      contact_email: organization.contact_email,
      contact_number: organization.contact_number,
      password: organization.password,
      password_confirmation: organization.password_confirmation,
    };

    try {
      const res = await orgsignup(postDataInfo).unwrap();

      if (res?.status === "true" || res?.status === "success") {
        toast.success(
          res?.message || "Organization account created successfully!",
        );

        // ✅ FIX: Pass organization email to verification page
        navigate("/linkverification", {
          state: { email: organization.organization_email }, // <-- ADD THIS
        });
      } else {
        toast.error(res?.message || "Sign up failed");
      }
    } catch (err) {
      console.error("Organization sign up error:", err);
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Sign up failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-100"
      style={{ maxWidth: "600px" }}
      onSubmit={handleSubmit}
    >
      {/* Organization Name */}
      <div className="mb-3">
        <input
          type="text"
          name="organization_name"
          value={organization.organization_name}
          onChange={handleChange}
          className={`form-control form-control-lg ${errors.organization_name ? "is-invalid" : ""}`}
          placeholder="Organization Name"
          disabled={loading}
        />
        {errors.organization_name && (
          <div className="invalid-feedback">{errors.organization_name}</div>
        )}
      </div>

      {/* Organization Email */}
      <div className="mb-3">
        <input
          type="email"
          name="organization_email"
          value={organization.organization_email}
          onChange={handleChange}
          className={`form-control form-control-lg ${errors.organization_email ? "is-invalid" : ""}`}
          placeholder="Organization Email"
          disabled={loading}
        />
        {errors.organization_email && (
          <div className="invalid-feedback">{errors.organization_email}</div>
        )}
      </div>

      {/* Contact Section Header */}
      <h6 className="mb-3">Contact Person Information</h6>

      {/* Contact Email */}
      <div className="mb-3">
        <input
          type="email"
          name="contact_email"
          value={organization.contact_email}
          onChange={handleChange}
          className={`form-control form-control-lg ${errors.contact_email ? "is-invalid" : ""}`}
          placeholder="Contact Person Email"
          disabled={loading}
        />
        {errors.contact_email && (
          <div className="invalid-feedback">{errors.contact_email}</div>
        )}
      </div>

      {/* Contact Phone */}
      <div className="mb-3">
        <input
          type="tel"
          name="contact_number"
          value={organization.contact_number}
          onChange={handleChange}
          className={`form-control form-control-lg ${errors.contact_number ? "is-invalid" : ""}`}
          placeholder="Contact Person Phone Number"
          disabled={loading}
        />
        {errors.contact_number && (
          <div className="invalid-feedback">{errors.contact_number}</div>
        )}
      </div>

      {/* Password */}
      <div className="mb-3">
        <div className="input-group">
          <input
            type={passwordToggle ? "text" : "password"}
            name="password"
            value={organization.password}
            onChange={handleChange}
            className={`form-control form-control-lg ${errors.password ? "is-invalid" : ""}`}
            placeholder="Password"
            disabled={loading}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={handleShowHide}
            type="button"
            disabled={loading}
          >
            {passwordToggle ? <HidePassWordIcon /> : <ShowPassWordIcon />}
          </button>
          {errors.password && (
            <div className="invalid-feedback d-block">{errors.password}</div>
          )}
        </div>
      </div>

      {/* Confirm Password */}
      <div className="mb-3">
        <div className="input-group">
          <input
            type={passwordToggle1 ? "text" : "password"}
            name="password_confirmation"
            value={organization.password_confirmation}
            onChange={handleChange}
            className={`form-control form-control-lg ${errors.password_confirmation ? "is-invalid" : ""}`}
            placeholder="Confirm Password"
            disabled={loading}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={handleShowHide2}
            type="button"
            disabled={loading}
          >
            {passwordToggle1 ? <HidePassWordIcon /> : <ShowPassWordIcon />}
          </button>
          {errors.password_confirmation && (
            <div className="invalid-feedback d-block">
              {errors.password_confirmation}
            </div>
          )}
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          name="checked"
          id="orgChecked"
          checked={organization.checked}
          onChange={handleChange}
          disabled={loading}
        />
        <label className="form-check-label text-muted" htmlFor="orgChecked">
          By ticking this box you are indicating you have read and accept our
          terms and privacy policy.
        </label>
        {errors.checked && (
          <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
            {errors.checked}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="d-grid">
        <Button
          type="submit"
          className="btn btn-success btn-lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <ButtonSpinner />
              Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </div>
    </form>
  );
};
