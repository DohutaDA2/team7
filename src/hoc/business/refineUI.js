import moment from "moment";

const formatNum = num => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const toShortDate = date => {
  return (
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
};

const today = new moment();

const getEndDate = (opendate, term) => {
  if (moment(opendate, "DD/MM/YYYY").add(term, "months") > today)
    return moment(opendate, "DD/MM/YYYY")
      .add(term, "months")
      .format("DD/MM/YYYY");
  else
    return getEndDate(
      moment(opendate, "DD/MM/YYYY")
        .add(term, "months")
        .format("DD/MM/YYYY"),
      term
    );
};

export { formatNum, toShortDate, getEndDate };
