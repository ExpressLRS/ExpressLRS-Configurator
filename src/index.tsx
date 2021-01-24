import React from 'react';

if (process.env.NODE_ENV === 'development' && process.env.WHY_DID_YOU_RENDER === 'true') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
  });
}

import {render} from 'react-dom';
import App from './ui/App';

render(<App/>, document.getElementById('root'));
