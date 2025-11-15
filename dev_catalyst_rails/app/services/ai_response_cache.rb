require 'json'
require 'digest'

class AiResponseCache
  CACHE_NAMESPACE = 'ai_response_cache'
  DEFAULT_TTL_SECONDS = 600

  def initialize(redisClient: defaultRedisClient, ttlSeconds: DEFAULT_TTL_SECONDS)
    @redisClient = redisClient
    @ttlSeconds = ttlSeconds
  end

  def generateCacheKey(userId:, payload:)
    normalizedPayload = normalizePayload(payload)
    digestSource = {
      userId: userId,
      payload: normalizedPayload
    }.to_json

    digest = Digest::SHA256.hexdigest(digestSource)
    "#{CACHE_NAMESPACE}:#{digest}"
  end

  def read(cacheKey)
    return nil unless redisAvailable?

    rawValue = @redisClient.get(cacheKey)
    return nil if rawValue.blank?

    JSON.parse(rawValue)
  rescue JSON::ParserError => error
    Rails.logger.warn "AiResponseCache#read: JSON::ParserError for key=#{cacheKey}. Message=#{error.message}"
    nil
  rescue StandardError => error
    Rails.logger.warn "AiResponseCache#read: Unexpected #{error.class} for key=#{cacheKey}. Message=#{error.message}"
    nil
  end

  def write(cacheKey, value)
    return unless redisAvailable?

    serializedValue = value.to_json
    @redisClient.setex(cacheKey, @ttlSeconds, serializedValue)
  rescue StandardError => error
    Rails.logger.warn "AiResponseCache#write: Failed to cache response for key=#{cacheKey}. Error=#{error.class} Message=#{error.message}"
  end

  private

  def normalizePayload(payload)
    payload.deep_dup.tap do |duplicated|
      duplicated[:messages] = Array(duplicated[:messages]).map do |message|
        {
          role: message[:role] || message['role'],
          content: message[:content] || message['content']
        }
      end
    end
  end

  def defaultRedisClient
    return NullRedisClient.new unless defined?(Redis)

    if Redis.respond_to?(:current)
      current = Redis.current rescue nil
      return current if current
    end

    redisUrl = ENV['REDIS_URL']
    return NullRedisClient.new if redisUrl.blank?

    Redis.new(url: redisUrl)
  rescue StandardError => error
    Rails.logger.warn "AiResponseCache#defaultRedisClient: Redis is unavailable. #{error.class} #{error.message}"
    NullRedisClient.new
  end

  def redisAvailable?
    return false unless @redisClient
    return false if @redisClient.is_a?(NullRedisClient)

    @redisClient.respond_to?(:get)
  end

  class NullRedisClient
    def method_missing(*)
      nil
    end

    def respond_to_missing?(*)
      true
    end
  end
end

