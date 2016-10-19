const FollowToggle = require('./follow_toggle.js');

$(() => {
  $('.follow-toggle').each((i, el) => {
    new FollowToggle($(el));
  });
});
