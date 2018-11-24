import { firebase } from "../../firebaseConfig";
import { toShortDate } from "./refineUI";
import moment from "moment";

/**
 * TODO: tập hợp các action tính từ lúc mở sổ cho đến thời điểm hiện tại: LOGS
 * rút tiền,
 * gửi thêm,
 * tái tục gốc + lãi,
 * tái tục gốc
 * tất toán và đóng,
 *
 * global:
 * gốc,
 * lãi,
 * bank_id
 */

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
//       let db = firebase.firestore();
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
//                        // data.unlimitRate = bank.data().unlimitrate;
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
      let db = firebase.firestore();
      let banks = [];

      db.collection("banks")
        .get()
        .then(result => {
          result.forEach(x => {
            let bank = {
              id: x.id,
              fullName: x.data().fullname,
              shortName: x.data().shortname
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
        let db = firebase.firestore();
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
    ? {
        code: "ERROR_CONNECTION",
        errorMessage: "Lỗi kết nối, vui lòng thử lại sau."
      }
    : new Promise((resolve, reject) => {
        let db = firebase.firestore();
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
    ? {
        code: "ERROR_CONNECTION",
        errorMessage: "Lỗi kết nối, vui lòng thử lại sau."
      }
    : new Promise((resolve, reject) => {
        let db = firebase.firestore();
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
    ? {
        code: "ERROR_CONNECTION",
        errorMessage: "Lỗi kết nối, vui lòng thử lại sau."
      }
    : new Promise((resolve, reject) => {
        let db = firebase.firestore();
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
    const user = firebase.auth().currentUser;
    let db = firebase.firestore();
    let query = db
      .collection("passbooks")
      .where("user", "==", user.uid)
      .get()
      .catch(error => {
        throw error;
      });
    return await query
      .then(async docs => {
        let promises = [];
        docs.forEach(doc => {
          promises.push(getOneDoc(doc));
        });
        return Promise.all(promises)
          .then(res => {
            return groupBy(res, "end");
          })
          .catch(error => {
            throw error;
          });
      })
      .catch(error => {
        throw error;
      });
  } catch (error) {
    let err = {
      code: "ERROR_CONNECTION",
      message: "Lỗi kết nối và lấy dữ liệu"
    };
    console.log(error);
    throw err;
  }
};

const loadPassbook = async (userInfo, passbookId) => {
  try {
    const db = firebase.firestore();
    const query = db
      .collection("passbooks")
      .doc(passbookId)
      .get()
      .catch(error => {
        throw error;
      });
    return await query
      .then(async doc => {
        const passbook = await getOneDoc(doc);
        if (passbook.user !== userInfo.userId) {
          const error = { code: "ERROR_DATA", message: "Không khớp ID" };
          throw error;
        }
        return passbook;
      })
      .catch(error => {
        throw error;
      });
  } catch (error) {
    console.log(error);
    let err = {
      code: "ERROR_CONNECTION",
      message: "Lỗi kết nối và lấy dữ liệu"
    };
    throw err;
  }
};

const getOneDoc = async doc => {
  try {
    let queryBank = await doc
      .data()
      .bank_id.get()
      .then(bank => {
        let bankData = { ...bank.data(), id: bank.id };
        return bankData;
      })
      .catch(error => {
        throw error;
      });
    let queryTerm = await doc
      .data()
      .term_id.get()
      .then(term => {
        let termData = { ...term.data(), id: term.id };
        return termData;
      })
      .catch(error => {
        throw error;
      });
    let queryPayment = await doc
      .data()
      .interest_payment.get()
      .then(payment => {
        let paymentData = { ...payment.data(), id: payment.id };
        return paymentData;
      })
      .catch(error => {
        throw error;
      });
    let queryEndCondition = await doc
      .data()
      .endcondition_id.get()
      .then(condition => {
        let endcondition = { ...condition.data(), id: condition.id };
        return endcondition;
      })
      .catch(error => {
        throw error;
      });
    let queryLog = await getLogs(doc.id).catch(error => {
      throw error;
    });
    let data = {};
    data.id = doc.id;
    data.passbookName = doc.data().name;
    data.bankId = queryBank.id;
    data.bankShortname = queryBank.shortname;
    data.bankFullname = queryBank.fullname;
    data.end = doc.data().end;
    data.enddate = doc.data().enddate
      ? moment(doc.data().enddate.toDate()).format("DD/MM/YYYY")
      : "";
    data.endConditionId = queryEndCondition.id;
    data.endConditionName = queryEndCondition.name;
    data.paymentId = queryPayment.id;
    data.paymentName = queryPayment.name;
    data.pyamentDesc = queryPayment.description;
    data.interestRate = parseFloat(doc.data().interest_rate);
    data.unlimitInterestRate = parseFloat(doc.data().unlimit_interest_rate);
    data.opendate = moment(doc.data().opendate.toDate()).format("DD/MM/YYYY");
    data.termId = queryTerm.id;
    data.term = parseInt(queryTerm.term);
    data.termDes = queryTerm.description;
    data.balance = parseFloat(doc.data().balance);
    data.user = doc.data().user;
    data.log = queryLog;
    // console.log(data.log);
    data.realBalance = calculate(
      data.log,
      data.balance,
      data.interestRate,
      data.unlimitInterestRate,
      data.opendate,
      data.term,
      data.end,
      data.enddate,
      data.paymentId,
      data.endConditionId
    );
    return data;
  } catch (error) {
    throw error;
  }
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
      let db = firebase.firestore();
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
        let getEndCondition = await doc.data().endcondition_id.get();

        let data = {
          id: doc.id,
          passbookName: doc.data().name,
          bankId: getBank.id,
          bankShortname: getBank.data().shortname,
          bankFullname: getBank.data().fullname,
          end: doc.data().end,
          enddate: toShortDate(doc.data().enddate.toDate()),
          endConditionId: getEndCondition.id,
          endConditionName: getEndCondition.data().name,
          paymentId: getPayment.id,
          paymentName: getPayment.data().name,
          pyamentDesc: getPayment.data().description,
          interestRate: parseFloat(doc.data().interest_rate),
          unlimitInterestRate: parseFloat(doc.data().unlimit_interest_rate),
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
      let db = firebase.firestore();
      let docs = await db.collection("banks").get();
      for (let doc of docs.docs) {
        let data = {
          id: doc.id,
          shortname: doc.data().shortname,
          fullname: doc.data().fullname
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
      let db = firebase.firestore();
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
      let db = firebase.firestore();
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

const getEndCondition = async () => {
  if (!navigator.onLine) {
    const error = {
      code: "NETWORK",
      message: "Lỗi kết nối, vui lòng thử lại sau."
    };
    throw error;
  } else {
    let endcondition = [];
    try {
      let db = firebase.firestore();
      let docs = await db.collection("endcondition").get();
      for (let doc of docs.docs) {
        let data = {
          id: doc.id,
          name: doc.data().name
        };
        endcondition.push(data);
      }
      // console.log(endcondition);
      return endcondition;
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
    let db = firebase.firestore();
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
      let db = firebase.firestore();
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
  getEndCondition,
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
    !passbookData.endConditionId ||
    !passbookData.interestRate ||
    !passbookData.interestPayment ||
    !passbookData.unlimitInterestRate ||
    !passbookData.opendate ||
    !passbookData.termId
  ) {
    const error = {
      code: "ADD_PASSBOOK_DATA",
      message: "Lỗi dữ liệu rỗng, không thể thêm sổ tiết kiệm."
    };
    throw error;
  }

  let db = firebase.firestore();
  let name =
    passbookData.name === ""
      ? await getId(passbookData.bankId, userInfo.userId)
      : passbookData.name;
  let passbook = {
    balance: passbookData.balance,
    bank_id: db.doc("banks/" + passbookData.bankId),
    endcondition_id: db.doc("endcondition/" + passbookData.endConditionId),
    end: false,
    enddate: "",
    interest_rate: passbookData.interestRate,
    interest_payment: db.doc("interestpayment/" + passbookData.interestPayment),
    unlimit_interest_rate: passbookData.unlimitInterestRate,
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

    let db = firebase.firestore();
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
const saveLog = async (passbookId, log) => {
  if (
    passbookId === undefined ||
    log === undefined ||
    log.amount === undefined ||
    log.time === undefined
  )
    return {
      code: "SAVE_LOG",
      message: "Lỗi dữ liệu rỗng, không thể ghi nhận thay đổi."
    };
  let db = firebase.firestore();
  return await db
    .collection("passbooks")
    .doc(passbookId)
    .collection("log")
    .add(log)
    .then(res => {
      console.log(res);
      return {
        code: "OK",
        message: `Ghi nhận log thành công. id: ${res.id}`
      };
    })
    .catch(err => {
      console.log(err);
      return {
        code: "SAVE_LOG",
        message: "Lỗi không thể ghi nhận LOG"
      };
    });
};

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

/**
 * Calculate the number of term count from the begining
 * @param {Date} begin begin date
 * @param {Date} end end date
 * @param {Number} term Term duration (months)
 */
const getNumberOfTerms = (begin, end, term) => {
  let a = new moment(begin, "DD/MM/YYYY");
  let b = new moment(end, "DD/MM/YYYY").add(1, "day");
  let numTerms = Math.floor(moment.duration(b.diff(a)).asMonths() / term);
  let oddDays =
    moment.duration(b.diff(a.add(numTerms * term, "months"))).asDays() - 1;
  return { terms: numTerms, oddDays: oddDays };
};
/**
 * Tính lãi có kỳ hạn
 * @param {Number} root root balance
 * @param {Number} rate Rate
 * @param {Number} months Months
 */
const calculateLimit = (root, rate, months) =>
  Math.floor((root * (rate / 100) * months) / 12);

/**
 * Tính lãi không kỳ hạn
 * @param {Number} root root balance
 * @param {Number} rate Rate
 * @param {Number} days Days
 */
const calculateUnLimit = (root, rate, days) =>
  Math.floor((root * (rate / 100) * days) / 360);

/**
 * Tính tiền lãi trong 1 kỳ hạn gửi
 * @param {Object} log Lịch sử giao dịch
 * @param {Number} root root balance
 * @param {Number} rate Rate
 * @param {Number} unlimitrate Unlimit term Rate
 * @param {Number} term Months
 */
const calculateOneTerm = (log, root, rate, unlimitrate, opendate, term) => {
  let profit = 0;
  let balance = +root;
  if (log) {
    log.forEach(x => {
      let xTime = moment(x.time, "DD/MM/YYYY");
      if (
        xTime < moment(opendate, "DD/MM/YYYY") ||
        xTime > moment(opendate, "DD/MM/YYYY").add(term, "months")
      )
        return;
      profit += calculateUnLimit(
        +x.amount,
        +unlimitrate,
        getDurationDays(opendate, x.time)
      );
      balance -= x.amount;
    });
  }
  profit += calculateLimit(+balance, +rate, +term);
  return { profit: profit, balance: balance };
};

/**
 * Tính lãi suất và số dư không kỳ hạn
 * @param {Object} log Lịch sử giao dịch
 * @param {Number} root Sô tiền gốc
 * @param {Number} rate Lãi suất có kỳ hạn
 * @param {Number} unlimitrate Lãi không kỳ hạn
 * @param {Date} opendate Ngày mở sổ
 * @param {Number} term Kỳ hạn (tháng)
 * @param {Boolean} end Tất toán hay chưa
 * @param {Date} enddate Ngày tất toán
 * @param {String} payment Phương thức thanh toán lãi
 * @param {String} endcondition Mã điều kiện đến hạn
 */
const caclculateProfitUnlimit = (
  log,
  root,
  rate,
  unlimitrate,
  opendate,
  term,
  end,
  enddate,
  payment,
  endcondition
) => {
  let profit = 0;
  let balance = +root;
  if (log) {
    log.forEach(x => {
      profit += calculateUnLimit(
        +x.amount,
        +unlimitrate,
        getDurationDays(opendate, x.time)
      );
      balance -= x.amount;
    });
  }
  profit = calculateUnLimit(
    +balance,
    +unlimitrate,
    getDurationDays(
      opendate,
      enddate ? enddate : new moment().format("DD/MM/YYYY")
    )
  );
  return { profit: profit, balance: balance };
};

/**
 * Tính lãi suất và số dư có kỳ hạn
 * @param {Object} log Lịch sử giao dịch
 * @param {Number} root Sô tiền gốc
 * @param {Number} rate Lãi suất có kỳ hạn
 * @param {Number} unlimitrate Lãi không kỳ hạn
 * @param {Date} opendate Ngày mở sổ
 * @param {Number} term Kỳ hạn (tháng)
 * @param {Boolean} end Tất toán hay chưa
 * @param {Date} enddate Ngày tất toán
 * @param {String} payment Phương thức thanh toán lãi
 * @param {String} endcondition Mã điều kiện đến hạn
 */
const calculateProfitLimit = (
  log,
  root,
  rate,
  unlimitrate,
  opendate,
  term,
  end,
  enddate,
  payment,
  endcondition
) => {
  let profit = 0;
  let balance = +root;
  let duration = getNumberOfTerms(
    opendate,
    enddate ? enddate : new moment().format("DD/MM/YYYY"),
    term
  );
  let opendateTemp = opendate;
  // đã tất toán
  if (end || enddate) {
    if (duration.terms >= 1) {
      for (let i = 0; i < duration.terms; i++) {
        let temp = calculateOneTerm(
          log,
          +balance,
          +rate,
          +unlimitrate,
          opendateTemp,
          +term
        );
        if (endcondition === "e0") {
          balance = temp.balance + temp.profit;
        }
        balance = temp.balance;
        profit += temp.profit;
        opendateTemp = moment(opendateTemp, "DD/MM/YYYY")
          .add(term, "months")
          .add(1, "day")
          .format("DD/MM/YYYY");
      }
    }
    if (duration.oddDays > 0) {
      let temp = caclculateProfitUnlimit(
        log,
        +balance,
        +rate,
        +unlimitrate,
        opendateTemp,
        +term,
        end,
        enddate,
        payment,
        endcondition
      );
      profit += temp.profit;
      balance = temp.balance;
    }
    return { profit: profit, balance: balance };
  }
  // chưa tất toán
  else {
    if (
      duration.terms >= 1 ||
      (payment === "p0" && duration.terms === 0 && duration.oddDays > 0)
    ) {
      let termTemp = duration.terms;
      if (duration.terms === 0 && duration.oddDays > 0 && payment === "p0")
        termTemp += 1;
      if (duration.terms > 0 && duration.oddDays > 0 && payment === "p0")
        termTemp += 1;
      for (let i = 0; i < termTemp; i++) {
        let temp = calculateOneTerm(
          log,
          +balance,
          +rate,
          +unlimitrate,
          opendateTemp,
          +term
        );
        profit += temp.profit;
        balance = temp.balance;
        if (endcondition === "e0" && termTemp !== 1 && i + 1 < termTemp) {
          balance = temp.balance + temp.profit;
        }
        if (endcondition === "e1" && termTemp !== 1 && i + 1 < termTemp) {
          balance = temp.balance;
        }
        opendateTemp = moment(opendateTemp, "DD/MM/YYYY")
          .add(+term, "months")
          .add(1, "day")
          .format("DD/MM/YYYY");
      }
      // if (
      //   ((duration.terms < 1 && duration.oddDays > 0) ||
      //     (duration.terms >= 1 && duration.oddDays > 0)) &&
      //   payment !== "p1"
      // ) {
      //   let temp = caclculateProfitUnlimit(
      //     log,
      //     +balance,
      //     +rate,
      //     +unlimitrate,
      //     opendate,
      //     +term,
      //     end,
      //     enddate,
      //     payment,
      //     endcondition
      //   );
      //   profit += temp.profit;
      //   balance = temp.balance;
      // }
      return { profit: profit, balance: balance };
    }
    // else {
    //   let temp = calculateOneTerm(
    //     log,
    //     +balance,
    //     +rate,
    //     +unlimitrate,
    //     opendate,
    //     +term
    //   );
    //   balance = temp.balance;
    //   profit += temp.profit;
    // }
  }
  return { profit: profit, balance: balance };
};

/**
 * Tinh lai suat và so du so tiet kiem
 * @param {Object} log Lịch sử giao dịch
 * @param {Number} root Sô tiền gốc
 * @param {Number} rate Lãi suất có kỳ hạn
 * @param {Number} unlimitrate Lãi không kỳ hạn
 * @param {Date} opendate Ngày mở sổ
 * @param {Number} term Kỳ hạn (tháng)
 * @param {Boolean} end Tất toán hay chưa
 * @param {Date} enddate Ngày tất toán
 * @param {String} payment Phương thức thanh toán lãi
 * @param {String} endcondition Mã điều kiện đến hạn
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
  payment,
  endcondition
) => {
  let temp = 0;
  let duration = null;

  switch (+term) {
    case 0:
      temp = caclculateProfitUnlimit(
        log,
        +root,
        +rate,
        +unlimitrate,
        opendate,
        +term,
        end,
        enddate,
        payment,
        endcondition
      );
      return temp.balance + temp.profit;
    default:
      temp = calculateProfitLimit(
        log,
        +root,
        +rate,
        +unlimitrate,
        opendate,
        +term,
        end,
        enddate,
        payment,
        endcondition
      );
      switch (payment) {
        case "p0":
          return temp.balance + temp.profit;
        case "p1":
          duration = getNumberOfTerms(
            opendate,
            enddate ? enddate : new moment().format("DD/MM/YYYY"),
            term
          );
          if (
            new moment() ===
            moment(opendate, "DD/MM/YYYY").add(term * duration.terms, "months")
          ) {
            return temp.balance + temp.profit;
          }
          if (end || enddate) {
            return temp.balance + temp.profit;
          }
          return temp.balance;
        default:
          if (new moment() === moment().endOf("month")) {
            return temp.balance + temp.profit;
          }
          if (end || enddate) {
            return temp.balance + temp.profit;
          }
          return temp.balance;
      }
  }
};

export {
  calculate,
  calculateProfitLimit,
  caclculateProfitUnlimit,
  calculateOneTerm,
  getNumberOfTerms
};

// /**
//  * Tinh lai suat và so du so tiet kiem
//  * @param {Object} log Lịch sử giao dịch
//  * @param {Number} root Sô tiền gốc
//  * @param {Number} rate Lãi suất có kỳ hạn
//  * @param {Number} unlimitrate Lãi không kỳ hạn
//  * @param {Date} opendate Ngày mở sổ
//  * @param {Number} term Kỳ hạn (tháng)
//  * @param {Boolean} end Tất toán hay chưa
//  * @param {Date} enddate Ngày tất toán
//  * @param {String} payment Phương thức thanh toán lãi
//  * @param {String} endcondition Mã điều kiện đến hạn
//  */
// const calculate = (
//   log,
//   root,
//   rate,
//   unlimitrate,
//   opendate,
//   term,
//   end,
//   enddate,
//   payment,
//   endcondition
// ) => {
//   let balance = +root;
//   let today = new moment().format("DD/MM/YYYY");
//   // Có kỳ hạn
//   if (term != 0) {
//     // Đã tất toán
//     if (end) {
//       balance += calculateLimit(+root, +rate, +term);
//       if (log) {
//         log.forEach(x => {
//           balance += calculateUnLimit(
//             +x.amount,
//             +unlimitrate,
//             getDurationDays(opendate, x.time)
//           );
//         });
//       }
//     }
//     // Chưa tất toán
//     else {
//       switch (payment) {
//         // trả lãi đầu kỳ
//         case "p0":
//           balance += calculateLimit(+root, +rate, +term);
//           if (log) {
//             log.forEach(x => {
//               balance += calculateUnLimit(
//                 +x.amount,
//                 +unlimitrate,
//                 getDurationDays(opendate, x.time)
//               );
//             });
//           }
//           break;
//         // trả lãi cuối kỳ
//         case "p1":
//           if (
//             new moment() >= new moment().add(term, "months").subtract(1, "day")
//           ) {
//             balance += calculateLimit(+root, +rate, +term);
//             if (log) {
//               log.forEach(x => {
//                 balance += calculateUnLimit(
//                   +x.amount,
//                   +unlimitrate,
//                   getDurationDays(opendate, x.time)
//                 );
//               });
//             }
//           }
//           break;
//         // trả lãi định kỳ
//         case "p3":
//           if (new moment() >= new moment().endOf("month").subtract(1, "day")) {
//             balance += calculateLimit(
//               +root,
//               +rate,
//               getDurationMonths(opendate, today)
//             );
//             if (log) {
//               log.forEach(x => {
//                 let time = new moment(x.time);
//                 if (time <= new moment().subtract(1, "month").endOf("month")) {
//                   balance += calculateUnLimit(
//                     +x.amount,
//                     +unlimitrate,
//                     getDurationDays(opendate, x.time)
//                   );
//                 }
//               });
//             }
//           }
//           break;
//         default:
//           break;
//       }
//     }
//   }
//   // Không kỳ hạn
//   else {
//     // chưa tất toán
//     if (!end) {
//       balance += calculateUnLimit(
//         +root,
//         +unlimitrate,
//         getDurationDays(opendate, today)
//       );
//       if (log) {
//         log.forEach(x => {
//           balance += calculateUnLimit(
//             +x.amount,
//             +unlimitrate,
//             getDurationDays(opendate, x.time)
//           );
//         });
//       }
//     }
//     // đã tất toán
//     else {
//       balance += calculateUnLimit(
//         +root,
//         +unlimitrate,
//         getDurationDays(opendate, enddate)
//       );
//       if (log) {
//         log.forEach(x => {
//           balance += calculateUnLimit(
//             +x.amount,
//             +unlimitrate,
//             getDurationDays(opendate, x.time)
//           );
//         });
//       }
//     }
//   }
//   return Math.floor(balance);
// };

export {
  // calculate,
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
