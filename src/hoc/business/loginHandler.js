import { firebase, AUTH } from "../../firebaseConfig";
import axios from "axios";
const EMAIL_EXISTS = "Email đã được đăng ký trước đó";
const INVALID_PASSWORD = "Sai mật khẩu. Vui lòng nhập lại";

const callServer = (type, requestData) =>
  new Promise((resolve, reject) => {
    const url = type === "si" ? AUTH.signInURL : AUTH.signUpURL;
    axios
      .post(url, requestData)
      .then(response => {
        const data = {
          userId: response.data.localId,
          idToken: response.data.idToken
        };
        resolve(data);
      })
      .catch(error => {
        // console.log(error.response.data.error.message)
        let message = error.response.data.error.message;
        if (error.response.data.error.message === "EMAIL_EXISTS")
          message = EMAIL_EXISTS;
        if (error.response.data.error.message === "INVALID_PASSWORD")
          message = INVALID_PASSWORD;

        reject({
          code: error.response.data.error.code,
          message: message
        });
      });
  });

export { callServer };

const EXISTED_EMAIL = "Email đã tồn tại trước đó";
const INVALID_EMAIL = "Email không hợp lệ";
const OPERATION_NOT_ALLOWED = "Không được phép";
const WEAK_PWD = "Mật khẩu yếu";
const USER_DISABLED = "Tài khoản đã bị tắt";
const WRONG_PWD = "Sai mật khẩu";
const USER_NOT_FOUND = "Không tìm thấy tài khoản";
const AUTH_ERROR = "Lỗi trong quá trình đăng ký/đăng nhập";

const returnError = errorCode => {
  switch (errorCode) {
    case "auth/invalid-email":
      return { code: "auth/invalid-email", message: INVALID_EMAIL };
    case "auth/user-disabled":
      return { code: "auth/user-disabled", message: USER_DISABLED };
    case "auth/user-not-found":
      return { code: "user-not-found", message: USER_NOT_FOUND };
    case "auth/wrong-password":
      return { code: "auth/wrong-password", message: WRONG_PWD };
    case "auth/operation-not-allowed":
      return {
        code: "auth/operation-not-allowed",
        message: OPERATION_NOT_ALLOWED
      };
    case "auth/email-already-in-use":
      return { code: "auth/email-already-in-use", message: EXISTED_EMAIL };
    case "auth/weak-password":
      return { code: "auth/weak-password", message: WEAK_PWD };
    default:
      return { code: errorCode, message: AUTH_ERROR };
  }
};

const getAuth = (type, requestData) =>
  new Promise((resolve, reject) => {
    if (type === "si") {
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
          firebase
            .auth()
            .signInWithEmailAndPassword(requestData.email, requestData.password)
            .then(response => {
              const data = {
                userId: response.user.uid,
                idToken: response.user.qa,
                refreshToken: response.user.refreshToken
              };
              resolve(data);
            })
            .catch(error => {
              console.log(error);
              reject(returnError(error.code));
            });
        });
    }
    if (type === "su") {
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
          firebase
            .auth()
            .createUserWithEmailAndPassword(
              requestData.email,
              requestData.password
            )
            .then(response => {
              const data = {
                userId: response.user.uid,
                idToken: response.user.qa,
                refreshToken: response.user.refreshToken
              };
              resolve(data);
            })
            .catch(error => {
              console.log(error);
              reject(returnError(error.code));
            });
        });
    }
  });

export { getAuth };
