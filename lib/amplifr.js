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
   * @param {String} userToken Amplifr user token
   * @param {String} appToken Amplifr application token
   * @param {Object} [options]
   */
  constructor(userToken, appToken, options = {}) {
    this.options = options;
    this.userToken = userToken;
    this.appToken = appToken;
  }

  request(path, options = {}) {
    if (!this.userToken) {
      throw new Error('Amplifr user API Token not provided!');
    }
    if (!this.appToken) {
      throw new Error('Amplifr app API Token not provided!');
    }

    if (!options.headers) {
      options.headers = {};
    }
    options.headers['X-ACCESS-TOKEN'] = this.userToken;
    options.headers['X-APP-TOKEN'] = this.appToken;
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

  updateSubscription(userData) {
    const path = '/update_subscription';
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
