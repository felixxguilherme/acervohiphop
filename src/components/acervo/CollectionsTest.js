'use client';
import { useState, useEffect } from 'react';
import { getInformationObjects } from '@/services/atomApi';

// AIDEV-NOTE: Test component to understand real collections structure vs deduction
export default function CollectionsTest() {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      try {
        console.log('🧪 Testing Collections Discovery...');
        
        // Test 1: All items
        console.log('📋 Test 1: All items');
        const allItems = await getInformationObjects({ limit: 50, sort: 'alphabetic' });
        
        // Test 2: Top level descriptions only
        console.log('📚 Test 2: Top Level Descriptions (topLod=1)');
        const topLevel = await getInformationObjects({ 
          topLod: true, 
          limit: 50, 
          sort: 'alphabetic' 
        });
        
        // Analysis
        const itemsWithParents = allItems.results?.filter(item => item.parent) || [];
        const itemsWithoutParents = allItems.results?.filter(item => !item.parent) || [];
        
        const results = {
          allItems: {
            total: allItems.total,
            received: allItems.results?.length || 0,
            items: allItems.results?.slice(0, 3) || []
          },
          topLevel: {
            total: topLevel.total,
            received: topLevel.results?.length || 0,
            items: topLevel.results?.slice(0, 5) || []
          },
          hierarchy: {
            itemsWithParents: itemsWithParents.length,
            itemsWithoutParents: itemsWithoutParents.length,
            childrenItems: itemsWithParents.slice(0, 3),
            perfectHierarchy: topLevel.total + itemsWithParents.length === allItems.total
          }
        };
        
        console.log('🔍 Analysis Results:', results);
        setTestResults(results);
        
      } catch (error) {
        console.error('❌ Error testing collections:', error);
        setTestResults({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-yellow-100 border-2 border-black">
        <div className="text-center">
          <div className="text-2xl font-dirty-stains mb-4">🧪 TESTANDO COLEÇÕES</div>
          <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  if (testResults?.error) {
    return (
      <div className="p-8 bg-red-100 border-2 border-red-500">
        <div className="text-2xl font-dirty-stains mb-4 text-red-700">❌ ERRO NO TESTE</div>
        <div className="font-mono text-sm text-red-600">{testResults.error}</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-dirty-stains mb-4">🧪 TESTE DE COLEÇÕES</h2>
        <p className="font-sometype-mono text-sm">
          Comparando dedução vs endpoint real de coleções
        </p>
      </div>

      {/* Test Results */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* All Items */}
        <div className="bg-white border-2 border-black p-6">
          <h3 className="text-xl font-dirty-stains mb-4 text-black">📋 TODOS OS ITENS</h3>
          <div className="space-y-2 text-sm font-mono">
            <div><strong>Total na API:</strong> {testResults.allItems.total}</div>
            <div><strong>Recebidos:</strong> {testResults.allItems.received}</div>
          </div>
          
          <div className="mt-4">
            <div className="text-xs font-bold mb-2 uppercase">Primeiros 3 itens:</div>
            {testResults.allItems.items.map((item, i) => (
              <div key={i} className="text-xs border-b border-gray-200 py-1">
                <div><strong>{item.title}</strong></div>
                <div className="text-gray-600">
                  Level: {item.level_of_description} | 
                  Parent: {item.parent ? 'Sim' : 'Não'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Level Only */}
        <div className="bg-white border-2 border-black p-6">
          <h3 className="text-xl font-dirty-stains mb-4 text-black">📚 TOP LEVEL (topLod=1)</h3>
          <div className="space-y-2 text-sm font-mono">
            <div><strong>Total:</strong> {testResults.topLevel.total}</div>
            <div><strong>Recebidos:</strong> {testResults.topLevel.received}</div>
          </div>
          
          <div className="mt-4">
            <div className="text-xs font-bold mb-2 uppercase">Coleções reais:</div>
            {testResults.topLevel.items.map((item, i) => (
              <div key={i} className="text-xs border-b border-gray-200 py-1">
                <div><strong>{item.title}</strong></div>
                <div className="text-gray-600">
                  {item.reference_code} | {item.level_of_description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hierarchy Analysis */}
      <div className="bg-black border-2 border-black p-6 text-white">
        <h3 className="text-xl font-dirty-stains mb-4">🔍 ANÁLISE DE HIERARQUIA</h3>
        
        <div className="grid md:grid-cols-3 gap-6 text-sm font-mono">
          <div>
            <div className="text-yellow-400 font-bold mb-2">CONTADORES:</div>
            <div>Todos os itens: {testResults.allItems.total}</div>
            <div>Top Level: {testResults.topLevel.total}</div>
            <div>Com parent: {testResults.hierarchy.itemsWithParents}</div>
            <div>Sem parent: {testResults.hierarchy.itemsWithoutParents}</div>
          </div>
          
          <div>
            <div className="text-yellow-400 font-bold mb-2">VERIFICAÇÃO:</div>
            <div>TopLevel + Children = {testResults.topLevel.total + testResults.hierarchy.itemsWithParents}</div>
            <div>Total real = {testResults.allItems.total}</div>
            <div className={`font-bold ${testResults.hierarchy.perfectHierarchy ? 'text-green-400' : 'text-red-400'}`}>
              {testResults.hierarchy.perfectHierarchy ? '✅ HIERARQUIA PERFEITA' : '⚠️ HIERARQUIA INCONSISTENTE'}
            </div>
          </div>
          
          <div>
            <div className="text-yellow-400 font-bold mb-2">CONCLUSÃO:</div>
            <div className="text-xs">
              {testResults.hierarchy.perfectHierarchy 
                ? 'topLod=1 nos dá as COLEÇÕES REAIS. Não precisamos deduzir!'
                : 'Há inconsistência na estrutura hierárquica. Investigar mais.'
              }
            </div>
          </div>
        </div>

        {/* Child Items Sample */}
        {testResults.hierarchy.childrenItems.length > 0 && (
          <div className="mt-6">
            <div className="text-yellow-400 font-bold mb-2">EXEMPLOS DE ITENS FILHOS:</div>
            {testResults.hierarchy.childrenItems.map((child, i) => (
              <div key={i} className="text-xs border-l-2 border-yellow-400 pl-2 mb-1">
                <div>{child.title}</div>
                <div className="text-gray-400">Parent: {child.parent}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendation */}
      <div className={`p-6 border-2 ${testResults.hierarchy.perfectHierarchy ? 'bg-green-100 border-green-500' : 'bg-yellow-100 border-yellow-500'}`}>
        <h3 className="text-xl font-dirty-stains mb-4">💡 RECOMENDAÇÃO</h3>
        <div className="font-sometype-mono text-sm">
          {testResults.hierarchy.perfectHierarchy ? (
            <div>
              <p><strong>✅ Usar topLod=1 para coleções reais!</strong></p>
              <p>A API tem estrutura hierárquica perfeita. Podemos substituir a lógica de dedução por:</p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li><code>topLod=1</code> → Coleções de nível superior ({testResults.topLevel.total} itens)</li>
                <li>Items com <code>parent</code> → Itens filhos ({testResults.hierarchy.itemsWithParents} itens)</li>
                <li>Navegação por slug do parent → Detalhes da coleção</li>
              </ul>
            </div>
          ) : (
            <div>
              <p><strong>⚠️ Investigar estrutura!</strong></p>
              <p>A hierarquia não fecha perfeitamente. Verificar se há itens órfãos ou múltiplos níveis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}