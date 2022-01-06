import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router";
import { connect } from "react-redux";
import BaseClient from "@/BaseClient";

const PrivateRouteClient = ({ component: Component, isAuthenticated, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? (
                    <BaseClient>
                        <Component {...props} />
                    </BaseClient>
                ) : (
                    <>
                        <Redirect
                            to={{
                                pathname: "/",
                                state: { from: props.location },
                            }}
                        />
                    </>
                )
            }
        />
    );
};

PrivateRouteClient.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(PrivateRouteClient);
