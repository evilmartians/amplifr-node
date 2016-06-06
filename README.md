# Amplifr API for NodeJS

## Usage

`npm -i amplifr-node`

```js
const Amplifr = require('amplifr-node');

const client = new Amplifr('your amplifr token string');

client.projects().then(res => {
  console.log(JSON.stringify(res));
  let project = client.project(res.projects[0].id);

  project.posts({ today: true }).then(res => {
    console.log(res.posts.length);
  })
})
```
