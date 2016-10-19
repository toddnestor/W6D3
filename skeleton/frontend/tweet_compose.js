class TweetCompose {
  constructor($el) {
    this.el = $el;
    this.charsCount = 0;
    this.el.on("submit", this.handleSubmit.bind(this));
    this.el.find('[name="tweet[content]"]').keyup(this.handleTyping.bind(this));
    this.el.find('a.add-mentioned-user').click(this.addMentionedUser.bind(this));
    this.el.on("click", ".remove-mention-select", this.removeSelect);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.submit();
  }

  handleTyping(e) {
    let value = this.el.find('[name="tweet[content]"]').val();
    let remaining = 140 - value.length;
    this.el.find('.chars-left').text(remaining);
  }

  addMentionedUser(e) {
    e.preventDefault();

    let $scriptTag = this.el.find('script');

    this.el.find('.mentioned-users').append($scriptTag.html());
  }

  removeSelect(e) {
    e.preventDefault();
    $(this).closest(".mention-user-select").remove();
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
    this.el.find('.mention-user-select').remove();
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
