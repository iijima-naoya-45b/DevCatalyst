# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User::Plannable do
  let(:user) { create(:user, plan: :free) }
  
  describe '#plan_info' do
    it 'returns plan information' do
      expect(user.plan_info).to include(:name, :price, :features)
    end
    
    it 'returns correct plan name' do
      expect(user.plan_info[:name]).to eq('Free')
    end
  end
  
  describe '#plan_features' do
    it 'returns plan features' do
      features = user.plan_features
      expect(features).to include(:chat_sessions_per_month, :ai_models)
    end
  end
  
  describe '#can_use_model?' do
    context 'with free plan' do
      it 'allows gpt-4o-mini' do
        expect(user.can_use_model?('gpt-4o-mini')).to be true
      end
      
      it 'denies gpt-4o' do
        expect(user.can_use_model?('gpt-4o')).to be false
      end
    end
    
    context 'with premium plan' do
      let(:premium_user) { create(:user, plan: :premium) }
      
      it 'allows all models' do
        expect(premium_user.can_use_model?('gpt-4o-mini')).to be true
        expect(premium_user.can_use_model?('gpt-4o')).to be true
        expect(premium_user.can_use_model?('claude-3-sonnet-20240229')).to be true
      end
    end
  end
  
  describe '#upgrade_to' do
    it 'upgrades to standard plan' do
      expect(user.upgrade_to(:standard)).to be true
      expect(user.reload.plan).to eq('standard')
    end
    
    it 'cannot downgrade' do
      user.update(plan: :premium)
      expect(user.upgrade_to(:standard)).to be false
    end
    
    it 'cannot upgrade to same plan' do
      expect(user.upgrade_to(:free)).to be false
    end
  end
  
  describe '#within_chat_session_limit?' do
    context 'with free plan' do
      it 'returns true when under limit' do
        expect(user.within_chat_session_limit?).to be true
      end
      
      it 'returns false when over limit' do
        create_list(:chat_session, 51, user: user, created_at: Time.current)
        expect(user.within_chat_session_limit?).to be false
      end
    end
    
    context 'with premium plan' do
      let(:premium_user) { create(:user, plan: :premium) }
      
      it 'always returns true' do
        create_list(:chat_session, 1000, user: premium_user)
        expect(premium_user.within_chat_session_limit?).to be true
      end
    end
  end
  
  describe '#can_access_feature?' do
    it 'allows basic features for all plans' do
      expect(user.can_access_feature?(:basic_features)).to be true
    end
    
    it 'denies advanced features for free plan' do
      expect(user.can_access_feature?(:advanced_features)).to be false
    end
    
    it 'allows advanced features for standard plan' do
      user.update(plan: :standard)
      expect(user.can_access_feature?(:advanced_features)).to be true
    end
    
    it 'denies premium features for standard plan' do
      user.update(plan: :standard)
      expect(user.can_access_feature?(:premium_features)).to be false
    end
    
    it 'allows premium features for premium plan' do
      user.update(plan: :premium)
      expect(user.can_access_feature?(:premium_features)).to be true
    end
  end
end
