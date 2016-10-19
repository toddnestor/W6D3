class FollowToggle {
  constructor($el) {
    this.el = $el;
    this.userId = $el.data('user-id');
    this.followState = $el.data('initial-follow-state');
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
