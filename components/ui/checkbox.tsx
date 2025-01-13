import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox: React.FC<CheckboxProps> = (props) => {
  return (
    <input type="checkbox" {...props} className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" />
  );
};

export default Checkbox; 