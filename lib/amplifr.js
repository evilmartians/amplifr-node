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

function buildURL(_path) {
  return URL.format({
    protocol: 'https',
    host: API_HOST,
    pathname: `${API_BASE_PATH}/${_path}`,
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

  request(_path, options = {}) {
    if (!this.token) {
      throw new Error('Amplifr API Token not provided!');
    }

    if (!options.headers) {
      options.headers = {};
    }
    options.headers['X-ACCESS-TOKEN'] = this.token;
    options.simple = false;
    options.resolveWithFullResponse = true;
    options.url = buildURL(_path);
    return requestPromise(options)
      .then(resp => {
        if (resp.statusCode !== 200) {
          throw new Error(`${resp.statusCode} ${resp.body}`);
        }

        const data = safeParse(resp.body);
        if (data.ok) {
          return data.result;
        }

        throw new Error(`${data.status} ${data.message}`);
      });
  }

  checkToken() {
    const _path = '/';
    return this.request(_path);
  }

  projects() {
    const _path = '/projects';
    return this.request(_path);
  }

  project(_projectId) {
    return new Project(this, _projectId);
  }
}

module.exports = Amplifr;
