// Test script to understand real collections structure
const { getInformationObjects } = require('./src/services/atomApi.js');

async function testCollectionsEndpoint() {
  console.log('🧪 Testing Collections Discovery...\n');
  
  try {
    // Test 1: All items
    console.log('📋 Test 1: All items');
    const allItems = await getInformationObjects({ limit: 50, sort: 'alphabetic' });
    console.log(`Total items: ${allItems.total}`);
    console.log(`Items received: ${allItems.results?.length}`);
    console.log('');
    
    // Test 2: Top level descriptions only (should be actual collections)
    console.log('📚 Test 2: Top Level Descriptions (topLod=1)');
    const topLevel = await getInformationObjects({ 
      topLod: true, 
      limit: 50, 
      sort: 'alphabetic' 
    });
    console.log(`Top level items: ${topLevel.total}`);
    console.log(`Items received: ${topLevel.results?.length}`);
    
    if (topLevel.results && topLevel.results.length > 0) {
      console.log('\n🏛️ Top Level Items (Potential Collections):');
      topLevel.results.slice(0, 5).forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`   - Slug: ${item.slug}`);
        console.log(`   - Level: ${item.level_of_description}`);
        console.log(`   - Ref Code: ${item.reference_code || 'N/A'}`);
        console.log(`   - Has Parent: ${item.parent ? 'Yes' : 'No'}`);
        console.log('');
      });
    }
    
    // Test 3: Items with parents (children items)
    console.log('👶 Test 3: Items with parents');
    const itemsWithParents = allItems.results?.filter(item => item.parent) || [];
    console.log(`Items with parents: ${itemsWithParents.length}`);
    
    if (itemsWithParents.length > 0) {
      console.log('\n📎 Child Items:');
      itemsWithParents.slice(0, 3).forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`   - Parent: ${item.parent}`);
        console.log(`   - Level: ${item.level_of_description}`);
        console.log('');
      });
    }
    
    // Test 4: Compare topLod vs all items
    console.log('🔍 Analysis:');
    console.log(`All items: ${allItems.total}`);
    console.log(`Top level: ${topLevel.total}`);
    console.log(`Items with parents: ${itemsWithParents.length}`);
    console.log(`Calculation check: ${topLevel.total} + ${itemsWithParents.length} = ${topLevel.total + itemsWithParents.length}`);
    
    if (topLevel.total + itemsWithParents.length === allItems.total) {
      console.log('✅ Perfect hierarchy: TopLevel + Children = All Items');
    } else {
      console.log('⚠️  Hierarchy doesn\'t add up - investigating...');
    }
    
  } catch (error) {
    console.error('❌ Error testing collections:', error);
  }
}

// Run the test
testCollectionsEndpoint();