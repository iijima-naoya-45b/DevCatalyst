# frozen_string_literal: true

ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

require "bundler/setup" # Set up gems listed in the Gemfile.
require "bootsnap/setup" # Speed up boot time by caching expensive operations.

rails_environment = ENV["RAILS_ENV"] || ENV["RACK_ENV"] || "development"

if ["development", "test"].include?(rails_environment)
  begin
    require "dotenv"

    Dotenv.load(
      File.expand_path("../.env.local", __dir__),
      File.expand_path("../.env.#{rails_environment}", __dir__),
      File.expand_path("../.env", __dir__)
    )
  rescue LoadError => e
    warn "Dotenv could not be loaded in config/boot.rb: #{e.class} #{e.message}"
  end
end
