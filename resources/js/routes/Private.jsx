import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';
import { connect, useDispatch } from 'react-redux';
import Base from '../Base';
import * as actions from '@/store/actions';

const PrivateRoute = ({ component: Component, isAuthenticated, menus, ...rest }) => {
  const dispatch = useDispatch();

  const [checkMenu, setCheckMenus] = useState(true);

  useEffect (() => {
    if (!menus.includes(rest.path) && menus.length > 0) {
      setCheckMenus(false);
      dispatch(actions.authLogout());
    } 
  })

  return (
    <Route
      {...rest}
      render={(props) => (isAuthenticated && checkMenu ? (
        <Base>
          <Component {...props} />
        </Base>
      ) : (
        <>
          <Redirect
            to={{
              pathname: '/admin/login',
              state: { from: props.location },
            }}
          />
        </>
      ))}
    />
  )
};

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  menus: PropTypes.array,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  menus: state.Auth.menus.map((item) => item.to)
});

export default connect(mapStateToProps)(PrivateRoute);
