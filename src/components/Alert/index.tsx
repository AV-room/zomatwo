import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCircle } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

interface AlertProps {
  type: 'error' | 'success';
  message: string;
  handleDismissal: any;
}

const Alert: React.FC<AlertProps> = ({ type, message, handleDismissal }) => {
  return (
    <div className={'alert-container' + (type === 'error' ? ' error' : '')}>
      {message}
      <button className="close-btn" onClick={handleDismissal}>
        {type === 'error' && (
          <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon={faCircle} size="lg" color="#f44336" />
            <FontAwesomeIcon icon={faTimes} size="lg" color="white" />
          </span>
        )}
      </button>
    </div>
  );
};

export default Alert;
