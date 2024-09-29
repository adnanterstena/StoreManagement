import * as React from 'react';
import MProfile from './MProfile';

export default (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <MProfile />
        <div className="container-fluid">
            {props.children}
            </div>
    </React.Fragment>
);
