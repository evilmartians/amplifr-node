const URL = require('url');
const requestPromise = require('request-promise');

const Project = require('./amplifr/project.js');

const API_HOST = 'amplifr.com';
const API_BASE_PATH = '/api/v1';

function buildURL(path) {
  return URL.format({
    protocol: 'https',
    host: API_HOST,
    pathname: `${API_BASE_PATH}${path}`,
  });
}

class Amplifr {
  /**
   * @class Amplifr
   * @constructor
   * @param {String} token Amplifr Token
   * @param {Object} [options]
   */
  constructor(token, options = {}) {
    this.options = options;
    this.token = token;
  }

  request(path, options = {}) {
    if (!this.token) {
      throw new Error('Amplifr API Token not provided!');
    }

    if (!options.headers) {
      options.headers = {};
    }
    options.headers['X-ACCESS-TOKEN'] = this.token;
    options.simple = false;
    options.resolveWithFullResponse = true;
    options.url = buildURL(path);
    options.json = true;
    return requestPromise(options)
      .then(resp => {
        if (resp.statusCode !== 200) {
          const msg1 = `Url: ${options.url}; Status code: ${resp.statusCode}`;
          const msg2 = `Body: ${JSON.stringify(resp.body)};`;
          throw new Error(`${msg1}; ${msg2}`);
        }

        const data = resp.body;
        if (data.ok) {
          return data.result;
        }

        throw new Error(`${data.status} ${data.message}`);
      });
  }

  authorizeToken(userData) {
    const path = '/authorize_token';
    return this.request(path, { method: 'POST', body: { data: userData } });
  }

  projects() {
    const path = '/projects';
    return this.request(path);
  }

  project(projectId) {
    return new Project(this, projectId);
  }
}

module.exports = Amplifr;
