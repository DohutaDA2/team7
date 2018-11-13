import React from "react";

import classes from "./Spinner.css";
import Backdrop from "../Modal/Backdrop/Backdrop";

const spinner = () => (
  <div className={classes.spinner}>
    {/* <Backdrop show={true} /> */}
    <div className={classes.doublebounce1} />
    <div className={classes.doublebounce2} />
  </div>
);

export default spinner;
