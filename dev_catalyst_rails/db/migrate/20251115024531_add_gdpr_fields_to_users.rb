class AddGdprFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :deleted_at, :datetime
    add_column :users, :data_processing_consent, :boolean, default: false
    add_column :users, :marketing_consent, :boolean, default: false
    add_column :users, :last_data_export_at, :datetime
    
    add_index :users, :deleted_at
    add_index :users, :data_processing_consent
  end
end
