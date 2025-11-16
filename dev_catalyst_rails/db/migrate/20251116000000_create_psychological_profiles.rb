class CreatePsychologicalProfiles < ActiveRecord::Migration[7.1]
  def change
    create_table :psychological_profiles do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.integer :cognitive_load_level, null: false, default: 5
      t.integer :self_efficacy_score, null: false, default: 50
      # SQLite では配列型が無いため text で保持（アプリ側で配列として扱う）
      t.text :bias_awareness
      t.text :motivation_factors
      t.string :learning_style, limit: 50
      t.integer :risk_tolerance, null: false, default: 5

      t.timestamps
    end
  end
end


