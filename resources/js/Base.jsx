import React from 'react';
import { connect } from 'react-redux';
import { MainLayout } from './components/Layout';
import PageSpinner from './components/PageSpinner';
const Base = ({ children }) => (
  <div>
    <MainLayout >
      <React.Suspense fallback={<PageSpinner />}>
        <main>{children}</main>
      </React.Suspense>
    </MainLayout>
  </div>
);

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(Base);
