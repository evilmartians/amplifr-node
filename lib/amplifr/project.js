class Project {
  constructor(client, id) {
    this.client = client;
    this.id = id;
  }

  projectPath(_path = '/') {
    return `/projects/${this.id}${_path}`;
  }

  info() {
    return this.client.request(this.projectPath());
  }

  accounts() {
    const _path = this.projectPath('/accounts');
    return this.client.request(_path);
  }

  users() {
    const _path = this.projectPath('/users');
    return this.client.request(_path);
  }

  posts(query = {}) {
    const _path = this.projectPath('/posts');
    const _opts = { qs: query };
    return this.client.request(_path, _opts);
  }

  post(_postId) {
    const _path = this.projectPath(`/posts/${_postId}`);
    return this.client.request(_path);
  }

  imageUrl(_imageId) {
    const _path = this.projectPath(`/images/${_imageId}`);
    return this.client.request(_path);
  }

  videoUrl(_videoId) {
    const _path = this.projectPath(`/videos/${_videoId}`);
    return this.client.request(_path);
  }

  getImageUploadUrl(_filename) {
    const _path = this.projectPath('/images/get_upload_url');
    const _opts = { qs: { filename: _filename } };
    return this.client.request(_path, _opts);
  }

  commitImageUpload(_imageId) {
    const _path = this.projectPath(`/images/${_imageId}/commit`);
    const _opts = { method: 'POST' };
    return this.client.request(_path, _opts);
  }

  uploadImageFromUrl(_imageUrl) {
    const _path = this.projectPath('/images/upload_from_url');
    const _opts = { method: 'POST', body: { url: _imageUrl } };
    return this.client.request(_path, _opts);
  }

  getVideoUploadUrl(_filename) {
    const _path = this.projectPath('/videos/get_upload_url');
    const _opts = { qs: { filename: _filename } };
    return this.client.request(_path, _opts);
  }

  createPost(postParams = {}) {
  }

  deletePost(_postId) {
    const _path = this.projectPath(`/posts/${_postId}`);
    const _opts = { method: 'DELETE' };
    return this.client.request(_path, _opts);
  }
}

module.exports = Project;
