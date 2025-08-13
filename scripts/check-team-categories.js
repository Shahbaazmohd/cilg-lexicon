// Script to check current team member categories
// Run this to see what categories exist before running the migration

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: 'ad.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTeamCategories() {
  try {
    console.log('Checking current team member categories...\n');
    
    // Get all team members
    const { data: teamMembers, error } = await supabase
      .from('team_members')
      .select('id, name, category')
      .order('category');

    if (error) {
      console.error('Error fetching team members:', error);
      return;
    }

    if (!teamMembers || teamMembers.length === 0) {
      console.log('No team members found in the database.');
      return;
    }

    // Group by category
    const categories = {};
    teamMembers.forEach(member => {
      if (!categories[member.category]) {
        categories[member.category] = [];
      }
      categories[member.category].push(member.name);
    });

    console.log('Current team member categories:');
    console.log('===============================\n');
    
    Object.entries(categories).forEach(([category, names]) => {
      console.log(`${category}:`);
      names.forEach(name => console.log(`  - ${name}`));
      console.log('');
    });

    console.log(`Total team members: ${teamMembers.length}`);
    console.log(`Total categories: ${Object.keys(categories).length}`);

    // Show any members with null or undefined categories
    const invalidMembers = teamMembers.filter(member => !member.category);
    if (invalidMembers.length > 0) {
      console.log('\n⚠️  Members with invalid categories:');
      invalidMembers.forEach(member => {
        console.log(`  - ${member.name} (ID: ${member.id})`);
      });
    }

    // Show all categories found
    console.log('\n📋 All categories found:');
    Object.keys(categories).forEach(category => {
      console.log(`  - ${category}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

checkTeamCategories();
