import React from 'react';
import loadable from '@loadable/component';

interface LoadableOptions {
  loading: React.ReactElement<any, any>;
  loader: (props: any) => Promise<React.ComponentClass<any, any>>;
}

export default function dynamic(options: LoadableOptions): React.ReactElement<any, any> {
  const DynamicComponent = loadable(options.loader, {
    fallback: options.loading,
  });
  return <DynamicComponent />;
}
