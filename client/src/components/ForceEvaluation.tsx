import { useState } from "react";

interface RepositoryInfo {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  size: number;
  has_wiki: boolean;
  has_pages: boolean;
  description?: string;
  topics?: string[];
  license?: { name: string };
  updated_at: string;
  created_at: string;
}

interface EvaluationResult {
  markdownContent: string;
  success: boolean;
  error?: string;
}

export default function ForceEvaluation(): JSX.Element {
  const [repoUrl, setRepoUrl] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [progress, setProgress] = useState(0);

  async function fetchRepositoryInfo(repoUrl: string): Promise<RepositoryInfo> {
    const cleanUrl = repoUrl.replace("https://github.com/", "").replace(".git", "");
    const [owner, repo] = cleanUrl.split("/");
    
    if (!owner || !repo) {
      throw new Error("Invalid GitHub URL format");
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: "application/vnd.github.v3+json" }
    });

    if (!response.ok) {
      throw new Error(`Repository not found: ${owner}/${repo}`);
    }

    return response.json();
  }

  function generateEvaluation(repoInfo: RepositoryInfo, repoName: string, assignmentName: string): string {
    const {
      stargazers_count: stars,
      forks_count: forks,
      open_issues_count: issues,
      language,
      size,
      has_wiki,
      has_pages,
      description,
      topics,
      license,
      updated_at,
      created_at
    } = repoInfo;

    const daysSinceUpdate = (new Date().getTime() - new Date(updated_at).getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceCreation = (new Date().getTime() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24);

    // Yksinkertaistettu pisteiden laskenta
    let score = 0;
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Kieli (0-25 pistettä)
    const languageScores: Record<string, number> = {
      TypeScript: 25, Rust: 25, Go: 24, "C++": 23, Scala: 23,
      Python: 22, Kotlin: 22, Swift: 21, Java: 21, Angular: 21,
      JavaScript: 20, "C#": 20, Dart: 20, Vue: 20, React: 20,
      PHP: 18, Ruby: 19, R: 17, MATLAB: 16, PowerShell: 16,
      Perl: 15, Shell: 14
    };
    
    score += languageScores[language] || 15;
    strengths.push(`Good ${language} implementation`);

    // Populariteetti (0-20 pistettä)
    if (stars > 1000) {
      score += 20;
      strengths.push("Extremely popular");
    } else if (stars > 100) {
      score += 15;
      strengths.push("Very popular");
    } else if (stars > 10) {
      score += 10;
      strengths.push("Popular");
    } else if (stars > 0) {
      score += 5;
      strengths.push("Has recognition");
    }

    if (forks > 100) {
      score += 15;
      strengths.push("Well-forked");
    } else if (forks > 10) {
      score += 10;
      strengths.push("Active community");
    } else if (forks > 0) {
      score += 5;
      strengths.push("Community interest");
    }

    // Koodin koko (0-15 pistettä)
    if (size > 5000) {
      score += 15;
      strengths.push("Large codebase");
    } else if (size > 1000) {
      score += 12;
      strengths.push("Substantial codebase");
    } else if (size > 100) {
      score += 8;
      strengths.push("Good size");
    } else if (size > 10) {
      score += 4;
      strengths.push("Basic codebase");
    }

    // Dokumentaatio (0-15 pistettä)
    if (has_wiki) {
      score += 10;
      strengths.push("Has wiki");
    } else {
      improvements.push("Add wiki");
    }

    if (has_pages) {
      score += 5;
      strengths.push("Has GitHub Pages");
    } else {
      improvements.push("Consider GitHub Pages");
    }

    if (description && description.length > 20) {
      score += 5;
      strengths.push("Good description");
    } else {
      improvements.push("Add description");
    }

    // Aktiivisuus (0-10 pistettä)
    if (daysSinceUpdate < 7) {
      score += 10;
      strengths.push("Recently updated");
    } else if (daysSinceUpdate < 30) {
      score += 7;
      strengths.push("Recently active");
    } else if (daysSinceUpdate < 90) {
      score += 4;
      strengths.push("Moderately active");
    } else {
      improvements.push("Update repository");
    }

    // Ylläpito (0-10 pistettä)
    if (issues === 0) {
      score += 10;
      strengths.push("No open issues");
    } else if (issues < 5) {
      score += 7;
      strengths.push("Few issues");
    } else if (issues < 20) {
      score += 3;
      strengths.push("Moderate issues");
    } else {
      score -= 5;
      improvements.push("Address open issues");
    }

    // Bonus-pisteet (0-5 pistettä)
    if (topics && topics.length > 0) {
      score += 3;
      strengths.push("Well-tagged");
    } else {
      improvements.push("Add topics");
    }

    if (license && license.name !== "Other") {
      score += 2;
      strengths.push("Proper license");
    } else {
      improvements.push("Add license");
    }

    // Normalisoi ja laske arvosana
    const normalizedScore = Math.min(100, Math.max(0, score));
    const rating = (normalizedScore / 20).toFixed(1);

    return `# AI Code Evaluation Report

## Repository: ${repoName}
## Assignment: ${assignmentName}
## Analysis Date: ${new Date().toLocaleDateString()}

### Overall Rating: ${rating}/5 ⭐

### Strengths:
${strengths.length > 0 ? strengths.map(s => `- ✅ **${s}**`).join("\n") : "- ✅ Repository analyzed"}

### Areas for Improvement:
${improvements.length > 0 ? improvements.map(i => `- **${i}**`).join("\n") : "- 🔧 Consider improvements"}

### Repository Statistics:
- **Language**: ${language}
- **Size**: ${size.toLocaleString()} KB
- **Stars**: ${stars.toLocaleString()}
- **Forks**: ${forks.toLocaleString()}
- **Open Issues**: ${issues.toLocaleString()}
- **Wiki**: ${has_wiki ? "Yes" : "No"}
- **Pages**: ${has_pages ? "Yes" : "No"}
- **Last Updated**: ${Math.floor(daysSinceUpdate)} days ago
- **Age**: ${Math.floor(daysSinceCreation)} days
- **Description**: ${description ? "Present" : "Missing"}
- **Topics**: ${topics?.join(", ") || "None"}
- **License**: ${license?.name || "None"}

### Score Breakdown:
- **Code Quality**: ${Math.min(25, Math.floor(normalizedScore * 0.25))}/25
- **Community**: ${Math.min(20, Math.floor((stars + forks) / 10))}/20
- **Documentation**: ${has_wiki ? 15 : has_pages ? 10 : 5}/20
- **Activity**: ${Math.min(15, Math.max(0, 15 - Math.floor(daysSinceUpdate / 7)))}/15
- **Maintenance**: ${Math.min(15, Math.max(0, 15 - issues))}/15
- **Bonus**: ${(topics?.length || 0) * 2 + (license ? 3 : 0)}/5

**Total Score: ${normalizedScore}/100** ��

### Summary:
This ${language} project shows ${rating >= 4 ? "excellent" : rating >= 3 ? "good" : rating >= 2 ? "basic" : "minimal"} quality with ${strengths.length} strengths and ${improvements.length} areas for improvement.

*Generated by AI Code Evaluator v3.3* 🤖`;
  }

  const handleEvaluation = async () => {
    if (!repoUrl || !organizationId || !assignmentName || evaluating) {
      alert("Täytä kaikki kentät!");
      return;
    }

    setEvaluating(true);
    setResult(null);
    setProgress(0);

    try {
      setProgress(30);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const repoInfo = await fetchRepositoryInfo(repoUrl);
      setProgress(70);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const repoName = repoUrl.split("/").pop()?.replace(".git", "") || "Unknown";
      const evaluation = generateEvaluation(repoInfo, repoName, assignmentName);
      
      setProgress(100);
      setResult({ markdownContent: evaluation, success: true });
      alert("Evaluation completed!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setResult({ markdownContent: "", success: false, error: message });
      alert(`Evaluation failed: ${message}`);
    } finally {
      setEvaluating(false);
      setProgress(0);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f8fafc", 
      fontFamily: "system-ui, -apple-system, sans-serif" 
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: "white", 
        borderBottom: "1px solid #e5e7eb", 
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            backgroundColor: "#3b82f6", 
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.2rem"
          }}>
            AFS
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1f2937" }}>
            GitHub Classroom Analyzer
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>Languages</span>
          <button style={{
            backgroundColor: "#1f2937",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "500"
          }}>
            Login
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: "80rem", 
        margin: "0 auto", 
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem"
      }}>
        {/* Title Section */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ 
            fontSize: "2.5rem", 
            fontWeight: "bold", 
            color: "#1f2937",
            marginBottom: "1rem"
          }}>
            Repository Analysis Tool
          </h2>
          <p style={{ 
            color: "#6b7280", 
            fontSize: "1.1rem",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Analyze GitHub repositories and generate comprehensive evaluation reports for classroom assignments.
          </p>
        </div>

        {/* Analysis Form */}
        <div style={{ 
          backgroundColor: "white", 
          padding: "2rem", 
          borderRadius: "12px", 
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb"
        }}>
          <h3 style={{ 
            fontSize: "1.5rem", 
            fontWeight: "600", 
            marginBottom: "1.5rem",
            color: "#1f2937"
          }}>
            📊 Repository Analysis
          </h3>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "1.5rem", 
            marginBottom: "2rem" 
          }}>
            <div>
              <label style={{ 
                display: "block", 
                fontSize: "0.875rem", 
                fontWeight: "600", 
                marginBottom: "0.5rem",
                color: "#374151"
              }}>
                GitHub Repository URL *
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "2px solid #e5e7eb", 
                  borderRadius: "8px", 
                  outline: "none",
                  fontSize: "1rem",
                  transition: "border-color 0.2s"
                }}
                disabled={evaluating}
              />
            </div>

            <div>
              <label style={{ 
                display: "block", 
                fontSize: "0.875rem", 
                fontWeight: "600", 
                marginBottom: "0.5rem",
                color: "#374151"
              }}>
                Organization ID *
              </label>
              <input
                type="text"
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                placeholder="org123"
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "2px solid #e5e7eb", 
                  borderRadius: "8px", 
                  outline: "none",
                  fontSize: "1rem",
                  transition: "border-color 0.2s"
                }}
                disabled={evaluating}
              />
            </div>

            <div>
              <label style={{ 
                display: "block", 
                fontSize: "0.875rem", 
                fontWeight: "600", 
                marginBottom: "0.5rem",
                color: "#374151"
              }}>
                Assignment Name *
              </label>
              <input
                type="text"
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                placeholder="Project Evaluation"
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "2px solid #e5e7eb", 
                  borderRadius: "8px", 
                  outline: "none",
                  fontSize: "1rem",
                  transition: "border-color 0.2s"
                }}
                disabled={evaluating}
              />
            </div>
          </div>

          {/* Progress Bar */}
          {evaluating && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                color: "#6b7280"
              }}>
                <span>Analyzing repository...</span>
                <span>{progress}%</span>
              </div>
              <div style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#e5e7eb",
                borderRadius: "4px",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "#3b82f6",
                  transition: "width 0.3s ease",
                  borderRadius: "4px"
                }} />
              </div>
            </div>
          )}

          <button
            onClick={handleEvaluation}
            disabled={evaluating}
            style={{
              backgroundColor: evaluating ? "#9ca3af" : "#1f2937",
              color: "white",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "8px",
              cursor: evaluating ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              margin: "0 auto",
              transition: "all 0.2s"
            }}
          >
            {evaluating ? (
              <>
                <span>🔄</span>
                Analyzing...
              </>
            ) : (
              <>
                <span>🚀</span>
                Start Analysis
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={{ 
            backgroundColor: "white", 
            padding: "2rem", 
            borderRadius: "12px", 
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "1.5rem" 
            }}>
              <h3 style={{ 
                fontSize: "1.5rem", 
                fontWeight: "600",
                color: "#1f2937"
              }}>
                {result.success ? "✅ Analysis Complete" : "❌ Analysis Failed"}
              </h3>
              {result.success && (
                <button
                  onClick={() => navigator.clipboard.writeText(result.markdownContent)}
                  style={{ 
                    padding: "0.5rem 1rem", 
                    backgroundColor: "#10b981", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "6px", 
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500"
                  }}
                >
                  📋 Copy Report
                </button>
              )}
            </div>

            {result.error && (
              <div style={{ 
                backgroundColor: "#fef2f2", 
                border: "1px solid #f87171", 
                color: "#b91c1c", 
                padding: "1rem", 
                borderRadius: "8px", 
                marginBottom: "1.5rem" 
              }}>
                <strong>Error:</strong> {result.error}
              </div>
            )}

            {result.success && result.markdownContent && (
              <div style={{ 
                backgroundColor: "#f9fafb", 
                padding: "1.5rem", 
                borderRadius: "8px", 
                border: "1px solid #e5e7eb", 
                overflowY: "auto", 
                maxHeight: "50rem" 
              }}>
                <pre style={{ 
                  whiteSpace: "pre-wrap", 
                  fontSize: "0.875rem",
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                  margin: 0,
                  lineHeight: "1.5",
                  color: "#1f2937"
                }}>
                  {result.markdownContent}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: "center", 
        padding: "2rem", 
        color: "#6b7280",
        fontSize: "0.875rem"
      }}>
        Footer
      </div>
    </div>
  );
}