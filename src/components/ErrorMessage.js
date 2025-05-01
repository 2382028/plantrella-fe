import React from 'react';
import './ErrorMessage.css';

function ErrorMessage({ message }) {
    return (
        <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{message}</p>
        </div>
    );
}

export default ErrorMessage;