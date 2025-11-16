# frozen_string_literal: true

module Rack
  class Attack
    ### Configure Cache ###

    # If you don't want to use Rails.cache (Rack::Attack's default), then
    # configure it here.
    #
    # Note: The store is only used for throttling (not blocklisting and
    # safelisting). It must implement .increment and .write like
    # ActiveSupport::Cache::Store

    Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new if Rails.env.test?

    ### Throttle Spammy Clients ###

    # If any single client IP is making tons of requests, then they're
    # probably malicious or a poorly-configured scraper. Either way, they
    # don't deserve to hog all of the app server's CPU. Cut them off!
    #
    # Note: If you're serving assets through rack, those requests may be
    # counted by rack-attack and this throttle may be activated too
    # quickly. If so, enable the condition to exclude them from tracking.

    # Throttle all requests by IP (60rpm)
    throttle("req/ip", limit: 300, period: 5.minutes) do |req|
      req.ip unless req.path.start_with?("/assets")
    end

    ### Prevent Brute-Force Login Attacks ###

    # The most common brute-force login attack is a brute-force password
    # attack where an attacker simply tries a large number of emails and
    # passwords to see if any credentials match.
    #
    # Another common method of attack is to use a swarm of computers with
    # different IPs to try brute-forcing a password for a specific account.

    # Throttle POST requests to /api/auth/login by IP address
    throttle("auth/ip", limit: 5, period: 1.minute) do |req|
      req.ip if req.path == "/api/auth/login" && req.post?
    end

    # Throttle POST requests to /api/auth/register by IP address
    throttle("register/ip", limit: 3, period: 1.hour) do |req|
      req.ip if req.path == "/api/auth/register" && req.post?
    end

    # Throttle POST requests to /api/auth/forgot_password by IP address
    throttle("forgot_password/ip", limit: 3, period: 1.hour) do |req|
      req.ip if req.path == "/api/v1/auth/forgot_password" && req.post?
    end

    ### Custom Throttle Response ###

    # By default, Rack::Attack returns an HTTP 429 for throttled responses,
    # which is just fine.
    #
    # If you want to return 503 so that the attacker might be fooled into
    # believing that they've successfully broken your app (or you just want to
    # customize the response), then uncomment these lines.
    self.throttled_responder = lambda do |env|
      match_data = env["rack.attack.match_data"]
      now = match_data[:epoch_time]

      headers = {
        "Content-Type" => "application/json",
        "X-RateLimit-Limit" => match_data[:limit].to_s,
        "X-RateLimit-Remaining" => "0",
        "X-RateLimit-Reset" => (now + (match_data[:period] - (now % match_data[:period]))).to_s
      }

      body = {
        success: false,
        error: "Rate limit exceeded. Please try again later.",
        code: "RATE_LIMIT_EXCEEDED",
        retry_after: match_data[:period] - (now % match_data[:period])
      }.to_json

      [429, headers, [body]]
    end

    ### Logging ###

    ActiveSupport::Notifications.subscribe("rack.attack") do |_name, _start, _finish, _request_id, payload|
      req = payload[:request]

      if [:throttle, :blocklist].include?(req.env["rack.attack.match_type"])
        Rails.logger.warn "[Rack::Attack] #{req.env['rack.attack.match_type']} #{req.ip} #{req.request_method} #{req.fullpath}"
      end
    end

    ### API Throttling ###

    # Throttle API requests by IP
    throttle("api/ip", limit: 100, period: 1.minute) do |req|
      req.ip if req.path.start_with?("/api/")
    end

    # Throttle AI chat requests more strictly
    throttle("ai/ip", limit: 20, period: 1.minute) do |req|
      req.ip if req.path.start_with?("/api/v1/ai/")
    end

    # Throttle by authenticated user (if available)
    throttle("api/user", limit: 300, period: 5.minutes) do |req|
      if req.path.start_with?("/api/") && req.env["HTTP_AUTHORIZATION"].present?
        # Extract user from JWT token
        token = req.env["HTTP_AUTHORIZATION"].split.last
        begin
          payload = JWT.decode(token, ENV["JWT_SECRET_KEY"] || Rails.application.secret_key_base).first
          payload["user_id"]
        rescue JWT::DecodeError, JWT::ExpiredSignature
          nil
        end
      end
    end

    ### Blocklist & Safelist ###

    # Always allow requests from localhost
    # (blocklist & throttles are skipped)
    safelist("allow from localhost") do |req|
      # Requests are allowed if the return value is truthy
      ["127.0.0.1", "::1"].include?(req.ip)
    end

    # Block suspicious requests
    blocklist("block suspicious requests") do |_req|
      # Block requests with suspicious user agents

      # suspicious_user_agents.any? { |ua| req.user_agent&.include?(ua) }
      false # Disabled by default
    end
  end
end
