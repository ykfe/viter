import * as React from 'react';

type CaptureFn = (moduleName: string) => void;

// eslint-disable-next-line import/prefer-default-export
export const LoadableContext = React.createContext<CaptureFn | null>(null);
