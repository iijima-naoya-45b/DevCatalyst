# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Gdpr::DataExportService do
  let(:user) { create(:user) }
  let(:service) { described_class.new(user) }
  
  describe '#export_all_data' do
    it 'exports user profile data' do
      data = service.export_all_data
      
      expect(data[:profile][:email]).to eq(user.email)
      expect(data[:profile][:name]).to eq(user.name)
      expect(data[:profile][:plan]).to eq(user.plan)
    end
    
    it 'includes metadata' do
      data = service.export_all_data
      
      expect(data[:metadata]).to include(:export_date, :user_id, :format_version, :gdpr_compliant)
      expect(data[:metadata][:gdpr_compliant]).to be true
    end
    
    context 'with chat sessions' do
      before do
        session = create(:chat_session, user: user)
        create(:chat_message, chat_session: session, sender_role: 'user', content: 'Hello')
        create(:chat_message, chat_session: session, sender_role: 'aria', content: 'Hi there!')
      end
      
      it 'exports chat data' do
        data = service.export_all_data
        
        expect(data[:chat_data].size).to eq(1)
        expect(data[:chat_data].first[:messages].size).to eq(2)
      end
    end
    
    context 'with consents' do
      before do
        create(:user_consent, user: user, consent_type: :terms_of_service)
        create(:user_consent, user: user, consent_type: :privacy_policy)
      end
      
      it 'exports consent data' do
        data = service.export_all_data
        
        expect(data[:consents].size).to eq(2)
        expect(data[:consents].first).to include(:type, :version, :consented_at, :active)
      end
    end
    
    it 'includes activity log' do
      data = service.export_all_data
      
      expect(data[:activity_log]).to include(:total_chat_sessions, :total_messages)
    end
  end
  
  describe '#generate_export_file' do
    it 'generates a JSON file' do
      export = service.generate_export_file
      
      expect(export[:filename]).to match(/user_data_\d+_\d{4}-\d{2}-\d{2}\.json/)
      expect(export[:content_type]).to eq('application/json')
      expect(export[:content]).to be_present
    end
    
    it 'generates valid JSON' do
      export = service.generate_export_file
      
      expect { JSON.parse(export[:content]) }.not_to raise_error
    end
  end
end
