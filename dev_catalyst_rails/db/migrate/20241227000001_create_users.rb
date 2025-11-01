class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :password_digest, null: false

      t.timestamps null: false
    end

    # インデックス
    add_index :users, :email, unique: true
    add_index :users, :created_at

    # 制約
    execute <<-SQL
      ALTER TABLE users ADD CONSTRAINT check_email_format 
      CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');
    SQL
  end
end