import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import qs from 'querystring';

const withRouter =
  <P extends Record<string, unknown>>(WrapComponent: React.ComponentType<P>) =>
  (props: P): JSX.Element => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const query = location.search ? qs.parse(location.search.substr(1)) : {};

    const historyPush = (
      pushProps: { pathname: string; state: Record<string, any> } | string,
      state?: Record<string, any>
    ) => {
      if (!pushProps) {
        return;
      }
      if (typeof pushProps === 'object') {
        navigate(pushProps?.pathname, { state: pushProps?.state });
        return;
      }
      if (typeof pushProps === 'string') {
        navigate(pushProps, state);
      }
    };

    return (
      <WrapComponent
        {...props}
        match={{ params }}
        location={{ ...location, query }}
        history={{
          push: historyPush,
          goBack: () => navigate(-1),
          goForward: () => navigate(1),
          go: (num: number) => navigate(num),
        }}
      />
    );
  };

export default withRouter;
