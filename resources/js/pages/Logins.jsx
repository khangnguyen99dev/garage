import InputField from '@/custom-fields/InputField';
import React from 'react';

function Logins(props) {

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password } = this.state;
        const credentials = {
            email,
            password,
        };

        // Set response state back to default.
        this.setState({ response: { error: false, message: '' } });

        this.validator.validateAll(credentials).then((success) => {
            if (success) {
                this.setState({ loading: true });
                this.submit(credentials);
            }
        });
    };

    const submit = (credentials) => {
        const { dispatch } = this.props;
        dispatch(AuthService.login(credentials)).catch((err) => {
            this.loginForm.reset();
            const errors = Object.values(err.errors);
            errors.join(' ');
            const response = {
                error: true,
                message: errors,
            };
            this.setState({ response });
            this.setState({ loading: false });
        });
    }

    const { location: state } = props;
    const { from } = state || { from: { pathname: '/' } };
    const { isAuthenticated } = props;

    if (isAuthenticated) {
        return <Redirect to={from} />;
    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleDelete}
        >
            {formikProps => {
                const { values, errors, touched } = formikProps;
                return (
                    <Form>
                        <FastField
                            name="email"
                            component={InputField}
                            label="Email"
                            placeholder="Nhập email ..."
                        />
                        <FastField
                            name="password"
                            component={InputField}
                            label="Mật khẩu"
                            placeholder="Nhập mật khẩu ..."
                        />
                    </Form>
                )
            }}
        </Formik>
    );
}

export default Logins;