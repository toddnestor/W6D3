class Tweet < ActiveRecord::Base
  has_many :mentions
  has_many :mentioned_users, through: :mentions, source: :user
  belongs_to :user

  validates :content, :user, presence: true

  def to_builder
    Jbuilder.new do |tweet|
      tweet.(self, :content)
    end
  end
end
