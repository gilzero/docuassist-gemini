import { Header } from '@/components/Header';
import { DocumentAnalysis } from '@/features/document-analysis/DocumentAnalysis';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-gray-900 dark:to-gray-800">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          <Header />
          <DocumentAnalysis />
        </div>
      </div>
    </div>
  );
};

export default Index;