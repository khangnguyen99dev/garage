import React from 'react';
import { Route } from 'react-router';
import BaseClient from '@/BaseClient';
import Empty from '@/Empty';
const PublicRouteClient = ({ component: Component, ...rest }) =>
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
                <BaseClient>
                    <Component {...props} />
                </BaseClient>
            )}
        />)

export default PublicRouteClient;