require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'バリデーション' do
    let(:user) { build(:user) }

    it '有効なユーザーが作成できること' do
      expect(user).to be_valid
    end

    describe 'email' do
      it 'メールアドレスが必須であること' do
        user.email = nil
        expect(user).not_to be_valid
        expect(user.errors[:email]).to include('メールアドレスを入力してください。安全にアカウントを管理するために必要です。')
      end

      it '有効なメールアドレス形式であること' do
        user.email = 'invalid-email'
        expect(user).not_to be_valid
        expect(user.errors[:email]).to include('有効なメールアドレスを入力してください')
      end

      it 'メールアドレスが一意であること' do
        create(:user, email: 'test@example.com')
        user.email = 'test@example.com'
        expect(user).not_to be_valid
        expect(user.errors[:email]).to include('このメールアドレスは既に使用されています')
      end

      it 'メールアドレスが正規化されること' do
        user.email = '  TEST@EXAMPLE.COM  '
        user.save!
        expect(user.email).to eq('test@example.com')
      end
    end

    describe 'password' do
      it 'パスワードが必須であること' do
        user.password = nil
        expect(user).not_to be_valid
      end

      it 'パスワードが8文字以上であること' do
        user.password = 'short'
        user.password_confirmation = 'short'
        expect(user).not_to be_valid
        expect(user.errors[:password]).to include('パスワードは8文字以上で設定してください')
      end

      it 'パスワードが大文字、小文字、数字を含むこと' do
        user.password = 'onlylowercase'
        user.password_confirmation = 'onlylowercase'
        expect(user).not_to be_valid
        expect(user.errors[:password]).to include('パスワードは大文字、小文字、数字を含む必要があります')
      end

      it '有効なパスワード形式であること' do
        user.password = 'ValidPass123'
        user.password_confirmation = 'ValidPass123'
        expect(user).to be_valid
      end
    end
  end

  describe 'アソシエーション' do
    it 'refresh_tokensを持つこと' do
      association = described_class.reflect_on_association(:refresh_tokens)
      expect(association.macro).to eq(:has_many)
      expect(association.options[:dependent]).to eq(:destroy)
    end

    it 'psychological_profileを持つこと' do
      association = described_class.reflect_on_association(:psychological_profile)
      expect(association.macro).to eq(:has_one)
      expect(association.options[:dependent]).to eq(:destroy)
    end
  end

  describe 'コールバック' do
    it 'ユーザー作成時に心理学的プロファイルが作成されること' do
      user = create(:user)
      expect(user.psychological_profile).to be_present
      expect(user.psychological_profile.cognitive_load_level).to eq(5)
      expect(user.psychological_profile.self_efficacy_score).to eq(50)
    end
  end

  describe 'インスタンスメソッド' do
    let(:user) { create(:user) }

    describe '#update_psychological_state' do
      it '心理学的状態を更新できること' do
        user.update_psychological_state(
          cognitive_load_level: 8,
          self_efficacy_score: 75
        )
        
        profile = user.psychological_profile.reload
        expect(profile.cognitive_load_level).to eq(8)
        expect(profile.self_efficacy_score).to eq(75)
      end
    end

    describe '#experience_level' do
      it 'プロジェクト数に基づいて経験レベルを返すこと' do
        expect(user.user_level).to eq('newcomer')
        
        create_list(:project, 2, user: user)
        expect(user.user_level).to eq('beginner')
        
        create_list(:project, 3, user: user)
        expect(user.user_level).to eq('intermediate')
      end
    end

    describe '#friendly_error_message' do
      it '心理学的配慮のエラーメッセージを返すこと' do
        message = user.friendly_error_message(:authentication_failed)
        expect(message).to include('ログイン情報が正しくありません')
      end
    end
  end

  describe 'スコープ' do
    let!(:old_user) { create(:user, created_at: 1.week.ago) }
    let!(:new_user) { create(:user, created_at: 1.day.ago) }

    describe '.recent' do
      it '作成日時の降順で取得できること' do
        expect(User.recent.first).to eq(new_user)
        expect(User.recent.last).to eq(old_user)
      end
    end
  end
end