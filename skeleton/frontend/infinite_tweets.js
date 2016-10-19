class InfiniteTweets {
  constructor($el) {
    this.el = $el;
    this.el.find('.fetch-more').click(this.fetchTweets.bind(this));
    this.maxCreatedAt = null;
  }

  fetchTweets(e) {
    let that = this;
    e.preventDefault();
    let data = {};
    if (this.maxCreatedAt) {
      data.max_created_at = this.maxCreatedAt;
    }

    $.ajax({
      url: '/feed',
      type: 'GET',
      data: data,
      dataType: 'json',
      success: function(tweets) {
        if (tweets.length > 0) {
          that.maxCreatedAt = tweets[tweets.length - 1].created_at;
          that.insertTweets(tweets);
        } else {
          $('.fetch-more').remove();
          that.el.append($('<h2>').text("No More Tweets!"));
        }
      }
    });
  }

  insertTweets(tweets) {
    $(tweets).each((i, tweet) => {
      this.addTweet(tweet);
    });
  }

  addTweet(tweet) {
    let tweetsUl = $(this.el.find('#feed'));
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


    tweetsUl.append(li);
  }
}

module.exports = InfiniteTweets;
