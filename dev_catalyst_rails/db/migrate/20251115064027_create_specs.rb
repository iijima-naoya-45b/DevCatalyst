class CreateSpecs < ActiveRecord::Migration[8.0]
  def change
    create_table :specs do |t|
      t.references :user, null: false, foreign_key: true
      t.references :chat_session, null: true, foreign_key: true
      t.string :title
      t.text :description
      t.integer :status, default: 0, null: false
      t.integer :format, default: 1, null: false
      t.text :content  # JSON形式で保存（SQLite対応）
      t.text :markdown_content
      t.string :notion_page_id
      t.integer :completion_percentage, default: 0
      t.text :metadata  # JSON形式で保存（SQLite対応）
      t.datetime :exported_at

      t.timestamps
    end
    
    add_index :specs, :status
    add_index :specs, :format
    add_index :specs, [:user_id, :created_at]
  end
end
