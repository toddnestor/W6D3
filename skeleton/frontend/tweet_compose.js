class TweetCompose {
  constructor($el) {
    this.el = $el;
    this.el.on("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(e) {
    e.preventDefault();

    this.submit();
  }

  submit() {
    let that = this;

    let data = this.el.serialize();
    this.el.find(':input').prop("disabled", true);
    $.ajax({
      url: '/tweets',
      type: 'POST',
      dataType: 'json',
      data: data,
      success(tweet) {
        that.handleSuccess(tweet);
      }
    });
  }

  clearInput() {
    this.el.find(':input:not([type=submit])').val('');
  }

  handleSuccess(tweet) {
    this.el.find(':input').prop("disabled", false);
    this.clearInput();
    this.addTweet(tweet);
  }

  addTweet(tweet) {
    let tweetsUl = $(this.el.data('tweets-ul'));
    let li = $('<li>');

    li.append(tweet.content);
    li.append(` -- <a href="/users/${tweet.user.id}">${tweet.user.username}</a>`);
    li.append(` -- ${tweet.created_at}`);

    if (tweet.mentions.length > 0) {
      let mentionUl = $('<ul>');
      $(tweet.mentions).each( (i, mention) => {
        let mentionLi = $('<li>');
        mentionLi.append(`<a href="/users/${mention.user.id}">${mention.user.username}</a>`);
        mentionUl.append(mentionLi);
      });
      li.append(mentionUl);
    }


    tweetsUl.prepend(li);
  }
}

module.exports = TweetCompose;
