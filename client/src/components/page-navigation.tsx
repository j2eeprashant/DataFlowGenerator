
import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface GeneratedPage {
  route: string;
  name: string;
  timestamp: number;
}

export function PageNavigation() {
  const [pages, setPages] = useState<GeneratedPage[]>([]);

  useEffect(() => {
    // Load generated pages from localStorage or API
    const savedPages = localStorage.getItem('generatedPages');
    if (savedPages) {
      setPages(JSON.parse(savedPages));
    }
  }, []);

  const addPage = (route: string, name: string) => {
    const newPage = {
      route,
      name,
      timestamp: Date.now()
    };
    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    localStorage.setItem('generatedPages', JSON.stringify(updatedPages));
  };

  const removePage = (route: string) => {
    const updatedPages = pages.filter(page => page.route !== route);
    setPages(updatedPages);
    localStorage.setItem('generatedPages', JSON.stringify(updatedPages));
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm">Generated Pages</CardTitle>
      </CardHeader>
      <CardContent>
        {pages.length === 0 ? (
          <p className="text-sm text-gray-500">No generated pages yet</p>
        ) : (
          <div className="space-y-2">
            {pages.map((page) => (
              <div key={page.route} className="flex items-center justify-between">
                <Link href={page.route}>
                  <Button variant="ghost" size="sm" className="text-left">
                    {page.name}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePage(page.route)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Export function to add pages from other components
export const addGeneratedPage = (route: string, name: string) => {
  const savedPages = localStorage.getItem('generatedPages');
  const pages = savedPages ? JSON.parse(savedPages) : [];
  const newPage = { route, name, timestamp: Date.now() };
  const updatedPages = [...pages, newPage];
  localStorage.setItem('generatedPages', JSON.stringify(updatedPages));
  window.dispatchEvent(new CustomEvent('pagesUpdated'));
};
