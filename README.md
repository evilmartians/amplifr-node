# Amplifr API for NodeJS

## Usage

`npm -i amplifr-node` - someday, right now it's not public

```js
const Amplifr = require('amplifr-node');

const client = new Amplifr('your amplifr token strin');

client.projects().then(prs => {
  console.log(JSON.stringify(prs));
  let project = client.project(prs[0].id);

  project.info().then(info => {
    console.log(JSON.stringify(info));
  })

  project.posts({ today: true }).then(todayPosts => {
    console.log(todayPosts.length);
  })
})
```
