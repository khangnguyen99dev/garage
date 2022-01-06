import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import Base from '../Base';
import Empty from '@/Empty';
const PublicRoute = ({ component: Component, ...rest }) =>
  rest.base ?
    (<Route
      {...rest}
      render={(props) => (
        <Empty >
          <Component {...props} />
        </Empty >
      )}
    />)
    :
    (<Route
      {...rest}
      render={(props) => (
        <Base>
          <Component {...props} />
        </Base>
      )}
    />)



PublicRoute.propTypes = {};

export default PublicRoute;
