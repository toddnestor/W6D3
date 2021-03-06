/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const FollowToggle = __webpack_require__(1);
	const UsersSearch = __webpack_require__(2);
	const TweetCompose = __webpack_require__(3);
	const InfiniteTweets = __webpack_require__(4);
	
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
	
	  $('.infinite-tweets').each((i, el) => {
	    new InfiniteTweets($(el));
	  });
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	class FollowToggle {
	  constructor($el, options) {
	    this.el = $el;
	    this.userId = $el.data('user-id') || options.userId;
	    this.followState = $el.data('initial-follow-state') || options.followState;
	    this.render();
	
	    this.el.click(this.handleClick.bind(this));
	  }
	
	  render() {
	    let text = this.followState === 'followed' ? 'Unfollow!' : 'Follow!';
	
	    this.el.text(text);
	  }
	
	  handleClick(e) {
	    e.preventDefault();
	
	    switch (this.followState) {
	      case 'followed':
	        this.unFollow();
	        break;
	      case 'unfollowed':
	        this.follow();
	        break;
	    }
	  }
	
	  follow() {
	    this.makeRequest('POST', 'followed');
	  }
	
	  unFollow() {
	    this.makeRequest('DELETE', 'unfollowed');
	  }
	
	  makeRequest(type, followState) {
	    let that = this;
	
	    $.ajax({
	      url: '/users/' + this.userId + '/follow',
	      type: type,
	      dataType: 'json',
	      success() {
	        that.followState = followState;
	        that.render();
	      }
	    });
	  }
	}
	
	module.exports = FollowToggle;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const FollowToggle = __webpack_require__(1);
	
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


/***/ },
/* 3 */
/***/ function(module, exports) {

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
	    $('#feed').trigger('insert-tweet', [tweet, false]);
	    // this.addTweet(tweet);
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	class InfiniteTweets {
	  constructor($el) {
	    this.el = $el;
	    this.el.find('.fetch-more').click(this.fetchTweets.bind(this));
	    this.el.find('.fetch-more').click();
	
	    this.el.on('insert-tweet', (e, tweet, append) => {
	      this.addTweet(tweet, append);
	    });
	
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
	        if (tweets.length < 20) {
	          $('.fetch-more').remove();
	          that.el.append($('<h2>').text("No More Tweets!"));
	        } else {
	          that.maxCreatedAt = tweets[tweets.length - 1].created_at;
	          that.insertTweets(tweets);
	        }
	      }
	    });
	  }
	
	  insertTweets(tweets) {
	    $(tweets).each((i, tweet) => {
	      $('#feed').trigger('insert-tweet', tweet);
	    });
	  }
	
	  addTweet(tweet, append = true) {
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
	
	    if (append) {
	      tweetsUl.append(li);
	    } else {
	      tweetsUl.prepend(li);
	    }
	  }
	}
	
	module.exports = InfiniteTweets;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map