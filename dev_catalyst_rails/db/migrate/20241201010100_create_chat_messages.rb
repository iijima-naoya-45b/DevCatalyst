class CreateChatMessages < ActiveRecord::Migration[8.0]
  def change
    create_table :chat_messages do |t|
      t.references :chat_session, null: false, foreign_key: true
      t.string :sender_role, null: false
      t.text :content, null: false
      t.json :metadata, null: false, default: {}
      t.integer :token_count, null: true
      t.boolean :cached_response, null: false, default: false
      t.datetime :responded_at, null: true

      t.timestamps
    end

    add_index :chat_messages, [:chat_session_id, :created_at], name: "index_chat_messages_on_session_and_created_at"
    add_index :chat_messages, :sender_role
  end
end

