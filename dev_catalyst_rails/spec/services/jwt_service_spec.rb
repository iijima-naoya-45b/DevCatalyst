require 'rails_helper'

RSpec.describe JwtService do
  let(:user) { create(:user) }

  describe '#generate_access_token / #generate_refresh_token' do
    it 'sets fixed expirations and includes jti/iat in refresh token' do
      access = described_class.generate_access_token(user)
      refresh = described_class.generate_refresh_token(user)
      access_payload = described_class.decode(access)
      refresh_payload = described_class.decode(refresh)

      expect(access_payload['type']).to eq('access')
      expect(refresh_payload['type']).to eq('refresh')
      expect(refresh_payload['jti']).to be_present
      expect(refresh_payload['iat']).to be_present

      # expiration windows (1 day and 7 days)
      expect(access_payload['exp'] - Time.now.to_i).to be_between(23.hours.to_i, 25.hours.to_i)
      expect(refresh_payload['exp'] - Time.now.to_i).to be_between(6.days.to_i, 8.days.to_i)
    end
  end
end


