import React from "react";
import { mount, shallow, render } from "enzyme";

import Login from "../container/LoginContainer/Login";
import Button from "../components/UI/Button/Button";
import Input from "../components/UI/Input/Input";
import Modal from "../components/UI/Modal/Modal";

describe("Kiểm tra component", () => {
  it("phải render chính xác và không render các component con của nó", () => {
    const component = shallow(<Login />);
    expect(component).toMatchSnapshot();
  });

  it("phải thay đổi state khi inputs thay đổi", () => {
    const component = mount(<Login />);

    component
      .find('input')
      .at(1)
      .simulate("change", { target: { value: "abcabcabc" } });
    expect(component.state().controls.email.status.isValid).toBe(false);

    component
      .find("input")
      .at(3)
      .simulate("change", { target: { value: "abcabcabc" } });
    expect(component.state().controls.password.status.isValid).toBe(false);

    component
      .find(Button)
      .at(2)
      .simulate("click")
      .simulate("click");

    expect(component.state().errorMessage.length).toBeGreaterThan(0);
    expect(component.state().controls.email.touched).toEqual(true);
    expect(component.state().controls.password.touched).toEqual(true);
    component.unmount();
  });
});
