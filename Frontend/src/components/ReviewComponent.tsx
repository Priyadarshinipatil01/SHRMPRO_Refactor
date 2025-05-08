import React from 'react';

interface ReviewComponentProps {
  schemaData: any[];
  formData: { [key: string]: any };
  onBack: () => void;
  onConfirm: () => void;
}

const ReviewComponent: React.FC<ReviewComponentProps> = ({
  schemaData,
  formData,
  onBack,
  onConfirm,
}) => {
  const renderNestedReview = (nestedData: any): React.ReactNode => {
    return React.createElement(
      'div',
      {},
      React.createElement(
        'p',
        { className: 'text-muted small' },
        nestedData.question
      ),
      React.createElement(
        'p',
        { className: 'font-weight-bold' },
        formData[nestedData.key] || 'No response'
      ),
      nestedData.isenabled &&
        nestedData.isenabled[formData[nestedData.key]] &&
        nestedData.isenabled[formData[nestedData.key]].map((nestedQuestion: any) =>
          renderNestedReview(nestedQuestion)
        )
    );
  };

  return React.createElement(
    'div',
    { className: 'container py-4' },
    React.createElement(
      'div',
      { className: 'card shadow-sm' },
      React.createElement(
        'div',
        { className: 'card-body' },
        React.createElement('h2', { className: 'h4 mb-4' }, 'Review Your Responses'),
        React.createElement(
          'div',
          { className: 'mb-4' },
          schemaData.map((question) =>
            React.createElement(
              'div',
              { key: question.key, className: 'mb-3' },
              renderNestedReview(question)
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'mb-4' },
          React.createElement('h3', { className: 'h5 mb-2' }, 'JSON Output:'),
          React.createElement(
            'pre',
            { className: 'bg-light p-3 rounded border' },
            JSON.stringify({ attendanceRuleSetup: formData }, null, 2)
          )
        ),
        React.createElement(
          'div',
          { className: 'd-flex justify-content-between mt-3' },
          React.createElement(
            'button',
            { className: 'btn btn-secondary', onClick: onBack },
            'Back to Edit'
          ),
          React.createElement(
            'button',
            { className: 'btn btn-success', onClick: onConfirm },
            'Confirm & Submit'
          )
        )
      )
    )
  );
};

export default ReviewComponent;
