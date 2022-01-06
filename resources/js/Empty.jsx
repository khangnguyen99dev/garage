import React from 'react';
import { connect } from 'react-redux';
import { EmptyLayout } from './components/Layout';
import PageSpinner from './components/PageSpinner';
const Base = ({ children }) => (
  <div>
    <EmptyLayout >
      <React.Suspense fallback={<PageSpinner />}>
        <main>{children}</main>
      </React.Suspense>
    </EmptyLayout>
  </div>
);

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(Base);
