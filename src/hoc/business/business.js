import firebaseCore from "../../firebaseConfig";
import { toShortDate } from "./refineUI";
import moment from "moment";

/**
 * Group an array by key's value
 * @param {Obj} arr Array to be group by key
 * @param {string} prop Key to be group to
 */
const groupBy = (arr, prop) => {
  return arr.reduce((a, obj) => {
    let key = obj[prop];
    if (!a[key]) {
      a[key] = [];
    }
    a[key].push(obj);
    return a;
  }, {});
};

const checkNetwork = () => {
  if (!navigator.onLine)
    return {
      code: "ERROR_NETWORK",
      message: "Lỗi kết nối, vui lòng thử lại sau."
    };
};

export { groupBy };

/////////////////////////////////////////////////////////////////
//                                                             //
//                                                             //
// ---------------------- OLD FUNCTIONS ---------------------- //
//                                                             //
//                                                             //
/////////////////////////////////////////////////////////////////

/**
 * Get all passbook by user_info
 * @param {obj} userInfo
 */
// const loadPassbooks = userInfo =>
//   new Promise((resolve, reject) => {
//     if (!navigator.onLine)
//       reject({
//         code: "NETWORK",
//         message: "Lỗi kết nối, vui lòng thử lại sau."
//       });
//     else {
//       let db = firebaseCore.firestore();
//       db.collection("passbooks")
//         .where("user", "==", userInfo.userId)
//         .get()
//         .then(result => {
//           let trueArr = [];
//           let falseArr = [];
//           result.docs.forEach(x => {
//             let data = {};
//             x.data()
//               .bank_id.get()
//               .then(bank => {
//                 x.data()
//                   .term_id.get()
//                   .then(term => {
//                     x.data()
//                       .interest_payment.get()
//                       .then(payment => {
//                         data.id = x.id;
//                         data.passbookName = x.data().name;
//                         data.bankId = bank.id;
//                         data.bankShortname = bank.data().shortname;
//                         data.bankFullname = bank.data().fullname;
//                         data.unlimitRate = bank.data().unlimitrate;
//                         data.end = x.data().end;
//                         data.enddate = toShortDate(x.data().enddate.toDate());
//                         data.paymentId = payment.id;
//                         data.paymentName = payment.data().name;
//                         data.pyamentDesc = payment.data().description;
//                         data.interestRate = parseFloat(x.data().interest_rate);
//                         data.opendate = toShortDate(x.data().opendate.toDate());
//                         data.termId = term.id;
//                         data.term = parseInt(term.data().term);
//                         data.termDes = term.data().description;
//                         data.balance = parseFloat(x.data().balance);
//                         if (data.end) trueArr.push(data);
//                         else falseArr.push(data);
//                       })
//                       .catch(err =>
//                         reject({
//                           code: "GET_PAYMENT",
//                           message: "Không thể lấy thông tin Phương thức trả lãi"
//                         })
//                       );
//                   })
//                   .catch(err =>
//                     reject({
//                       code: "GET_TERM",
//                       message: "Không thể lấy thông tin Kỳ hạn"
//                     })
//                   );
//               })
//               .catch(err =>
//                 reject({
//                   code: "GET_BANK",
//                   message: "Không thể lấy thông tin Ngân hàng"
//                 })
//               );
//           });
//           return {
//             true: trueArr.sort(
//               (a, b) => b.enddate.getTime() - a.enddate.getTime()
//             ),
//             false: falseArr
//           };
//         })
//         .then(obj => {
//           setTimeout(() => {
//             resolve(obj);
//           }, 2000);
//         })
//         .catch(err =>
//           reject({
//             code: "GET_INFO",
//             message: "Lỗi phát sinh trong quá trình lấy dữ liệu từ server"
//           })
//         );
//     }
//   });

/**
 * Get all banks
 */
const loadBanks = () =>
  new Promise((resolve, reject) => {
    if (!navigator.onLine)
      reject({
        code: "NETWORK",
        message: "Lỗi kết nối, vui lòng thử lại sau."
      });
    else {
      let db = firebaseCore.firestore();
      let banks = [];

      db.collection("banks")
        .get()
        .then(result => {
          result.forEach(x => {
            let bank = {
              id: x.id,
              fullName: x.data().fullname,
              shortName: x.data().shortname,
              unlimitrate: x.data().unlimitrate
            };
            banks.push(bank);
          });
        })
        .then(() => resolve(banks))
        .catch(err =>
          reject({
            code: "GET_BANKS",
            message: "Không thể đọc dữ liệu các Ngân hàng"
          })
        );
    }
  });

/**
 * Get all payment methods
 */
const loadInterestPayment = () =>
  !navigator.onLine
    ? { code: "NETWORK", errorMessage: "Lỗi kết nối, vui lòng thử lại sau." }
    : new Promise((resolve, reject) => {
        let db = firebaseCore.firestore();
        let payments = [];

        db.collection("interestpayment")
          .get()
          .then(result => {
            result.forEach(x => {
              let payment = {
                id: x.id,
                description: x.data().description,
                name: x.data().name
              };
              payments.push(payment);
            });
          })
          .then(() => resolve(payments))
          .catch(err =>
            reject({
              code: "GET_PAYMENTS",
              message: "Không thể đọc dữ liệu các Phương thức trả lãi"
            })
          );
      });

/**
 * Gets all term ends
 */
const loadTermEnd = () =>
  !navigator.onLine
    ? { code: "NETWORK", errorMessage: "Lỗi kết nối, vui lòng thử lại sau." }
    : new Promise((resolve, reject) => {
        let db = firebaseCore.firestore();
        let termEnd = [];

        db.collection("termend")
          .get()
          .then(result => {
            result.forEach(x => {
              let term = {
                id: x.id,
                description: x.data().description,
                name: x.data().name
              };
              termEnd.push(term);
            });
          })
          .then(() => resolve(termEnd))
          .catch(err =>
            reject({
              code: "GET_TERMENDS",
              message: "Không thể đọc dữ liệu các phương thức Tất toán"
            })
          );
      });

/**
 * Get all terms
 */
const loadTerms = () =>
  !navigator.onLine
    ? { code: "NETWORK", errorMessage: "Lỗi kết nối, vui lòng thử lại sau." }
    : new Promise((resolve, reject) => {
        let db = firebaseCore.firestore();
        let terms = [];

        db.collection("termend")
          .get()
          .then(result => {
            result.forEach(x => {
              let term = {
                id: x.id,
                description: x.data().description,
                term: x.data().term,
                savingRate: x.data().saving_rate
              };
              terms.push(term);
            });
          })
          .then(() => resolve(terms))
          .catch(err => reject(err));
      });

/**
 * Get all log by passbook Id
 * @param {string} passbookId
 */
const loadLog = passbookId =>
  !navigator.onLine
    ? { code: "NETWORK", errorMessage: "Lỗi kết nối, vui lòng thử lại sau." }
    : new Promise((resolve, reject) => {
        let db = firebaseCore.firestore();
        let logs = [];

        db.collection("passbooks")
          .doc(passbookId)
          .get()
          .then(result =>
            resolve.forEach(x => {
              let log = {
                id: x.id,
                amount: x.data().amount,
                time: x.data().time.toDate()
              };
              logs.push(log);
            })
          )
          .then(() => resolve(logs))
          .catch(err => reject(err));
      });

/////////////////////////////////////////////////////////////////
//                                                             //
//                                                             //
// ---------------------- NEW FUNCTIONS ---------------------- //
//                                                             //
//                                                             //
/////////////////////////////////////////////////////////////////

/**
 * Get passbooks
 * @param {object} userInfo User information
 */
const loadPassbooks = async userInfo => {
  try {
    let db = firebaseCore.firestore();
    let query = db
      .collection("passbooks")
      .where("user", "==", userInfo.userId)
      .get();
    return await query.then(async docs => {
      let promises = [];
      docs.forEach(doc => {
        promises.push(getOneDoc(doc));
      });
      return Promise.all(promises).then(res => {
        return groupBy(res, "end");
      });
    });
  } catch (error) {
    console.log(error);
    let err = { code: "ERROR_DATABASE", message: "Lỗi kết nối và lấy dữ liệu" };
    throw err;
  }
};

const loadPassbook = async (userInfo, passbookId) => {
  try {
    const db = firebaseCore.firestore();
    const query = db
      .collection("passbooks")
      .doc(passbookId)
      .get();
    return await query.then(async doc => {
      const passbook = await getOneDoc(doc);
      if (passbook.user !== userInfo.userId) {
        const error = { code: "ERROR_DATA", message: "Không khớp ID" };
        throw error;
      }
      return passbook;
    });
  } catch (error) {
    console.log(error);
    let err = { code: "ERROR_DATABASE", message: "Lỗi kết nối và lấy dữ liệu" };
    throw err;
  }
};

const getOneDoc = async doc => {
  let queryBank = await doc
    .data()
    .bank_id.get()
    .then(bank => {
      let bankData = { ...bank.data(), id: bank.id };
      return bankData;
    });
  let queryTerm = await doc
    .data()
    .term_id.get()
    .then(term => {
      let termData = { ...term.data(), id: term.id };
      return termData;
    });
  let queryPayment = await doc
    .data()
    .interest_payment.get()
    .then(payment => {
      let paymentData = { ...payment.data(), id: payment.id };
      return paymentData;
    });
  let queryLog = await getLogs(doc.id);
  let data = {};
  data.id = doc.id;
  data.passbookName = doc.data().name;
  data.bankId = queryBank.id;
  data.bankShortname = queryBank.shortname;
  data.bankFullname = queryBank.fullname;
  data.unlimitRate = queryBank.unlimitrate;
  data.end = doc.data().end;
  data.enddate = toShortDate(doc.data().enddate.toDate());
  data.paymentId = queryPayment.id;
  data.paymentName = queryPayment.name;
  data.pyamentDesc = queryPayment.description;
  data.interestRate = parseFloat(doc.data().interest_rate);
  data.opendate = toShortDate(doc.data().opendate.toDate());
  data.termId = queryTerm.id;
  data.term = parseInt(queryTerm.term);
  data.termDes = queryTerm.description;
  data.balance = parseFloat(doc.data().balance);
  data.realBalance = calculate(
    data.log,
    data.balance,
    data.interestRate,
    data.unlimitRate,
    data.opendate,
    data.term,
    data.end,
    data.paymentId
  );
  data.user = doc.data().user;
  data.log = queryLog;
  return data;
};

/**
 * Get all passbook by user_info
 * @param {obj} userInfo
 */
const getPassbooks = async userInfo => {
  if (!navigator.onLine) {
    const error = {
      code: "NETWORK",
      message: "Lỗi kết nối, vui lòng thử lại sau."
    };
    throw error;
  } else {
    try {
      let db = firebaseCore.firestore();
      let trueArr = [];
      let falseArr = [];
      let docs = await db
        .collection("passbooks")
        .where("user", "==", userInfo.userId)
        .get();

      for (let doc of docs.docs) {
        let getBank = await doc.data().bank_id.get();
        let getTerm = await doc.data().term_id.get();
        let getPayment = await doc.data().interest_payment.get();

        let data = {
          id: doc.id,
          passbookName: doc.data().name,
          bankId: getBank.id,
          bankShortname: getBank.data().shortname,
          bankFullname: getBank.data().fullname,
          end: doc.data().end,
          enddate: doc.data().enddate,
          paymentId: getPayment.id,
          paymentName: getPayment.data().name,
          pyamentDesc: getPayment.data().description,
          interestRate: parseFloat(doc.data().interest_rate),
          opendate: toShortDate(doc.data().opendate.toDate()),
          termId: getTerm.id,
          term: parseInt(getTerm.data().term),
          termDes: getTerm.data().description,
          balance: parseFloat(doc.data().balance)
        };

        if (data.end) trueArr.push(data);
        else falseArr.push(data);
      }
      console.log({ true: trueArr, false: falseArr });
      return { true: trueArr, false: falseArr };
    } catch (err) {
      const error = {
        code: "GET_INFO",
        message: "Không thể lấy dữ liệu các sổ tiết kiệm"
      };
      throw error;
    }
  }
};

/**
 * Get all banks
 */
const getBanks = async () => {
  if (!navigator.onLine) {
    const error = {
      code: "NETWORK",
      message: "Lỗi kết nối, vui lòng thử lại sau."
    };
    throw error;
  } else {
    let banks = [];
    try {
      let db = firebaseCore.firestore();
      let docs = await db.collection("banks").get();
      for (let doc of docs.docs) {
        let data = {
          id: doc.id,
          shortname: doc.data().shortname,
          fullname: doc.data().fullname,
          unlimitRate: doc.data().unlimitrate
        };
        banks.push(data);
      }
      // console.log(banks);
      return banks;
    } catch (err) {
      const error = {
        code: "GET_BANKS",
        message: "Không thể lấy dữ liệu các Ngân hàng"
      };
      throw error;
    }
  }
};

/**
 * Get all terms
 */
const getTerms = async () => {
  if (!navigator.onLine) {
    const error = {
      code: "NETWORK",
      message: "Lỗi kết nối, vui lòng thử lại sau."
    };
    throw error;
  } else {
    let terms = [];
    try {
      let db = firebaseCore.firestore();
      let docs = await db.collection("terms").get();
      for (let doc of docs.docs) {
        let data = {
          id: doc.id,
          description: doc.data().description,
          term: doc.data().term
        };
        terms.push(data);
      }
      // console.log(terms);
      return terms;
    } catch (err) {
      const error = {
        code: "GET_TERMS",
        message: "Không thể lấy dữ liệu các Kỳ hạn"
      };
      throw error;
    }
  }
};

const getPayments = async () => {
  if (!navigator.onLine) {
    const error = {
      code: "NETWORK",
      message: "Lỗi kết nối, vui lòng thử lại sau."
    };
    throw error;
  } else {
    let payments = [];
    try {
      let db = firebaseCore.firestore();
      let docs = await db.collection("interestpayment").get();
      for (let doc of docs.docs) {
        let data = {
          id: doc.id,
          description: doc.data().description,
          name: doc.data().name
        };
        payments.push(data);
      }
      // console.log(payments);
      return payments;
    } catch (err) {
      const error = {
        code: "GET_PAYMENTS",
        message: "Không thể lấy dữ liệu các Phương thức thanh toán Lãi"
      };
      throw error;
    }
  }
};

const getLogs = async passbookId => {
  if (!navigator.onLine) {
    const error = {
      code: "NETWORK",
      message: "Lỗi kết nối, vui lòng thử lại sau."
    };
    throw error;
  } else {
    let logs = [];
    let db = firebaseCore.firestore();
    let coll = await db.collection(`passbooks/${passbookId}/log`).get();
    if (coll.docs) {
      coll.docs.forEach(doc => {
        let data = {
          id: doc.id,
          amount: doc.data().amount,
          time: toShortDate(doc.data().time.toDate())
        };
        logs.push(data);
      });
    }
    return logs;
  }
};

/**
 * Get the new id for next passbook
 * @param {String} bankId Bank Id
 * @param {String} userId User Id
 */
const getId = async (bankId, userId) => {
  if (!navigator.onLine) {
    const error = {
      code: "NETWORK",
      message: "Lỗi kết nối, vui lòng thử lại sau."
    };
    throw error;
  } else {
    try {
      let db = firebaseCore.firestore();
      let bank = await db.collection("banks").doc(bankId);
      return await db
        .collection("passbooks")
        .where("bank_id", "==", bank)
        .where("user", "==", userId)
        .get()
        .then(x => {
          const id = formatNum(x.empty ? 1 : x.docs.length + 1);
          return id;
        });
    } catch (err) {
      const error = {
        code: "GET_ID",
        message: "Không thể tạo mới tên sổ tiết kiệm"
      };
      throw error;
    }
  }
};

/**
 * Refine id for passbook
 * @param {Num} num id number
 */
const formatNum = num => {
  let numS = "" + num;
  let pad = "000";
  return pad.substring(0, pad.length - numS.length) + numS;
};

export {
  loadPassbooks,
  loadPassbook,
  loadBanks,
  loadInterestPayment,
  loadTermEnd,
  loadTerms,
  loadLog,
  getPassbooks,
  getBanks,
  getTerms,
  getPayments,
  getLogs,
  getId
};

/////////////////////////////////////////////////////////////////
//                                                             //
//                                                             //
// --------------------------  CRUD  ------------------------- //
//                                                             //
//                                                             //
/////////////////////////////////////////////////////////////////

/**
 * Add new passbook
 * @param {Object} userInfo Userinfo
 * @param {Object} passbookData Passbook data
 */
const saveNewPassbook = async (userInfo, passbookData) => {
  if (
    !userInfo ||
    !userInfo.userId ||
    !passbookData ||
    !passbookData.balance ||
    !passbookData.bankId ||
    passbookData.end === undefined ||
    !passbookData.enddate ||
    !passbookData.interestRate ||
    !passbookData.interestPayment ||
    !passbookData.opendate ||
    !passbookData.termId
  ) {
    const error = {
      code: "ADD_PASSBOOK_DATA",
      message: "Lỗi dữ liệu rỗng, không thể thêm sổ tiết kiệm."
    };
    throw error;
  }

  let db = firebaseCore.firestore();
  let name =
    passbookData.name === ""
      ? await getId(passbookData.bankId, userInfo.userId)
      : passbookData.name;
  let passbook = {
    balance: passbookData.balance,
    bank_id: db.doc("banks/" + passbookData.bankId),
    end: passbookData.end,
    enddate: passbookData.enddate,
    interest_rate: passbookData.interestRate,
    interest_payment: db.doc("interestpayment/" + passbookData.interestPayment),
    name: name,
    opendate: passbookData.opendate,
    term_id: db.doc("terms/" + passbookData.termId),
    user: userInfo.userId
  };
  return await db
    .collection("passbooks")
    .add(passbook)
    .then(res => {
      return { code: "OK", message: `Thêm sổ tiết kiệm thành công: ${res.id}` };
    })
    .catch(err => {
      let error = {
        code: "ADD_PASSBOOK",
        message: "Lỗi không thể thêm mới sổ tiết kiệm"
      };
      throw error;
    });
};

/**
 * Update passbook by passbookId
 * @param {string} passbookId
 * @param {obj} updatedobj
 */
const updatePassbook = (passbookId, updatedObj) =>
  new Promise((resolve, reject) => {
    if (passbookId === undefined || updatedObj === undefined)
      reject({
        code: "UPDATE_PASSBOOK",
        message: "Lỗi dữ liệu rỗng, không thể ghi nhận thay đổi."
      });

    let db = firebaseCore.firestore();
    console.log(updatedObj);
    let passbook = {
      balance: updatedObj.balance,
      bank_id: db.doc("banks/" + updatedObj.bankId),
      end: updatedObj.end,
      enddate: updatedObj.enddate,
      interest_payment: db.doc("interestpayment/" + updatedObj.interestPayment),
      interest_rate: updatedObj.interestRate,
      name: updatedObj.name,
      opendate: updatedObj.opendate,
      term_id: db.doc("terms/" + updatedObj.termId)
    };
    console.log(passbook);
    db.collection("passbooks")
      .doc(passbookId)
      .update(passbook)
      .then(res => resolve({ code: "OK", message: "Cập nhật thành công" }))
      .catch(err =>
        reject({
          code: "UPDATE_PASSBOOK",
          message: "Lỗi không thể ghi nhận thay đổi sổ tiết kiệm"
        })
      );
  });

/**
 * Save log to passbook
 * @param {string} passbookId
 * @param {obj} log
 */
const saveLog = (passbookId, log) =>
  new Promise((resolve, reject) => {
    if (
      passbookId === undefined ||
      log === undefined ||
      log.amount === undefined ||
      log.time === undefined
    )
      reject({
        code: "SAVE_LOG",
        message: "Lỗi dữ liệu rỗng, không thể ghi nhận thay đổi."
      });
    let db = firebaseCore.firestore();
    db.collection("passbook")
      .doc(passbookId)
      .add(log)
      .then(res =>
        resolve({
          code: "OK",
          message: `Ghi nhận log thành công. id: ${res.id}`
        })
      )
      .catch(err =>
        reject({
          code: "SAVE_LOG",
          message: "Lỗi không thể ghi nhận LOG"
        })
      );
  });

export { updatePassbook, saveLog, saveNewPassbook };

/////////////////////////////////////////////////////////////////
//                                                             //
//                                                             //
// ----------------------   CALCULATOR  ---------------------- //
//                                                             //
//                                                             //
/////////////////////////////////////////////////////////////////

/**
 * Calculate duration as days between two dates
 * @param {Date} begin begin date
 * @param {Date} end end date
 */
const getDurationDays = (begin, end) => {
  let a = new moment(begin, "DD/MM/YYYY"),
    b = new moment(end, "DD/MM/YYYY");
  return Math.floor(moment.duration(b.diff(a)).asDays());
};

/**
 * Calculate duration as months between two dates
 * @param {Date} begin begin date
 * @param {Date} end end date
 */
const getDurationMonths = (begin, end) => {
  let a = new moment(begin, "DD/MM/YYYY"),
    b = new moment(end, "DD/MM/YYYY");
  return Math.floor(moment.duration(b.diff(a)).asMonths());
};

const calculateLimit = (root, rate, months) =>
  Math.floor((root * (rate / 100) * months) / 12);
const calculateUnLimit = (root, rate, days) =>
  Math.floor((root * (rate / 100) * days) / 360);
/**
 * Tinh toan so du so tiet kiem
 * @param {object} log Danh sach log ghi nhan thay doi
 * @param {any} root So tien goc
 * @param {any} rate Lai suat co ky hanj
 * @param {any} unlimitrate Lai suat khong ky han
 * @param {any} opendate Ngay mo so
 * @param {any} term So thang gui
 * @param {any} end Da tat toan hay chua
 * @param {any} enddate Ngay tat toan
 * @param {any} payment Phuong thuc thanh toan lai
 */
const calculate = (
  log,
  root,
  rate,
  unlimitrate,
  opendate,
  term,
  end,
  enddate,
  payment
) => {
  let balance = +root;
  let today = new moment().format("DD/MM/YYYY");
  if (term != 0) {
    if (end) {
      balance += calculateLimit(+root, rate, term);
      if (log) {
        log.forEach(x => {
          balance += calculateUnLimit(
            x.amount,
            unlimitrate,
            getDurationDays(opendate, x.time)
          );
        });
      }
    } else {
      switch (payment) {
        case "p0":
          balance += calculateLimit(+root, rate, term);
          if (log) {
            log.forEach(x => {
              balance += calculateUnLimit(
                x.amount,
                unlimitrate,
                getDurationDays(opendate, x.time)
              );
            });
          }
          break;
        case "p1":
          if (
            new moment() >= new moment().add(term, "months").subtract(1, "day")
          ) {
            balance += calculateLimit(+root, rate, term);
            if (log) {
              log.forEach(x => {
                balance += calculateUnLimit(
                  x.amount,
                  unlimitrate,
                  getDurationDays(opendate, x.time)
                );
              });
            }
          }
          break;
        case "p3":
          if (new moment() >= new moment().endOf("month").subtract(1, "day")) {
            balance += calculateLimit(
              root,
              rate,
              getDurationMonths(opendate, today)
            );
            if (log) {
              log.forEach(x => {
                let time = new moment(x.time);
                if (time <= new moment().subtract(1, "month").endOf("month")) {
                  balance += calculateUnLimit(
                    x.amount,
                    unlimitrate,
                    getDurationDays(opendate, x.time)
                  );
                }
              });
            }
          }
          break;
        default:
          break;
      }
    }
  } else {
    if (!end) {
      balance += calculateUnLimit(
        root,
        unlimitrate,
        getDurationDays(opendate, today)
      );
      if (log) {
        log.forEach(x => {
          balance += calculateUnLimit(
            x.amount,
            unlimitrate,
            getDurationDays(opendate, x.time)
          );
        });
      }
    } else {
      balance += calculateUnLimit(
        root,
        unlimitrate,
        getDurationDays(opendate, enddate)
      );
      if (log) {
        log.forEach(x => {
          balance += calculateUnLimit(
            x.amount,
            unlimitrate,
            getDurationDays(opendate, x.time)
          );
        });
      }
    }
  }
  return Math.floor(balance);
};

export {
  calculate,
  calculateLimit,
  calculateUnLimit,
  getDurationDays,
  getDurationMonths
};

/**
 * Validate data type of passbook's properties
 * @param {object} passbookData Passbook data
 */
const validatePassbookDataType = passbookData => {
  return (
    typeof passbookData.balance === "number" &&
    typeof passbookData.bankId === "string" &&
    typeof passbookData.end === "boolean" &&
    typeof passbookData.enddate === "object" &&
    typeof passbookData.interestRate === "number" &&
    typeof passbookData.interestPayment === "string" &&
    typeof passbookData.opendate === "object" &&
    typeof passbookData.termId === "string"
  );
};

/**
 * Validate data value of passbook's properties
 * @param {object} passbookData Passbook data
 */
const validatePassbookDataValue = passbookData => {
  return (
    passbookData.balance > 0 &&
    passbookData.bankId !== "" &&
    passbookData.interestRate > 0 &&
    passbookData.interestPayment !== "" &&
    passbookData.termId !== ""
  );
};
