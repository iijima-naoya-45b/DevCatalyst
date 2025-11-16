class CreateSpecSections < ActiveRecord::Migration[8.0]
  def change
    create_table :spec_sections do |t|
      t.references :spec, null: false, foreign_key: true
      t.integer :section_type, null: false
      t.string :title
      t.text :content
      t.integer :order, default: 0, null: false
      t.boolean :is_completed, default: false, null: false
      t.boolean :ai_generated, default: true, null: false

      t.timestamps
    end
    
    add_index :spec_sections, [:spec_id, :order]
    add_index :spec_sections, :section_type
  end
end
