# frozen_string_literal: true

class Spec < ApplicationRecord
  belongs_to :user
  belongs_to :chat_session, optional: true
  has_many :spec_sections, dependent: :destroy
  
  enum :status, {
    draft: 0,
    generating: 1,
    completed: 2,
    exported: 3
  }, prefix: :status
  
  enum :format, {
    notion: 0,
    markdown: 1,
    pdf: 2,
    json: 3
  }, prefix: :format
  
  validates :title, presence: true
  validates :status, presence: true
  validates :format, presence: true
  
  scope :recent_first, -> { order(created_at: :desc) }
  scope :by_user, ->(user) { where(user: user) }
  
  # JSONシリアライゼーション（SQLite対応）
  # Rails 8ではserializeが非推奨のため、手動でパース/シリアライズを行う
  
  def content_hash
    return {} if content.blank?
    content.is_a?(String) ? JSON.parse(content) : (content.is_a?(Hash) ? content : {})
  end
  
  def content_hash=(value)
    self.content = value.is_a?(String) ? value : value.to_json
  end
  
  def metadata_hash
    return {} if metadata.blank?
    metadata.is_a?(String) ? JSON.parse(metadata) : (metadata.is_a?(Hash) ? metadata : {})
  end
  
  def metadata_hash=(value)
    self.metadata = value.is_a?(String) ? value : value.to_json
  end
  
  def update_completion_percentage!
    total_sections = spec_sections.count
    return if total_sections.zero?
    
    completed_sections = spec_sections.where(is_completed: true).count
    percentage = (completed_sections.to_f / total_sections * 100).round
    
    update!(completion_percentage: percentage)
    
    # 全て完了したらstatusを更新
    if percentage == 100 && status_generating?
      update!(status: :completed)
    end
  end
  
  def generate_markdown!
    markdown = []
    
    markdown << "# #{title}\n"
    markdown << "\n"
    
    if description.present?
      markdown << description
      markdown << "\n"
    end
    
    spec_sections.order(:order).each do |section|
      markdown << section.to_markdown
      markdown << "\n"
    end
    
    markdown << "\n---\n"
    markdown << "\n**作成日**: #{created_at.strftime('%Y-%m-%d')}\n"
    markdown << "**最終更新**: #{updated_at.strftime('%Y-%m-%d')}\n"
    markdown << "**作成者**: DevCatalyst AI\n"
    
    update!(markdown_content: markdown.join)
  end
end

