import path from 'path';
import fs from 'fs';

test('init', () => {
  const pathToHtml = path.resolve(__dirname, '__fixtures__/index.html');
  document.body.innerHTML = fs.readFileSync(pathToHtml, 'utf-8');
  expect(true).toBeDefined();
});
