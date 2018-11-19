import React, { Component } from "react";
import Layout from "../../../hoc/Layout/Layout.js";
import Modal from "../../../components/UI/Modal/Modal";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import moment from "moment";
import classes from "./PassbookDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { formatNum, getEndDate } from "../../../hoc/business/refineUI";
import {
  loadPassbook,
  saveLog,
  saveNewPassbook,
  updatePassbook
} from "../../../hoc/business/business";
import {
  checkValidityDetailAction,
  checkAllowDeposit,
  checkAllowWithdraw
} from "../../../hoc/business/checkValidity";
import * as images from "../../../hoc/images";
import withAuthentication from "../../../hoc/withAuth/withAuthentication";

class PassbookDetail extends Component {
  state = {
    loading: false,
    error: "",
    isEditing: false,
    isWithdrawing: false,
    isDespositing: false,
    isAccounting: false,
    passbook: {
      id: "",
      balance: 0,
      realBalance: 0,
      bankId: "",
      bankFullname: "",
      bankShortname: "",
      end: false,
      endDate: "",
      interestRate: "",
      unlimitInterestRate: "",
      paymentDesc: "",
      paymentName: "",
      paymentId: "",
      passbookName: "",
      opendate: "",
      termId: "",
      term: "",
      termDes: "",
      userId: "",
      idToken: "",
      log: []
    },
    actionResult: {
      elementType: "input",
      elementConfig: {
        type: "text",
        disabled: false
      },
      value: "",
      validationDeposite: {
        valid: false,
        required: true,
        isGreaterThan0: true
      },
      validationWithdraw: {
        valid: false,
        required: true,
        isGreaterThan0: true,
        isSmallerThanRoot: true
      },
      status: {
        valid: false,
        errorMessage: ""
      },
      touched: false
    },
    actions: {
      edit: {
        name: "Sửa thông tin",
        config: {
          disabled: true
        },
        icon: images.edit
      },
      withdraw: {
        name: "Rút bớt",
        config: {
          disabled: true
        },
        icon: images.withdraw
      },
      deposit: {
        name: "Gửi thêm",
        config: {
          disabled: true
        },
        icon: images.deposit
      },
      accounting: {
        name: "Tất toán",
        config: {
          disabled: true
        },
        icon: images.accounting
      },
      closing: {
        name: "Thoát",
        config: {
          disabled: false
        },
        icon: images.exit
      }
    }
  };

  componentWillMount() {
    this.setState({ loading: true });
    this.loadData();
  }

  loadData = async () => {
    try {
      const query = new URLSearchParams(this.props.location.search);
      const temp = {};
      for (let param of query.entries()) {
        temp[param[0]] = param[1];
      }
      const userInfo = { userId: temp.userId, idToken: temp.idToken };
      const data = await loadPassbook(userInfo, temp.id);

      const actions = {
        ...this.state.actions,
        edit: {
          ...this.state.actions.edit,
          config: {
            ...this.state.actions.edit.config,
            disabled: data.end
          },
          action: () => this.editAction(data.id)
        },
        withdraw: {
          ...this.state.actions.withdraw,
          config: {
            ...this.state.actions.withdraw.config,
            disabled: !checkAllowWithdraw(
              data.paymentId,
              data.end,
              data.opendate,
              data.term
            )
          },
          action: () => this.withdrawAction(data.id)
        },
        deposit: {
          ...this.state.actions.deposit,
          config: {
            ...this.state.actions.deposit.config,
            disabled: !checkAllowDeposit(
              data.paymentId,
              data.end,
              data.enddate,
              data.opendate,
              data.term
            )
          },
          action: () => this.depositAction(data.id)
        },
        accounting: {
          ...this.state.actions.accounting,
          config: {
            ...this.state.actions.accounting.config,
            disabled: false || data.end || data.enddate
          },
          action: () => this.accountingAction(data.id)
        },
        closing: {
          ...this.state.actions.closing,
          action: () => this.closeAction()
        }
      };

      this.setState({
        loading: false,
        userInfo: userInfo,
        passbook: data,
        actions: actions
      });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false, error: error });
    }
  };

  saveData = event => {
    event.preventDefault();
    this.setState({ loading: true });
    try {
      if (
        !this.state.actionResult.value ||
        !this.state.actionResult.status.valid
      ) {
        const error = { code: "NULL_VALUE", message: "Lỗi giá trị rỗng!" };
        throw error;
      }
      if (this.state.isWithdrawing) {
        try {
          const log = {
            amount: this.state.actionResult.value,
            time: new Date()
          };
          saveLog(this.state.passbook.id, log)
            .then(res => {
              this.setState({ loadData: false });
              // console.log(res);
              window.location.reload();
            })
            .catch(error => {
              throw error;
            });
        } catch (error) {
          this.setState({ error: error });
        }
      }
      if (this.state.isAccounting) {
        try {
          this.setState({ loading: true });
          let passbookData = {
            balance: this.state.passbook.balance,
            bankId: this.state.passbook.bankId,
            end: true,
            enddate: moment().toDate(),
            endConditionId: this.state.passbook.endConditionId,
            interestRate: this.state.passbook.interestRate,
            unlimitInterestRate: this.state.passbook.unlimitInterestRate,
            interestPayment: this.state.passbook.paymentId,
            name: this.state.passbook.passbookName,
            opendate: moment(
              this.state.passbook.opendate,
              "DD/MM/YYYY"
            ).toDate(),
            termId: this.state.passbook.termId
          };
          updatePassbook(this.state.passbook.id, passbookData)
            .then(res => {
              try {
                this.setState({ loading: false });
                window.location.reload();
              } catch (error) {
                this.setState({ error: error });
              }
              // console.log(res);
            })
            .catch(err => {
              console.log(err);
              this.setState({ loading: false, error: err });
            });
        } catch (error) {
          this.setState({ error: error });
        }
      }
      if (this.state.isDespositing) {
        try {
          this.setState({ loading: true });
          let passbookData = {
            balance: this.state.passbook.balance,
            bankId: this.state.passbook.bankId,
            end: true,
            enddate: moment().toDate(),
            endConditionId: this.state.passbook.endConditionId,
            interestRate: this.state.passbook.interestRate,
            unlimitInterestRate: this.state.passbook.unlimitInterestRate,
            interestPayment: this.state.passbook.paymentId,
            name:
              this.state.passbook.passbookName +
              ` (mở ngày ${this.state.passbook.opendate})`,
            opendate: moment(
              this.state.passbook.opendate,
              "DD/MM/YYYY"
            ).toDate(),
            termId: this.state.passbook.termId
          };
          updatePassbook(this.state.passbook.id, passbookData)
            .then(res => {
              try {
                let newPassbookData = {
                  balance:
                    this.state.passbook.balance +
                    +this.state.actionResult.value,
                  bankId: this.state.passbook.bankId,
                  end: false,
                  enddate: "",
                  endConditionId: this.state.passbook.endConditionId,
                  interestRate: this.state.passbook.interestRate,
                  unlimitInterestRate: this.state.passbook.unlimitInterestRate,
                  interestPayment: this.state.passbook.paymentId,
                  name: this.state.passbook.passbookName,
                  opendate: moment(
                    this.state.passbook.opendate,
                    "DD/MM/YYYY"
                  ).toDate(),
                  termId: this.state.passbook.termId
                };
                saveNewPassbook(this.state.userInfo, newPassbookData)
                  .then(res => {
                    try {
                      this.setState({ loading: false });
                      this.closeAction();
                    } catch (error) {
                      this.setState({ error: error });
                    }
                    // console.log(res);
                  })
                  .catch(err => {
                    console.log(err);
                    this.setState({ loading: false, error: err });
                  });
              } catch (error) {
                this.setState({ error: error });
              }
              // console.log(res);
            })
            .catch(err => {
              console.log(err);
              this.setState({ loading: false, error: err });
            });
        } catch (error) {
          this.setState({ error: error });
        }
      }
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
      this.setState({ error: error });
    }
  };

  editAction = () => {
    const queryParams = [];
    const sendData = {
      ...this.state.passbook,
      isNew: false,
      ...this.state.userInfo
    };
    for (let key in sendData) {
      queryParams.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(sendData[key])
      );
    }
    const queryString = queryParams.join("&");
    this.props.history.push({
      pathname: "/form",
      search: "?" + queryString
    });
  };

  withdrawAction = () => {
    this.setState({ isWithdrawing: true });
  };

  depositAction = () => {
    this.setState({ isDespositing: true });
  };

  accountingAction = () => {
    this.setState({ isAccounting: true });
  };

  // TODO: hiện thông báo trước khi redirect
  closeAction = () => {
    const queryParams = [];
    const sendData = { ...this.state.userInfo };
    for (let key in sendData) {
      queryParams.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(sendData[key])
      );
    }
    const queryString = queryParams.join("&");
    this.props.history.push({
      pathname: "/home",
      search: "?" + queryString
    });
  };

  modalCloseAction = () => {
    let updatedActionControl = {
      elementType: "input",
      elementConfig: {
        type: "text",
        disabled: false
      },
      value: "",
      validationDeposite: {
        valid: false,
        required: true,
        isGreaterThan0: true
      },
      validationWithdraw: {
        valid: false,
        required: true,
        isGreaterThan0: true,
        isSmallerThanRoot: true
      },
      status: {
        valid: false,
        errorMessage: ""
      },
      touched: false
    };
    this.setState({
      isEditing: false,
      isWithdrawing: false,
      isDespositing: false,
      isAccounting: false,
      isClosing: false,
      actionResult: updatedActionControl
    });
  };

  inputChangedHandler = (event, controlName, type) => {
    try {
      let updatedControl = {
        ...this.state.actionResult,
        value: event.target.value,
        status: checkValidityDetailAction(
          controlName,
          event.target.value,
          type === "w"
            ? this.state.actionResult.validationWithdraw
            : this.state.actionResult.validationDeposite,
          this.state.passbook.balance
        ),
        touched: true
      };
      this.setState({ actionResult: updatedControl });
    } catch (error) {
      console.log(error);
    }
  };

  fatalHandler = () => {
    this.props.history.goBack();
  };

  render() {
    // --- spinner ---
    let spinner = null;
    if (this.state.loading) {
      spinner = <Spinner />;
    }

    // --- action buttons ---
    let elements = [];
    for (let key in this.state.actions) {
      elements.push({
        id: key,
        config: this.state.actions[key]
      });
    }
    const buttons = elements.map(action => (
      <Button
        key={action.id}
        btnType="Action"
        {...action.config.config}
        clicked={action.config.action}
      >
        <div style={{ display: "column" }}>
          <img
            className={classes.Icon}
            src={action.config.icon}
            alt={action.config.name}
          />
          <p style={{ margin: "0", marginTop: "10px" }}>{action.config.name}</p>
        </div>
      </Button>
    ));

    // --- logs ---
    let logs = <p style={{ textAlign: "center", margin: "0" }}>Không có</p>;
    if (this.state.passbook.log.length !== 0) {
      logs = this.state.passbook.log.map(log => (
        <p key={log.id} className={classes.Row}>
          Giao dịch rút {formatNum(log.amount)} đ vào ngày {log.time}
        </p>
      ));
    }

    // --- modal ---
    let modal = null;
    if (this.state.isWithdrawing) {
      modal = (
        <Modal
          show={this.state.isWithdrawing && !this.state.error}
          modalClosed={this.modalCloseAction}
        >
          <form>
            <p className={classes.ModalMessage}>Rút tiền</p>
            {this.state.passbook.term !== 0 ? (
              <p style={{ textAlign: "center" }}>
                Sổ tiết kiệm{" "}
                {this.state.passbook.bankShortname.toUpperCase() +
                  "-" +
                  this.state.passbook.passbookName}{" "}
                đến hạn ngày{" "}
                {getEndDate(
                  this.state.passbook.opendate,
                  this.state.passbook.term
                )}
                . Tất toán sổ trước hạn sẽ được tính lãi theo lãi suất không kỳ
                hạn ({this.state.passbook.unlimitInterestRate}%/năm).
              </p>
            ) : null}
            <p style={{ textAlign: "center" }}>Nhập số tiền cần rút</p>
            <Input
              elementType={this.state.actionResult.elementType}
              elementConfig={this.state.actionResult.elementConfig}
              disabled={this.state.actionResult.elementConfig.disabled}
              value={this.state.actionResult.value}
              status={!this.state.actionResult.status.isValid}
              shouldValidate={this.state.actionResult.validationWithdraw}
              touched={this.state.actionResult.touched}
              changed={event =>
                this.inputChangedHandler(event, "actionResult", "w")
              }
            />
            <div style={{ display: "table", margin: "auto" }}>
              <Button
                btnType="OK"
                clicked={event => this.saveData(event)}
                css={{ width: "150px", display: "inline", margin: "0 5px 0 0" }}
              >
                OK
              </Button>
              <Button
                btnType="Cancel"
                clicked={this.modalCloseAction}
                css={{ width: "150px", display: "inline" }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      );
    }
    if (this.state.isDespositing) {
      modal = (
        <Modal
          show={this.state.isDespositing && !this.state.error}
          modalClosed={this.modalCloseAction}
        >
          <form>
            <p className={classes.ModalMessage}>Gửi thêm tiền</p>
            <p style={{ textAlign: "center" }}>
              Gửi thêm tiền vào sổ tiết kiệm, đồng nghĩa với việc đóng sổ hiện
              tại và mở một sổ mới có số tiền gốc bằng số dư của sổ cũ cộng với
              số tiền gửi thêm.
            </p>
            <p style={{ textAlign: "center" }}>Nhập số tiền gửi thêm</p>
            <Input
              elementType={this.state.actionResult.elementType}
              elementConfig={this.state.actionResult.elementConfig}
              disabled={this.state.actionResult.elementConfig.disabled}
              value={this.state.actionResult.value}
              status={!this.state.actionResult.status.isValid}
              shouldValidate={this.state.actionResult.validationDeposite}
              touched={this.state.actionResult.touched}
              changed={event =>
                this.inputChangedHandler(event, "actionResult", "d")
              }
            />
            <div style={{ display: "table", margin: "auto" }}>
              <Button
                btnType="OK"
                clicked={event => this.saveData(event)}
                css={{ width: "150px", display: "inline", margin: "0 5px 0 0" }}
              >
                OK
              </Button>
              <Button
                btnType="Cancel"
                clicked={this.modalCloseAction}
                css={{ width: "150px", display: "inline" }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      );
    }
    if (this.state.isAccounting) {
      modal = (
        <Modal
          show={this.state.isAccounting}
          modalClosed={this.modalCloseAction}
        >
          <div style={{ display: "table", margin: "auto" }}>
            <img
              className={classes.Icon}
              src={images.accounting}
              alt="Accounting logo"
            />
          </div>

          <p className={classes.ModalMessage}>Tất toán</p>
          {this.state.passbook.term !== 0 ? (
            <p style={{ textAlign: "center" }}>
              Sổ tiết kiệm{" "}
              {this.state.passbook.bankShortname.toUpperCase() +
                "-" +
                this.state.passbook.passbookName}{" "}
              đến hạn ngày{" "}
              {getEndDate(
                this.state.passbook.opendate,
                this.state.passbook.term
              )}
              . Tất toán sổ trước hạn sẽ được tính lãi theo lãi suất không kỳ
              hạn ({this.state.passbook.unlimitInterestRate}%/năm).
            </p>
          ) : null}
          <p style={{ textAlign: "center" }}>Bạn có muốn tiếp tục</p>
          <div style={{ display: "table", margin: "auto" }}>
            <Button
              btnType="OK"
              clicked={event => this.saveData(event)}
              css={{ width: "150px", display: "inline", margin: "0 5px 0 0" }}
            >
              OK
            </Button>
            <Button
              btnType="Cancel"
              clicked={this.modalCloseAction}
              css={{ width: "150px", display: "inline" }}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      );
    }

    return (
      <div>
        {modal}

        {spinner}

        <Modal show={this.state.error} modalClosed={this.fatalHandler}>
          <div>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              size="3x"
              className={classes.ModalIcon}
            />
          </div>
          <p style={{ textAlign: "center" }}>Mã lỗi: {this.state.error.code}</p>
          <p className={classes.ModalMessage}>{this.state.error.message}</p>
          <p style={{ textAlign: "center" }}>
            Vui lòng liên hệ với nhà cung cấp dịch vụ
          </p>
          <Button btnType="OK" clicked={this.fatalHandler}>
            OK
          </Button>
        </Modal>

        <div style={{ backgroundColor: "#f1f1f1", height: "100vh" }}>
          <Layout
            styles={{ borderRadius: "4px", position: "relative", top: "10%" }}
          >
            <p className={classes.Title}>
              CHI TIẾT SỔ TIẾT KIỆM{" "}
              {this.state.passbook.bankShortname.toUpperCase() +
                "-" +
                this.state.passbook.passbookName}
            </p>
            {/* actions zone */}
            <div className={classes.ActionBar}>{buttons}</div>
            {/* info zone */}
            <div className={classes.InfoZone}>
              <div className={classes.Row}>
                <span className={classes.Header}>Ngân hàng</span>
                <span className={classes.Content}>
                  {this.state.passbook.bankFullname || ""}
                </span>
              </div>
              <div className={classes.Row}>
                <span className={classes.Header}>Ngày mở sổ</span>
                <span className={classes.Content}>
                  {this.state.passbook.opendate.toString()}
                </span>
              </div>
              {this.state.passbook.end || this.state.passbook.enddate ? (
                <div className={classes.Row}>
                  <span className={classes.Header}>Ngày đóng sổ</span>
                  <span className={classes.Content}>
                    {this.state.passbook.enddate}
                  </span>
                </div>
              ) : null}
              <div className={classes.Row}>
                <span className={classes.Header}>Kỳ hạn gửi</span>
                <span className={classes.Content}>
                  {this.state.passbook.termDes}
                </span>
              </div>
              <div className={classes.Row}>
                <span className={classes.Header}>Lãi suất tiết kiệm</span>
                <span className={classes.Content}>
                  {this.state.passbook.interestRate}% (năm)
                </span>
              </div>
              <div className={classes.Row}>
                <span className={classes.Header}>
                  Lãi suất tiết kiệm không kỳ hạn
                </span>
                <span className={classes.Content}>
                  {this.state.passbook.unlimitInterestRate}
                </span>
              </div>
              <div className={classes.Row}>
                <span className={classes.Header}>Hình thức trả lãi</span>
                <span className={classes.Content}>
                  {this.state.passbook.paymentName}
                </span>
              </div>
              <div className={classes.Row}>
                <span className={classes.Header}>
                  Hình thức tất toán khi đến hạn
                </span>
                <span className={classes.Content}>
                  {this.state.passbook.endConditionName}
                </span>
              </div>
              <div className={classes.Row}>
                <span className={classes.Header}>Gốc</span>
                <span className={classes.Content}>
                  {formatNum(parseFloat(this.state.passbook.balance))} đ
                </span>
              </div>
              <div className={classes.Row}>
                <span className={classes.Header}>Số dư</span>
                <span className={classes.Content} style={{ fontWeight: "700" }}>
                  {formatNum(this.state.passbook.realBalance || 0)} đ
                </span>
              </div>
            </div>
            {/* log zone */}
            <div className={classes.InfoZone}>
              <p style={{ textAlign: "center", margin: "0", padding: "5px" }}>
                Lịch sử giao dịch
              </p>
              {logs}
            </div>
          </Layout>
        </div>
      </div>
    );
  }
}

export default withAuthentication(PassbookDetail);
