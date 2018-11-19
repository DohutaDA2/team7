import moment from "moment";
import { getEndDate } from "./refineUI";

const checkValidityLogin = (name, value, rules) => {
  if (!name) {
    const error = { code: "NULL_VALUE", message: "Tên control bị rỗng." };
    throw error;
  }

  // if (!value) {
  //   const error = { code: "NULL_VALUE", message: "Giá trị kiểm tra bị rỗng." };
  //   throw error;
  // }

  let isValid = true;
  let errorMessage = [];
  if (!rules) {
    return true;
  }

  if (rules.required) {
    isValid = value.trim() !== "" && isValid;
    if (!isValid) errorMessage.push("Bắt buộc phải có " + name.toUpperCase());
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
    if (!isValid)
      errorMessage.push(
        name.toUpperCase() + " phải có ít nhất " + rules.minLength + " ký tự"
      );
  }

  if (rules.isEmail) {
    const pattern = /^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\.+))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/;
    isValid = pattern.test(value) && isValid;
    if (
      !isValid &&
      !errorMessage.includes("Nhập sai định dạng " + name.toUpperCase())
    )
      errorMessage.push("Nhập sai định dạng " + name.toUpperCase());
  }

  if (rules.isRequireLetterNumberSymbol) {
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    isValid = pattern.test(value) && isValid;
    if (
      !isValid &&
      !errorMessage.includes("Nhập sai định dạng " + name.toUpperCase())
    )
      errorMessage.push("Nhập sai định dạng " + name.toUpperCase());
  }
  return { isValid, errorMessage };
};

const checkValidityForm = (name, value, rules) => {
  if (!name) {
    const error = { code: "NULL_VALUE", message: "Tên control bị rỗng." };
    throw error;
  }

  // if (!value) {
  //   const error = { code: "NULL_VALUE", message: "Giá trị kiểm tra bị rỗng." };
  //   throw error;
  // }

  let isValid = true;
  let errorMessage = [];

  if (!rules) {
    return { isValid: true, errorMessage: [] };
  }

  if (name === "opendate") {
    if (!value.isValid())
      return {
        isValid: false,
        errorMessage: ["Ngày mở sổ không đúng định dạng"]
      };
    else if (
      value < moment().subtract(12, "month") ||
      value > moment().add(1, "week")
    )
      return {
        isValid: false,
        errorMessage: ["Ngày mở sổ nằm ngoài khoản cho phép"]
      };
    else return { isValid: true, errorMessage: [] };
  }

  if (rules.required) {
    isValid = value.trim() !== "" && isValid;
    if (!isValid) errorMessage.push("Bắt buộc phải có " + name.toUpperCase());
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
    if (!isValid)
      errorMessage.push(
        name.toUpperCase() + " phải có ít nhất " + rules.minLength + " ký tự"
      );
  }

  if (rules.isGreaterThan0) {
    isValid = value > 0 && isValid;
    if (!isValid)
      errorMessage.push(
        (name === "interestRate" ? "Lãi suất" : "Tiền gốc") + " phải lớn hơn 0."
      );
  }

  return { isValid, errorMessage };
};

const checkValidityDetailAction = (name, value, rules, root) => {
  if (!name) {
    const error = { code: "NULL_VALUE", message: "Tên control bị rỗng." };
    throw error;
  }
  // if (!value) {
  //   const error = { code: "NULL_VALUE", message: "Giá trị kiểm tra bị rỗng." };
  //   throw error;
  // }

  let isValid = true;
  let errorMessage = [];

  if (!rules) {
    return { isValid: true, errorMessage: [] };
  }

  if (rules.required) {
    isValid = value.trim() !== "" && isValid;
    if (!isValid) errorMessage.push("Bắt buộc phải có " + name.toUpperCase());
  }

  if (rules.isGreaterThan0) {
    isValid = value > 0 && isValid;
    if (!isValid) errorMessage.push("Số tiền rút phải lớn hơn 0.");
  }

  if (rules.isSmallerThanRoot) {
    isValid = value <= root && isValid;
    if (!isValid)
      errorMessage.push("Số tiền rút phải nhỏ hơn hoặc bằng số dư hiện có.");
  }

  return { isValid, errorMessage };
};

export { checkValidityLogin, checkValidityForm, checkValidityDetailAction };

/**
 * Kiểm tra điều kiện để Hiện nút gửi thêm
 * @param {String} paymentMethod Mã phương thức thanh toán lãi
 * @param {Boolean} end Đã tất toán hay chưa
 * @param {String} opendate Ngày mở sổ
 * @param {Number} term kỳ hạn
 */
const checkAllowDeposit = (paymentMethod, end, enddate, opendate, term) => {
  const today = moment().format("DD/MM/YYYY");
  let tempEnddate = moment(opendate, "DD/MM/YYYY")
    .add(term, "months")
    .format("DD/MM/YYYY");
  if (end || enddate) return false;
  while (moment(tempEnddate, "DD/MM/YYYY") <= moment(today, "DD/MM/YYYY")) {
    if (tempEnddate === today) return true;
    tempEnddate = moment(tempEnddate, "DD/MM/YYYY")
      .add(term, "months")
      .format("DD/MM/YYYY");
  }
  return false;
};

/**
 * Kiểm tra điều kiện để Hiện nút Rút
 * @param {String} paymentMethod Mã phương thức thanh toán lãi
 * @param {Boolean} end Đã tất toán hay chưa
 * @param {String} opendate Ngày mở sổ
 * @param {Number} term kỳ hạn
 */
const checkAllowWithdraw = (paymentMethod, end, opendate, term) => {
  const today = new moment();
  if (end) return false;
  if (term === 0 && today < new moment(opendate, "DD/MM/YYYY").add(15, "days"))
    return false;
  else return true;
};

export { checkAllowDeposit, checkAllowWithdraw };
