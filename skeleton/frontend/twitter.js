const FollowToggle = require('./follow_toggle.js');
const UsersSearch = require('./users_search.js');
const TweetCompose = require('./tweet_compose.js');

$(() => {
  $('.follow-toggle').each((i, el) => {
    new FollowToggle($(el));
  });

  $('.users-search').each((i, el) => {
    new UsersSearch($(el));
  });

  $('.tweet-compose').each((i, el) => {
    new TweetCompose($(el));
  });
});
