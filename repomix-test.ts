// repomix-test.ts
// Test

import { RepomixFetcher } from './repomix';

// Skip main function in repomix.ts
process.argv = [process.argv[0], process.argv[1], 'dummy-arg']; 

async function runTest() {
  try {
    // Create fetcher instance
    const fetcher = new RepomixFetcher('output-test');

    const repoOptions = {
      remoteUrl: 'https://github.com/Summer-project-25-AI-Feedback-system/AI-Feedback-System.git', // <-- Your desired GitHub repository URL here
      style: 'xml' as const,
      outputFile: 'output/AI-Feedback-System.xml',
      verbose: true,
      ignore: 'node_modules/',
    };

    console.log('Starting repository fetch...');
    const xmlResult = await fetcher.fetchRepositoryAsXml(repoOptions);
    console.log('Repository fetched and saved successfully!');
    console.log('XML result:', xmlResult);
  } catch (error) {
    console.error('Error fetching repository:', error);
  }
}

runTest();