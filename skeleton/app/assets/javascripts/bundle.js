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
	
	$(() => {
	  $('.follow-toggle').each((i, el) => {
	    new FollowToggle($(el));
	  });
	
	  $('.users-search').each((i, el) => {
	    new UsersSearch($(el));
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
	    console.log('in click');
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map