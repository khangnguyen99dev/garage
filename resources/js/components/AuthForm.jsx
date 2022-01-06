import logo200Image from "../assets/img/logo/logo_200.png";
import logo from "@/pages/PrintPDF/logo.jpg";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import AuthService from "@/services";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";

function AuthForm(props) {
    const isAuthenticated = useSelector((state) => state.Auth.isAuthenticated);

    const setting = useSelector((state) => state.Setting);

    const isLogin = props.authState === STATE_LOGIN || false;

    const isSignup = props.authState === STATE_SIGNUP || false;

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const dispatchs = useDispatch();

    // const changeAuthState = (authState) => (event) => {
    //     event.preventDefault();
    //     props.onChangeAuthState(authState);
    // };

    const handleSubmit = (event) => {
        event.preventDefault();
        submit(credentials);
    };

    const submit = (credentials) => {
        dispatchs(AuthService.login(credentials)).catch((err) => {});
    };

    const renderButtonText = () => {
        const { buttonText } = props;

        if (!buttonText && isLogin) {
            return "Đăng nhập";
        }

        if (!buttonText && isSignup) {
            return "Đăng ký";
        }

        return buttonText;
    };

    const {
        showLogo,
        usernameLabel,
        usernameInputProps,
        passwordLabel,
        passwordInputProps,
        confirmPasswordLabel,
        confirmPasswordInputProps,
        children,
        onLogoClick,
    } = props;

    if (isAuthenticated) {
        return <Redirect to="/admin" />;
    }

    return (
        <Form onSubmit={handleSubmit}>
            {showLogo && (
                <div className="text-center pb-4">
                    <img
                        src={"../" + setting.data.logo || logo200Image}
                        className="rounded"
                        style={{ width: 60, height: 60, cursor: "pointer" }}
                        alt="logo"
                        onClick={onLogoClick}
                    />
                </div>
            )}
            <FormGroup>
                <Label for={usernameLabel}>{usernameLabel}</Label>
                <Input
                    {...usernameInputProps}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
            </FormGroup>
            <FormGroup>
                <Label for={passwordLabel}>{passwordLabel}</Label>
                <Input
                    {...passwordInputProps}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
            </FormGroup>
            {isSignup && (
                <FormGroup>
                    <Label for={confirmPasswordLabel}>{confirmPasswordLabel}</Label>
                    <Input {...confirmPasswordInputProps} />
                </FormGroup>
            )}
            {/* <FormGroup check>
                <Label check>
                    <Input type="checkbox" /> {isSignup ? "Đồng ý với điều khoản" : "Nhớ mật khẩu"}
                </Label>
            </FormGroup> */}
            <hr />
            <Button size="lg" className="bg-gradient-theme-left border-0" block type="submit">
                {renderButtonText()}
            </Button>

            {/* <div className="text-center pt-1">
        <h6>hoặc</h6>
        <h6>
          {isSignup ? (
            <a href="#login" onClick={changeAuthState(STATE_LOGIN)}>
              Đăng nhập
            </a>
          ) : (
            <a href="#signup" onClick={changeAuthState(STATE_SIGNUP)}>
              Đăng ký
            </a>
          )}
        </h6>
      </div> */}

            {children}
        </Form>
    );
}

export const STATE_LOGIN = "LOGIN";
export const STATE_SIGNUP = "SIGNUP";

AuthForm.propTypes = {
    authState: PropTypes.oneOf([STATE_LOGIN, STATE_SIGNUP]).isRequired,
    showLogo: PropTypes.bool,
    usernameLabel: PropTypes.string,
    usernameInputProps: PropTypes.object,
    passwordLabel: PropTypes.string,
    passwordInputProps: PropTypes.object,
    confirmPasswordLabel: PropTypes.string,
    confirmPasswordInputProps: PropTypes.object,
    onLogoClick: PropTypes.func,
    dispatch: PropTypes.func,
    isAuthenticated: PropTypes.bool,
};

AuthForm.defaultProps = {
    authState: "LOGIN",
    showLogo: true,
    usernameLabel: "Email",
    usernameInputProps: {
        type: "email",
        placeholder: "Nhập email ...",
    },
    passwordLabel: "Mật khẩu",
    passwordInputProps: {
        type: "password",
        placeholder: "Nhập mật khẩu ...",
    },
    confirmPasswordLabel: "Nhập lại mật khẩu ...",
    confirmPasswordInputProps: {
        type: "password",
        placeholder: "Nhập lại mật khẩu ...",
    },
    location: {
        state: {
            pathname: "/admin",
        },
    },
    onLogoClick: () => {},
};

export default AuthForm;
