# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserConsent, type: :model do
  let(:user) { create(:user) }
  
  describe 'associations' do
    it { should belong_to(:user) }
  end
  
  describe 'validations' do
    subject { build(:user_consent, user: user) }
    
    it { should validate_presence_of(:consent_type) }
    it { should validate_presence_of(:version) }
    it { should validate_presence_of(:consented_at) }
    it { should validate_presence_of(:ip_address) }
    it { should validate_presence_of(:user_agent) }
    
    it 'validates uniqueness of consent_type scoped to user' do
      create(:user_consent, user: user, consent_type: :terms_of_service)
      duplicate = build(:user_consent, user: user, consent_type: :terms_of_service)
      
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:consent_type]).to be_present
    end
  end
  
  describe 'enums' do
    it 'defines consent_type enum' do
      expect(UserConsent.consent_types.keys).to include(
        'terms_of_service', 'privacy_policy', 'data_processing',
        'marketing', 'analytics', 'cookies'
      )
    end
  end
  
  describe 'scopes' do
    let!(:active_consent) { create(:user_consent, user: user, revoked_at: nil) }
    let!(:revoked_consent) { create(:user_consent, user: user, consent_type: :privacy_policy, revoked_at: 1.day.ago) }
    
    describe '.active' do
      it 'returns only active consents' do
        expect(UserConsent.active).to include(active_consent)
        expect(UserConsent.active).not_to include(revoked_consent)
      end
    end
    
    describe '.revoked' do
      it 'returns only revoked consents' do
        expect(UserConsent.revoked).to include(revoked_consent)
        expect(UserConsent.revoked).not_to include(active_consent)
      end
    end
  end
  
  describe '#revoke!' do
    let(:consent) { create(:user_consent, user: user) }
    
    it 'sets revoked_at timestamp' do
      expect { consent.revoke! }.to change { consent.revoked_at }.from(nil)
    end
  end
  
  describe '#active?' do
    it 'returns true when not revoked' do
      consent = create(:user_consent, user: user, revoked_at: nil)
      expect(consent.active?).to be true
    end
    
    it 'returns false when revoked' do
      consent = create(:user_consent, user: user, revoked_at: 1.day.ago)
      expect(consent.active?).to be false
    end
  end
  
  describe '#expired?' do
    it 'returns true when consented more than 2 years ago' do
      consent = create(:user_consent, user: user, consented_at: 3.years.ago)
      expect(consent.expired?).to be true
    end
    
    it 'returns false when consented less than 2 years ago' do
      consent = create(:user_consent, user: user, consented_at: 1.year.ago)
      expect(consent.expired?).to be false
    end
  end
end
