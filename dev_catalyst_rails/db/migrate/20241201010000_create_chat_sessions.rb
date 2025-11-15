class CreateChatSessions < ActiveRecord::Migration[8.0]
  def change
    create_table :chat_sessions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: true
      t.json :metadata, null: false, default: {}
      t.boolean :archived, null: false, default: false
      t.datetime :last_interacted_at, null: false

      t.timestamps
    end

    add_index :chat_sessions, [:user_id, :last_interacted_at], name: "index_chat_sessions_on_user_and_last_interacted"
    add_index :chat_sessions, :archived
  end
end

