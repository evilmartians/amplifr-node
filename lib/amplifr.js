const URL = require('url');
const requestPromise = require('request-promise');

const Project = require('./amplifr/project.js');

const API_HOST = 'amplifr.com';
const API_BASE_PATH = '/api/v1';

  // used so that other funcs are not non-optimizable
function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch (err) {
    throw new Error(`Error parsing Amplifr response: ${String(json)}`);
  }
}

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
    return requestPromise(options)
      .then(resp => {
        if (resp.statusCode !== 200) {
          throw new Error(`Url: ${options.url}; Status code: ${resp.statusCode}; Body: ${resp.body};`);
        }

        const data = safeParse(resp.body);
        if (data.ok) {
          return data.result;
        }

        throw new Error(`${data.status} ${data.message}`);
      });
  }

  checkToken() {
    const path = '/';
    return this.request(path);
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
