require 'rails_helper'

RSpec.describe Spec, type: :model do
  describe 'enums' do
    it 'defines status and format with prefixes to avoid collisions' do
      expect(described_class.statuses).to include('draft', 'generating', 'completed')
      expect(described_class.formats).to include('markdown', 'notion', 'pdf')
      spec = described_class.new(title: 't', status: :draft, format: :markdown)
      expect(spec).to respond_to(:status_draft?)
      expect(spec).to respond_to(:format_markdown?)
    end
  end

  describe 'json accessors' do
    it 'parses and assigns content_hash safely to backing text column' do
      spec = described_class.new(title: 't', status: :draft, format: :markdown)
      spec.content_hash = { foo: 'bar', arr: [1, 2] }
      expect { JSON.parse(spec[:content]) }.not_to raise_error
      expect(spec.content_hash).to eq({ 'foo' => 'bar', 'arr' => [1, 2] })
    end

    it 'parses and assigns metadata_hash safely to backing text column' do
      spec = described_class.new(title: 't', status: :draft, format: :markdown)
      spec.metadata_hash = { source: 'test', version: 1 }
      expect { JSON.parse(spec[:metadata]) }.not_to raise_error
      expect(spec.metadata_hash).to eq({ 'source' => 'test', 'version' => 1 })
    end
  end
end


