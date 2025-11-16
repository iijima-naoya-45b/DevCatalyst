# frozen_string_literal: true

class SpecSection < ApplicationRecord
  belongs_to :spec

  enum :section_type, {
    overview: 0,
    target: 1,
    features: 2,
    technical_stack: 3,
    schedule: 4,
    budget: 5,
    risks: 6,
    custom: 99
  }

  validates :section_type, presence: true
  validates :title, presence: true
  validates :order, presence: true

  scope :ordered, -> { order(:order) }

  def to_markdown
    markdown = []
    markdown << "## #{title}\n"
    markdown << "\n"

    if content.present?
      # シンプルなMarkdown変換（改行を保持）
      formatted_content = content.gsub(/\n\n+/, "\n\n")
      markdown << formatted_content
      markdown << "\n"
    end

    markdown.join
  end
end
