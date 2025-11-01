class CreateRefreshTokens < ActiveRecord::Migration[8.0]
  def change
    create_table :refresh_tokens do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.string :token_hash, null: false
      t.datetime :expires_at, null: false
      t.boolean :is_revoked, null: false, default: false

      t.timestamps null: false
    end

    # インデックス
    add_index :refresh_tokens, :user_id
    add_index :refresh_tokens, :token_hash, unique: true
    add_index :refresh_tokens, :expires_at
    add_index :refresh_tokens, :is_revoked
  end
end