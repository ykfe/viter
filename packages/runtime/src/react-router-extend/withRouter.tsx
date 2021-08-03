import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import qs from 'querystring';

const withRouter =
  <P extends unknown>(WrapComponent: React.ComponentType<P>) =>
  (props: P): JSX.Element => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const query = location.search ? qs.parse(location.search.substr(1)) : {};
    return (
      <WrapComponent
        {...props}
        match={{ params }}
        location={{ ...location, query }}
        history={{ push: navigate }}
      />
    );
  };

export default withRouter;
