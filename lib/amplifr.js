const URL = require('url');
const requestPromise = require('request-promise');

const Project = require('./amplifr/project.js');

const API_HOST = 'amplifr.com';
const API_BASE_PATH = '/api/v1';

function buildURL(path, withBase = true) {
  let _pathname = path;
  if (withBase) {
    _pathname = `${API_BASE_PATH}${path}`;
  }
  return URL.format({
    protocol: 'https',
    host: API_HOST,
//    DEV VALUES
//    protocol: 'http',
//    host: 'amplifr.dev:3000',
    pathname: _pathname,
  });
}

class Amplifr {
  /**
   * @class Amplifr
   * @constructor
   * @param {String} accessToken Amplifr user token
   * @param {Object} [options]
   */
  constructor(accessToken, options = {}) {
    this.options = options;
    this.accessToken = accessToken;
    if (options.oauth) {
      this.oauth = options.oauth;
    }
  }

  request(path, options = {}) {
    if (path !== '/oauth/token') {
      if (!this.accessToken) {
        throw new Error('You do not have access token yet. Use getToken first');
      }
      if (options.body) {
        options.body.access_token = this.accessToken;
      } else {
        if (!options.qs) {
          options.qs = {};
        }
        options.qs.access_token = this.accessToken;
      }
      options.url = buildURL(path);
    } else {
      options.url = buildURL(path, false);
    }
    options.simple = false;
    options.resolveWithFullResponse = true;
    options.json = true;
    return requestPromise(options)
      .then(resp => {
        if (resp.statusCode !== 200) {
          const msg1 = `Url: ${options.url}; Status code: ${resp.statusCode}`;
          const msg2 = `Body: ${JSON.stringify(resp.body)};`;
          throw new Error(`${msg1}; ${msg2}`);
        }

        let res = undefined;
        if (path === '/oauth/token') {
          const token = resp.body.access_token;
          this.accessToken = token;
          res = token;
        } else {
          const data = resp.body;
          if (data.ok) {
            res = data.result;
          } else {
            throw new Error(`${data.status} ${data.message}`);
          }
        }
        if (!res) {
          throw new Error(`No result: ${JSON.stringify(resp)}`);
        }
        return res;
      });
  }

  getToken(accessGrant) {
    const path = '/oauth/token';
    const oauthParams = {
      grant_type: 'authorization_code',
      redirect_uri: this.oauth.redirectUri,
      client_id: this.oauth.clientId,
      client_secret: this.oauth.clientSecret,
      code: accessGrant,
    };
    return this.request(path, { method: 'POST', body: oauthParams });
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
