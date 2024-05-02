import React from "react";

const ErrorMessage = (props) => {
  return <div className="text-colour-red font-medium">{props.message}</div>;
};

export default ErrorMessage;
