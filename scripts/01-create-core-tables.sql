-- Step 1: Create the core assessment tables first
-- Run this script first in your Supabase SQL editor

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    email TEXT NOT NULL,
    website TEXT NOT NULL,
    overall_score INTEGER NOT NULL,
    overall_percentage INTEGER NOT NULL,
    assessment_level TEXT NOT NULL,
    level_icon TEXT NOT NULL,
    level_description TEXT NOT NULL,
    quick_win_tip TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment_answers table
CREATE TABLE IF NOT EXISTS assessment_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    category TEXT NOT NULL,
    value INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create category_scores table
CREATE TABLE IF NOT EXISTS category_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create category_recommendations table
CREATE TABLE IF NOT EXISTS category_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_score_id UUID REFERENCES category_scores(id) ON DELETE CASCADE,
    recommendation TEXT NOT NULL,
    priority_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create basic indexes
CREATE INDEX IF NOT EXISTS idx_assessments_email ON assessments(email);
CREATE INDEX IF NOT EXISTS idx_assessments_session_id ON assessments(session_id);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON assessments(completed_at);
CREATE INDEX IF NOT EXISTS idx_assessment_answers_assessment_id ON assessment_answers(assessment_id);
CREATE INDEX IF NOT EXISTS idx_category_scores_assessment_id ON category_scores(assessment_id);

-- Enable Row Level Security (RLS)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for now)
CREATE POLICY "Allow all operations on assessments" ON assessments FOR ALL USING (true);
CREATE POLICY "Allow all operations on assessment_answers" ON assessment_answers FOR ALL USING (true);
CREATE POLICY "Allow all operations on category_scores" ON category_scores FOR ALL USING (true);
CREATE POLICY "Allow all operations on category_recommendations" ON category_recommendations FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
