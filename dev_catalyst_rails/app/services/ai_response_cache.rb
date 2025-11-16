# frozen_string_literal: true

require "json"
require "digest"

class AiResponseCache
  CACHE_NAMESPACE = "ai_response_cache"
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
  rescue JSON::ParserError => e
    Rails.logger.warn "AiResponseCache#read: JSON::ParserError for key=#{cacheKey}. Message=#{e.message}"
    nil
  rescue StandardError => e
    Rails.logger.warn "AiResponseCache#read: Unexpected #{e.class} for key=#{cacheKey}. Message=#{e.message}"
    nil
  end

  def write(cacheKey, value)
    return unless redisAvailable?

    serializedValue = value.to_json
    @redisClient.setex(cacheKey, @ttlSeconds, serializedValue)
  rescue StandardError => e
    Rails.logger.warn "AiResponseCache#write: Failed to cache response for key=#{cacheKey}. Error=#{e.class} Message=#{e.message}"
  end

  private

  def normalizePayload(payload)
    payload.deep_dup.tap do |duplicated|
      duplicated[:messages] = Array(duplicated[:messages]).map do |message|
        {
          role: message[:role] || message["role"],
          content: message[:content] || message["content"]
        }
      end
    end
  end

  def defaultRedisClient
    return NullRedisClient.new unless defined?(Redis)

    if Redis.respond_to?(:current)
      current = begin
        Redis.current
      rescue StandardError
        nil
      end
      return current if current
    end

    redisUrl = ENV.fetch("REDIS_URL", nil)
    return NullRedisClient.new if redisUrl.blank?

    Redis.new(url: redisUrl)
  rescue StandardError => e
    Rails.logger.warn "AiResponseCache#defaultRedisClient: Redis is unavailable. #{e.class} #{e.message}"
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
