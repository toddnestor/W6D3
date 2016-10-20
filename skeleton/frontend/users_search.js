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
          if (users.length > 0) {
            that.displayUsers(users);
            that.el.find('.users').show();
          } else {
            that.el.find('.users').hide();
          }
        }
      });
    } else {
      let usersUl = this.el.find('.users');
      usersUl.hide();
      usersUl.html("");
    }

  }

  displayUsers(users) {
    let usersUl = this.el.find('.users');
    usersUl.html("");
    $(users).each(function(i, user) {
      let li = $('<li>');
      let a = $('<a>').attr('href', `/users/${user.id}`).text(user.username);
      let followButton = $('<button>');

      new FollowToggle(followButton, {
        userId: user.id,
        followState: user.followed ? 'followed' : 'unfollowed'
      });
      a.append(followButton);
      li.append(a);

      usersUl.append(li);
    });
  }
}

module.exports = UsersSearch;
