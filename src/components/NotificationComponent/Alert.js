import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Alert as BootstrapAlert, Button } from "react-bootstrap";

export const AlertDescription = ({ children, className = "" }) => (
  <div className={`text-sm ${className}`}>{children}</div>
);

export const Alert = ({
  children,
  variant = "default",
  className = "",
  show: initialShow = true,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
}) => {
  const [show, setShow] = useState(initialShow);

  useEffect(() => {
    setShow(initialShow);
  }, [initialShow]);

  useEffect(() => {
    let timeoutId;
    if (show && autoClose) {
      timeoutId = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [show, autoClose, autoCloseTime]);

  const handleClose = () => {
    setShow(false);
    if (onClose) {
      onClose();
    }
  };

  if (!show) return null;

  // Map custom variants to Bootstrap variants
  const getBootstrapVariant = () => {
    switch (variant) {
      case "success":
        return "success";
      case "destructive":
        return "danger";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  };

  // Custom styling to match your original design
  const customStyles = {
    position: "fixed",
    top: "20px",
    right: "20px",
    minWidth: "320px",
    maxWidth: "480px",
    zIndex: 1050,
    border: "1px solid",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    animation: "slideInRight 0.3s ease-out",
  };

  // Add CSS animation
  const animationStyles = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;

  // Custom background colors to match your original design
  const getCustomBackground = () => {
    switch (variant) {
      case "default":
        return {
          backgroundColor: "#E3F2FD",
          borderColor: "#64B5F6",
          color: "#1565C0",
        };
      case "destructive":
        return {
          backgroundColor: "#FFEBEE",
          borderColor: "#EF9A9A",
          color: "#C62828",
        };
      case "success":
        return {
          backgroundColor: "#E8F5E9",
          borderColor: "#81C784",
          color: "#2E7D32",
        };
      case "warning":
        return {
          backgroundColor: "#FFF3E0",
          borderColor: "#FFB74D",
          color: "#EF6C00",
        };
      default:
        return {};
    }
  };

  const customBackground = getCustomBackground();

  // Icon configuration based on variant
  const iconConfig = {
    success: {
      icon: (
        <FaCheckCircle
          className="me-2 text-success"
          style={{ fontSize: "1.25rem" }}
        />
      ),
      ariaLabel: "Success",
    },
    destructive: {
      icon: (
        <FaTimesCircle
          className="me-2 text-danger"
          style={{ fontSize: "1.25rem" }}
        />
      ),
      ariaLabel: "Error",
    },
    default: {
      icon: null,
      ariaLabel: "Info",
    },
    warning: {
      icon: null,
      ariaLabel: "Warning",
    },
  };

  const { icon, ariaLabel } = iconConfig[variant] || {};

  return (
    <>
      <style>{animationStyles}</style>
      <BootstrapAlert
        variant={getBootstrapVariant()}
        show={show}
        onClose={handleClose}
        dismissible
        style={{ ...customStyles, ...customBackground }}
        className={className}>
        <div className="d-flex align-items-start justify-content-between">
          <div className="d-flex align-items-center flex-grow-1">
            {icon && <span aria-label={ariaLabel}>{icon}</span>}
            <div className="flex-grow-1">{children}</div>
          </div>
          <Button
            variant="link"
            onClick={handleClose}
            className="text-muted p-1 ms-2 flex-shrink-0"
            style={{
              border: "none",
              background: "none",
              lineHeight: 1,
            }}
            aria-label="Close alert">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </Button>
        </div>
      </BootstrapAlert>
    </>
  );
};

export default Alert;
