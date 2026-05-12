import React from 'react';
import { check1, error2 } from '../assets';

const Alerts = ({ i, alertOn, type, message, handleAlertCancel }) => {
  if (!alertOn) return null;

  const isSuccess = type === 'success';

  const config = {
    bg: isSuccess ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700',
    icon: isSuccess ? check1 : error2,
    closeColor: isSuccess ? 'text-green-500' : 'text-red-500',
  };

  return (
    <div className='my-1'>
      <div className={`w-full flex flex-row items-center justify-center ${config.bg} border p-3 rounded`}>
        <img src={config.icon} className='w-4 h-4 mr-3' alt="" />
        <span className="font-medium">{message}</span>
        <span className="ml-3 cursor-pointer" onClick={() => handleAlertCancel(i)}>
          <svg className={`fill-current h-6 w-6 ${config.closeColor}`} role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default Alerts;