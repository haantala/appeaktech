/* eslint-disable object-shorthand */

const STATUS_SUCCESS = 1;
const STATUS_ERROR = 0;

const success = (resp, data, description = "", status = STATUS_SUCCESS) => {
  resp.status(200).json({
    status,
    description: description || "",
    data: data,
  });
};

const error = (resp, description, status = STATUS_ERROR) => {
  const data = [];
  resp.status(200).json({
    // since this is a know exception (business logic) we will be sending http status as 200(success), but error details should be mentioned in the body of the response. status code 500 should be used only for unhandled exceptions
    status,
    description: description || "",
    data,
  });
};

// no clue about error
const unknownServerError = (resp, description, status = STATUS_ERROR) => {
  resp.status(500).json({
    status,
    description: description || "",
    data: null,
  });
};

const authError = (resp, description) => {
  resp.status(401).json({
    status: STATUS_ERROR,
    description: description || "",
    data: null,
  });
};

const badRequest = (resp, description) => {
  resp.status(400).json({
    status: STATUS_ERROR,
    description: description || "",
    data: null,
  });
};

const invalidToken = (resp, description = "", status = STATUS_SUCCESS) => {
  resp.status(403).json({
    status,
    description: description || "",
  });
};

const serviceToController = (status, data, description) => {
  return {
    status,
    data,
    description: description || "",
  };
};

const InternalServerError = (res, description, status = STATUS_ERROR) => {
  res.status(500).json({ status, description });
};
module.exports = {
  success,
  error,
  unknownServerError,
  authError,
  badRequest,
  STATUS_SUCCESS,
  STATUS_ERROR,
  invalidToken,
  serviceToController,
  InternalServerError,
};
