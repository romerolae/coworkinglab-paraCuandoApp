class CustomError extends Error {
  constructor(message, statusCode, name, object = null) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.status = statusCode;

    if (object && object.details) {
      this.details = object.details
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

/* Pagination Utils */
const getPagination = (page, size, defaultSize = '10') => {
  let pageStr = page;
  let sizeStr = size;

  if (pageStr && isNaN(pageStr)) {
    throw new Error(`page is NaN: ${page}`);
  }

  if (sizeStr && isNaN(sizeStr)) {
    throw new Error(`size is NaN: ${size}`);
  }

  let offset;
  let limit = size ? +size : defaultSize;
  if (page == '0' || page == '1') {
    offset = 0;
  } else {
    offset = page ? --page * limit : '0';
  }

  if (size) {
    limit = limit.toString();
  }

  if (page) {
    offset = offset.toString();
  }

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count, rows: results } = data;
  let currentPage = page ? +page : 0;
  if (currentPage <= 0) {
    currentPage = 1;
  }
  const totalPages = Math.ceil(count / limit);
  if (totalPages <= 0) {
    currentPage = 0;
  }
  return { count, totalPages, currentPage, results };
};


module.exports = {
  CustomError,
  getPagination,
  getPagingData
};