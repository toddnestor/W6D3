@tweets.each do |tweet|
  json.set! tweet.id do
    json.content tweet.content
    json.user_id tweet.user_id
    json.username tweet.user.username
    json.mentioned_users tweet.mentioned_users
  end
end
