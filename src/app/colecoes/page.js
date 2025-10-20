'use client';

import HeaderApp from '@/components/html/HeaderApp';
import CollectionViewer from '@/components/acervo/CollectionViewer';

export default function ColecoesPage() {
  return (
    <main className="min-h-screen bg-black">
      <HeaderApp title="COLEÇÕES" showTitle={true} />
      <CollectionViewer />
    </main>
  );
}