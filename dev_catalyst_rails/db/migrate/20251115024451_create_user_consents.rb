class CreateUserConsents < ActiveRecord::Migration[8.0]
  def change
    create_table :user_consents do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :consent_type, null: false
      t.string :version, null: false
      t.datetime :consented_at, null: false
      t.datetime :revoked_at
      t.string :ip_address
      t.text :user_agent

      t.timestamps
    end
    
    add_index :user_consents, [:user_id, :consent_type], unique: true
    add_index :user_consents, :consent_type
    add_index :user_consents, :consented_at
  end
end
