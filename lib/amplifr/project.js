class Project {
  constructor(client, id) {
    this.client = client;
    this.id = id;
  }

  projectPath(path = '/') {
    return `/projects/${this.id}${path}`;
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

  statsByLink(pubLink) {
    const path = this.projectPath('/stats/by_link');
    const opts = { qs: { link: pubLink } };
    return this.client.request(path, opts);
  }

  statsForPeriod(from, to) {
    const path = this.projectPath('/stats');
    const opts = { qs: { from: from, to: to } };
    return this.client.request(path, opts);
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

  /**
   * text - сообщение
   * url - ссылка, из которой развернуть карточку
   * time - время публикации ("2016-05-16T13:50:00.000Z") может быть пустым - опубликовать сейчас
   * attachments - массив аттачментов в формате
   *   ["image:1", "image:2", "video:2"], "attachment_type":"id_in_amplifr"
   * socials - массив айдишников аккаунтов куда публиковать
   * subforms - массив объектов дополнительных форм -
   *   отдельные публикации в отдельные соцсети.
   *   Объект состоит из вышеперечисленых параметров за исключением времени
   */
  createPost(postParams = {}) {
    const path = this.projectPath('/posts');
    const opts = { method: 'POST', body: postParams };
    return this.client.request(path, opts);
  }

  deletePost(postId) {
    const path = this.projectPath(`/posts/${postId}`);
    const opts = { method: 'DELETE' };
    return this.client.request(path, opts);
  }
}

module.exports = Project;
