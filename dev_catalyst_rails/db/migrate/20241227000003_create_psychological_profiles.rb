class CreatePsychologicalProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :psychological_profiles do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.integer :cognitive_load_level, null: false, default: 5
      t.integer :self_efficacy_score, null: false, default: 50
      t.text :bias_awareness, array: true, default: []
      t.text :motivation_factors, array: true, default: []
      t.string :learning_style, limit: 50
      t.integer :risk_tolerance, null: false, default: 5

      t.timestamps null: false
    end

    # インデックス
    add_index :psychological_profiles, :user_id, unique: true
    add_index :psychological_profiles, :cognitive_load_level
    add_index :psychological_profiles, :self_efficacy_score

    # 制約
    execute <<-SQL
      ALTER TABLE psychological_profiles ADD CONSTRAINT check_cognitive_load_range 
      CHECK (cognitive_load_level >= 1 AND cognitive_load_level <= 10);

      ALTER TABLE psychological_profiles ADD CONSTRAINT check_self_efficacy_range 
      CHECK (self_efficacy_score >= 1 AND self_efficacy_score <= 100);

      ALTER TABLE psychological_profiles ADD CONSTRAINT check_risk_tolerance_range 
      CHECK (risk_tolerance >= 1 AND risk_tolerance <= 10);

      ALTER TABLE psychological_profiles ADD CONSTRAINT check_learning_style_values 
      CHECK (learning_style IS NULL OR learning_style IN ('visual', 'auditory', 'kinesthetic', 'reading_writing', 'multimodal'));
    SQL
  end
end