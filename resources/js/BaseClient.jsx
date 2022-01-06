import React from 'react';
import { connect } from 'react-redux';
import MainClientLayout from './components/ClientLayout/MainClientLayout';
import PageSpinner from './components/PageSpinner';
const Base = ({ children }) => (
    <div>
        <MainClientLayout >
            <React.Suspense fallback={<PageSpinner />}>
                <main>{children}</main>
            </React.Suspense>
        </MainClientLayout>
    </div>
);

const mapStateToProps = (state) => ({
    isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(Base);