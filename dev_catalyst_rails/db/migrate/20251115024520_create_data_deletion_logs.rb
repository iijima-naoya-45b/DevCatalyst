class CreateDataDeletionLogs < ActiveRecord::Migration[8.0]
  def change
    create_table :data_deletion_logs do |t|
      t.integer :user_id, null: false
      t.string :email
      t.string :deletion_type, null: false
      t.text :reason
      t.datetime :requested_at, null: false
      t.datetime :completed_at
      t.string :status, null: false
      t.json :deleted_data_summary

      t.timestamps
    end
    
    add_index :data_deletion_logs, :user_id
    add_index :data_deletion_logs, :status
    add_index :data_deletion_logs, :requested_at
  end
end
