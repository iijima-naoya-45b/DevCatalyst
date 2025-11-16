# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_11_15_064027) do
  create_table "chat_messages", force: :cascade do |t|
    t.integer "chat_session_id", null: false
    t.string "sender_role", null: false
    t.text "content", null: false
    t.json "metadata", default: {}, null: false
    t.integer "token_count"
    t.boolean "cached_response", default: false, null: false
    t.datetime "responded_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chat_session_id", "created_at"], name: "index_chat_messages_on_session_and_created_at"
    t.index ["chat_session_id"], name: "index_chat_messages_on_chat_session_id"
    t.index ["sender_role"], name: "index_chat_messages_on_sender_role"
  end

  create_table "chat_sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "title"
    t.json "metadata", default: {}, null: false
    t.boolean "archived", default: false, null: false
    t.datetime "last_interacted_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["archived"], name: "index_chat_sessions_on_archived"
    t.index ["user_id", "last_interacted_at"], name: "index_chat_sessions_on_user_and_last_interacted"
    t.index ["user_id"], name: "index_chat_sessions_on_user_id"
  end

  create_table "data_deletion_logs", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "email"
    t.string "deletion_type", null: false
    t.text "reason"
    t.datetime "requested_at", null: false
    t.datetime "completed_at"
    t.string "status", null: false
    t.json "deleted_data_summary"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["requested_at"], name: "index_data_deletion_logs_on_requested_at"
    t.index ["status"], name: "index_data_deletion_logs_on_status"
    t.index ["user_id"], name: "index_data_deletion_logs_on_user_id"
  end

  create_table "spec_sections", force: :cascade do |t|
    t.integer "spec_id", null: false
    t.integer "section_type", null: false
    t.string "title"
    t.text "content"
    t.integer "order", default: 0, null: false
    t.boolean "is_completed", default: false, null: false
    t.boolean "ai_generated", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["section_type"], name: "index_spec_sections_on_section_type"
    t.index ["spec_id", "order"], name: "index_spec_sections_on_spec_id_and_order"
    t.index ["spec_id"], name: "index_spec_sections_on_spec_id"
  end

  create_table "specs", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "chat_session_id"
    t.string "title"
    t.text "description"
    t.integer "status", default: 0, null: false
    t.integer "format", default: 1, null: false
    t.text "content"
    t.text "markdown_content"
    t.string "notion_page_id"
    t.integer "completion_percentage", default: 0
    t.text "metadata"
    t.datetime "exported_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chat_session_id"], name: "index_specs_on_chat_session_id"
    t.index ["format"], name: "index_specs_on_format"
    t.index ["status"], name: "index_specs_on_status"
    t.index ["user_id", "created_at"], name: "index_specs_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_specs_on_user_id"
  end

  create_table "user_consents", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "consent_type", null: false
    t.string "version", null: false
    t.datetime "consented_at", null: false
    t.datetime "revoked_at"
    t.string "ip_address"
    t.text "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["consent_type"], name: "index_user_consents_on_consent_type"
    t.index ["consented_at"], name: "index_user_consents_on_consented_at"
    t.index ["user_id", "consent_type"], name: "index_user_consents_on_user_id_and_consent_type", unique: true
    t.index ["user_id"], name: "index_user_consents_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "name", null: false
    t.string "avatar_url"
    t.integer "plan", default: 0, null: false
    t.string "provider"
    t.string "uid"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.boolean "data_processing_consent", default: false
    t.boolean "marketing_consent", default: false
    t.datetime "last_data_export_at"
    t.index ["data_processing_consent"], name: "index_users_on_data_processing_consent"
    t.index ["deleted_at"], name: "index_users_on_deleted_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["provider", "uid"], name: "index_users_on_provider_and_uid", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "chat_messages", "chat_sessions"
  add_foreign_key "chat_sessions", "users"
  add_foreign_key "spec_sections", "specs"
  add_foreign_key "specs", "chat_sessions"
  add_foreign_key "specs", "users"
  add_foreign_key "user_consents", "users"
end
