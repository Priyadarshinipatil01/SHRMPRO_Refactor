import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import { fetchSchemaData } from '../services/api';
import ReviewComponent from './ReviewComponent';
import ConfirmationComponent from './ConfirmationComponent';


const Header: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [showForm, setShowForm] = useState(false);
  const [schemaData, setSchemaData] = useState<any[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [showReview, setShowReview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLanguageChange = (language: string) => {
    console.log('Language changed to:', language);
    setSelectedLanguage(language);
  };

  const handleGetStartedClick = async () => {
    console.log('Get Started clicked');
    try {
      const data = await fetchSchemaData(2); // Fetch schema data from API
      console.log('Schema data received:', data);
      setSchemaData(data);
      setShowForm(true);
    } catch (error) {
      console.error('Error fetching schema:', error);
    }
  };

  const handleBack = () => {
    console.log('Back clicked, current question index:', questionIndex);
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else {
      setShowForm(false);
      setQuestionIndex(0);
      setFormData({});
    }
  };

  const handleNext = () => {
    console.log('Next clicked, current question index:', questionIndex);
    if (questionIndex < schemaData.length - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
    console.log(key, "changed value:", value);
  
    // Reset nested data if the parent question changes
    if (key === 'relaxation_rule_enabled' && value === 'No') {
      setFormData((prevData) => ({
        ...prevData,
        permissible_grace_time: undefined,
        grace_time: undefined,
        relaxation_option: undefined,
      }));
    }
  
    // Reset nested fields when relaxation_deduction is "No"
    if (key === 'relaxation_deduction' && value === 'No') {
      setFormData((prevData) => ({
        ...prevData,
        deduction_type: undefined,
        deduction_duration: undefined,
      }));
    }

    // Auto-calculate attendance_cycle_to based on attendance_cycle_from
    if (key === 'attendance_cycle_from') {
      const fromValue = parseInt(value);
      if (!isNaN(fromValue)) {
        const toValue = fromValue === 1 ? 31 : fromValue - 1;
        setFormData((prevData) => ({
          ...prevData,
          attendance_cycle_to: toValue.toString(),
        }));
      }
    }
  };

  const renderInput = () => {
    const current = schemaData[questionIndex];
    if (!current) return null;
    const nestedQuestions =
      current.isenabled &&
      formData[current.key] &&
      current.isenabled[formData[current.key]]
        ? current.isenabled[formData[current.key]]
        : null;
  
    console.log('Current question:', current);
    console.log('Nested questions:', nestedQuestions || 'No nested questions');
  
    if (
      current.key === 'relaxation_rule_enabled' || 
      current.key === 'process_short_leave' || 
      current.key === 'relaxation_deduction'
    ) {
      return (
        <>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              name={current.key}
              value="Yes"
              checked={formData[current.key] === 'Yes'}
              onChange={() => handleChange(current.key, 'Yes')}
            />
            <label className="form-check-label">Yes</label>
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              name={current.key}
              value="No"
              checked={formData[current.key] === 'No'}
              onChange={() => handleChange(current.key, 'No')}
            />
            <label className="form-check-label">No</label>
          </div>
          {formData[current.key] === 'Yes' &&
            nestedQuestions &&
            nestedQuestions.map((nestedQuestion: any) => (
              <div key={nestedQuestion.key}>
                <h5>{nestedQuestion.question}</h5>
                {renderNestedInput(nestedQuestion)}
              </div>
            ))}
        </>
      );
    }

    switch (current.type) {
      case 'text':
      case 'integer':
        return (
          <input
            className="form-control mb-3"
            type="text"
            placeholder={current.example || ''}
            value={formData[current.key] || ''}
            onChange={(e) => handleChange(current.key, e.target.value)}
            disabled={current.key === 'attendance_cycle_to'}
          />
        );
      case 'dropdown':
        return (
          <select
            className="form-control mb-3"
            value={formData[current.key] || ''}
            onChange={(e) => handleChange(current.key, e.target.value)}
          >
            <option value="">Select an option</option>
            {current.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={formData[current.key] || false}
              onChange={(e) => handleChange(current.key, e.target.checked)}
              id={current.key}
            />
            <label className="form-check-label" htmlFor={current.key}>
              {current.question}
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  const renderNestedInput = (nestedQuestion: any) => {
    if (!nestedQuestion) return null;

    const nestedSubQuestions =
      nestedQuestion.isenabled &&
      formData[nestedQuestion.key] &&
      nestedQuestion.isenabled[formData[nestedQuestion.key]]
        ? nestedQuestion.isenabled[formData[nestedQuestion.key]]
        : null;

    const renderField = () => {
      switch (nestedQuestion.type) {
        case 'text':
        case 'integer':
          return (
            <input
              className="form-control mb-3"
              type="text"
              placeholder={nestedQuestion.example || ''}
              value={formData[nestedQuestion.key] || ''}
              onChange={(e) => handleChange(nestedQuestion.key, e.target.value)}
            />
          );
        case 'dropdown':
          return (
            <select
              className="form-control mb-3"
              value={formData[nestedQuestion.key] || ''}
              onChange={(e) => handleChange(nestedQuestion.key, e.target.value)}
            >
              <option value="">Select an option</option>
              {nestedQuestion.options?.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        case 'boolean':
          if (nestedQuestion.key === 'relaxation_deduction') {
            return (
              <div className="mb-3">
                <label className="form-label">{nestedQuestion.question}</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={nestedQuestion.key}
                    value="Yes"
                    checked={formData[nestedQuestion.key] === 'Yes'}
                    onChange={() => handleChange(nestedQuestion.key, 'Yes')}
                  />
                  <label className="form-check-label">Yes</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={nestedQuestion.key}
                    value="No"
                    checked={formData[nestedQuestion.key] === 'No'}
                    onChange={() => handleChange(nestedQuestion.key, 'No')}
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
            );
          } else {
            return (
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={formData[nestedQuestion.key] || false}
                  onChange={(e) => handleChange(nestedQuestion.key, e.target.checked)}
                  id={nestedQuestion.key}
                />
                <label className="form-check-label" htmlFor={nestedQuestion.key}>
                  {nestedQuestion.question}
                </label>
              </div>
            );
          }
        default:
          return null;
      }
    };
  
    return (
      <>
        {renderField()}
        {formData[nestedQuestion.key] === 'Yes' &&
          nestedSubQuestions &&
          nestedSubQuestions.map((subQ: any) => (
            <div key={subQ.key}>
              <h5>{subQ.question}</h5>
              {renderNestedInput(subQ)}
            </div>
          ))}
      </>
    );
  };
  
  return (
    <div className="container-fluid py-3">
      <div className="card-header bg-primary d-flex justify-content-between align-items-center text-white">
        <div className="fw-bold fs-5">+ SHRMPro Copilot</div>
        <div className="dropdown">
          <button className="btn btn-link text-white dropdown-toggle text-decoration-none" data-bs-toggle="dropdown">
            {selectedLanguage}
          </button>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => handleLanguageChange('EN')}>English</button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => handleLanguageChange('HI')}>Hindi</button>
            </li>
          </ul>
        </div>
      </div>

      {!showForm ? (
        <div className="card shadow mt-4 d-flex justify-content-center align-items-center text-center p-4">
          <div className="circle-check mb-3">
            <span className="checkmark">✓</span>
          </div>
          <h1 className="mb-2">Welcome to SHRMPro Copilot</h1>
          <p className="text-muted mb-4">We’ll guide you through a few questions to get started.</p>
          <button className="btn btn-primary px-4 GetStarted" onClick={handleGetStartedClick}>
            Get Started
          </button>
        </div>
     ) : showConfirmation ? (
      <ConfirmationComponent formData={formData} />
    ) : showReview ? (
      <ReviewComponent
        schemaData={schemaData}
        formData={formData}
        onBack={() => setShowReview(false)}
        onConfirm={() => {
          setShowReview(false);
          setShowConfirmation(true);
        }}
      />    
      ) : (
        <div className="card shadow mt-4 p-4" style={{ maxWidth: 600, margin: '0 auto' }}>
          {schemaData[questionIndex] && (
            <>
              <div className="mb-2 text-muted small">
                Question {questionIndex + 1} of {schemaData.length}
              </div>
              <h5>{schemaData[questionIndex].question}</h5>
              <p className="text-muted">{schemaData[questionIndex].desc}</p>
              {renderInput()}
              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-secondary" onClick={handleBack}>Back</button>
                {questionIndex < schemaData.length - 1 ? (
                  <button className="btn btn-primary" onClick={handleNext}>Next</button>
                ) : (
                  <button className="btn btn-success" onClick={() => setShowReview(true)}>Review</button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;