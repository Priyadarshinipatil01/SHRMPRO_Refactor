import React from 'react';

interface ConfirmationComponentProps {
  formData: { [key: string]: any };
}

const ConfirmationComponent: React.FC<ConfirmationComponentProps> = ({ formData }) => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="text-center bg-white p-4 rounded shadow-sm">
            <div className="mb-4 text-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="bi bi-check-circle-fill"
                width="64"
                height="64"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.08 0l3.992-3.992a.75.75 0 0 0-1.06-1.06L7.5 9.44 5.53 7.47a.75.75 0 0 0-1.06 1.06l2.5 2.5z" />
              </svg>
            </div>
            <h2 className="h4 mb-3">Attendance Rule Created!</h2>
            <p className="text-secondary mb-4">
              Your attendance rule "<strong>{formData.ruleName}</strong>" has been successfully set up.
            </p>
            <div
              className="bg-light border rounded p-3 text-start"
              style={{ maxHeight: '300px', overflowY: 'auto' }}
            >
              <pre className="mb-0 small">
                {JSON.stringify({ attendanceRuleSetup: formData }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationComponent;
