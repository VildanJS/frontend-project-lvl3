import bootstrap from 'bootstrap'
import './scss/styles.scss';

import {testFn} from "./test";


document.body.innerHTML = `
    <div class="container py-4 px-3 mx-auto">
      <h1>Hello, Bootstrap and Webpack!</h1>
      <button class="btn btn-primary">${testFn(17)}</button>
    </div>
`