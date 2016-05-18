const https = require('https');
const URL = require('url');
const request = require('request-promise');

const API_HOST = 'amplifr.com';
const API_BASE_PATH = '/api/v1';

class AmplifrClient {
  /**
   * @class AmplifrClient
   * @constructor
   * @param {String} token Amplifr Token
   * @param {Object} [options]
   */
  constructor(token, options = {}) {
    this.options = options;
    this.token = token;
  }

  // used so that other funcs are not non-optimizable
  _safeParse(json) {
    try {
      return JSON.parse(json);
    } catch (err) {
      throw new Error(`Error parsing Amplifr response: ${String(json)}`);
    }
  }

  _request(_path, options={}) {
    if (!this.token) {
      throw new Error('Amplifr API Token not provided!');
    }

    if (!options.headers) {
      options.headers = {}
    }
    options.headers['X-ACCESS-TOKEN'] = this.token;
    options.simple = false;
    options.resolveWithFullResponse = true;
    options.url = this._buildURL(_path);
    return request(options)
      .then(resp => {
        if (resp.statusCode != 200) {
          console.log(resp);
          throw new Error(`${resp.statusCode} ${resp.body}`);
        }

        const data = this._safeParse(resp.body);
        if (data.ok) {
          return data;
        }

        throw new Error(`${data.status} ${data.message}`);
      });
  }

  _buildURL(_path) {
    return URL.format({
      protocol: 'https',
      host: API_HOST,
      pathname: `${API_BASE_PATH}/${_path}`
    });
  }

  checkToken() {
    const _path = '/';
    return this._request(_path);
  }

  projects() {
    const _path = '/projects';
    return this._request(_path);
  }

  project(_projectId) {
    const _path = `/projects/${_projectId}`;
    return this._request(_path);
  }

  accounts(_projectId) {
    const _path = `/projects/${_projectId}/accounts`;
    return this._request(_path);
  }

  users(_projectId) {
    const _path = `/projects/${_projectId}/users`;
    return this._request(_path);
  }

  posts(_projectId, query={}) {
    const _path = `/projects/${_projectId}/users`;
    return this._request(_path, {qs: query});
  }
}

module.exports = AmplifrClient;
