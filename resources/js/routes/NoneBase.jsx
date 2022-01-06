import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import Public from '../Public';

const NoneBase = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      <Public>
        <Component {...props} />
      </Public>
    )}
  />
);

NoneBase.propTypes = {};

export default NoneBase;