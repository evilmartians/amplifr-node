class Project {
  constructor(client, id) {
    this.client = client;
    this.id = id;
  }

  projectPath(path = '/') {
    return `/projects/${this.id}${path}`;
  }

  info() {
    return this.client.request(this.projectPath());
  }

  accounts() {
    const path = this.projectPath('/accounts');
    return this.client.request(path);
  }

  users() {
    const path = this.projectPath('/users');
    return this.client.request(path);
  }

  posts(query = {}) {
    const path = this.projectPath('/posts');
    const opts = { qs: query };
    return this.client.request(path, opts);
  }

  post(postId) {
    const path = this.projectPath(`/posts/${postId}`);
    return this.client.request(path);
  }

  imageUrl(imageId) {
    const path = this.projectPath(`/images/${imageId}`);
    return this.client.request(path);
  }

  videoUrl(videoId) {
    const path = this.projectPath(`/videos/${videoId}`);
    return this.client.request(path);
  }

  getImageUploadUrl(attachmentFilename) {
    const path = this.projectPath('/images/get_upload_url');
    const opts = { qs: { filename: attachmentFilename } };
    return this.client.request(path, opts);
  }

  commitImageUpload(imageId) {
    const path = this.projectPath(`/images/${imageId}/commit`);
    const opts = { method: 'POST' };
    return this.client.request(path, opts);
  }

  uploadImageFromUrl(imageUrl) {
    const path = this.projectPath('/images/upload_from_url');
    const opts = { method: 'POST', body: { url: imageUrl } };
    return this.client.request(path, opts);
  }

  getVideoUploadUrl(attachmentFilename) {
    const path = this.projectPath('/videos/get_upload_url');
    const opts = { qs: { filename: attachmentFilename } };
    return this.client.request(path, opts);
  }

  createPost(postParams = {}) {
  }

  deletePost(postId) {
    const path = this.projectPath(`/posts/${postId}`);
    const opts = { method: 'DELETE' };
    return this.client.request(path, opts);
  }
}

module.exports = Project;
