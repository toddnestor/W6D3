const FollowToggle = require('./follow_toggle.js');

class UsersSearch {
  constructor($el) {
    this.el = $el;
    this.el.find('.search').keyup(this.handleInput.bind(this));
  }

  handleInput(e) {
    let searchValue = this.el.find('.search').val();
    this.performSearch(searchValue);
  }

  performSearch(searchValue) {
    let that = this;
    if (searchValue.length > 0) {
      $.ajax({
        url: '/users/search',
        type: 'GET',
        dataType: 'json',
        data: {
          query: searchValue
        },
        success(users) {
          that.displayUsers(users);
        }
      });
    } else {
      let usersUl = this.el.find('.users');
      usersUl.html("");
    }

  }

  displayUsers(users) {
    let usersUl = this.el.find('.users');
    usersUl.html("");
    $(users).each(function(i, user) {
      let li = $('<li>');
      li.append(`<a href="/users/${user.id}">${user.username}</a>`);
      let followButton = $('<button>');

      new FollowToggle(followButton, {
        userId: user.id,
        followState: user.followed ? 'followed' : 'unfollowed'
      });

      li.append(followButton);
      usersUl.append(li);
    });
  }
}

module.exports = UsersSearch;
