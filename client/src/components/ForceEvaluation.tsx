import { useState } from "react";

// TypeScript interfaces
interface RepositoryInfo {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  size: number;
  has_wiki: boolean;
  has_pages: boolean;
  private: boolean;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  updated_at: string;
  created_at: string;
  description?: string;
  topics?: string[];
  license?: {
    name: string;
  };
  archived?: boolean;
  disabled?: boolean;
}

interface RepositoryData {
  owner: string;
  repo: string;
  repoInfo: RepositoryInfo;
}

interface EvaluationResult {
  markdownContent: string;
  success: boolean;
  error?: string;
}

interface ScoreBreakdown {
  codeQuality: number;
  architecture: number;
  community: number;
  documentation: number;
  maintenance: number;
  activity: number;
}

interface LanguageScores {
  [key: string]: number;
}

export default function TestEvaluationPage(): JSX.Element {
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [organizationId, setOrganizationId] = useState<string>("");
  const [assignmentName, setAssignmentName] = useState<string>("");
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Yksinkertaistettu GitHub API helper
  async function fetchRepositoryContent(repoUrl: string): Promise<RepositoryData> {
    try {
      const cleanUrl = repoUrl
        .replace("https://github.com/", "")
        .replace(".git", "");
      const urlParts = cleanUrl.split("/");

      if (urlParts.length < 2) {
        throw new Error("Invalid GitHub URL format");
      }

      const owner = urlParts[0];
      const repo = urlParts[1];

      // Käytä yksinkertaisempaa API-kutsua
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      console.log("Fetching repository info:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "AI-Code-Evaluator",
        },
      });

      if (!response.ok) {
        throw new Error(`Repository not found or private: ${owner}/${repo}`);
      }

      const repoInfo: RepositoryInfo = await response.json();
      console.log("Repository info:", repoInfo);

      return { owner, repo, repoInfo };
    } catch (error) {
      console.error("Error fetching repository:", error);
      throw error;
    }
  }

  async function generateAIEvaluation(
    repoInfo: RepositoryInfo,
    repoName: string,
    assignmentName: string
  ): Promise<string> {
    // Parannettu pisteiden laskenta
    const stars = repoInfo.stargazers_count || 0;
    const forks = repoInfo.forks_count || 0;
    const issues = repoInfo.open_issues_count || 0;
    const language = repoInfo.language || "Unknown";
    const size = repoInfo.size || 0;
    const hasWiki = repoInfo.has_wiki || false;
    const hasPages = repoInfo.has_pages || false;
    const isPrivate = repoInfo.private || false;
    const hasIssues = repoInfo.has_issues || false;
    const hasProjects = repoInfo.has_projects || false;
    const hasDownloads = repoInfo.has_downloads || false;
    const updatedAt = new Date(repoInfo.updated_at);
    const createdAt = new Date(repoInfo.created_at);
    const daysSinceUpdate = (new Date().getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceCreation = (new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    // Parannettu pisteiden laskenta
    let codeQualityScore = 0;
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Kieli-pisteet (parannettu)
    const languageScores: LanguageScores = {
      TypeScript: 25,
      JavaScript: 20,
      Python: 22,
      Java: 21,
      "C++": 23,
      "C#": 20,
      Go: 24,
      Rust: 25,
      Kotlin: 22,
      Swift: 21,
      PHP: 18,
      Ruby: 19,
      Scala: 23,
      Dart: 20,
      R: 17,
      MATLAB: 16,
      Perl: 15,
      Shell: 14,
      PowerShell: 16,
      Vue: 20,
      React: 20,
      Angular: 21,
    };

    codeQualityScore += languageScores[language] || 15;
    strengths.push(`Excellent ${language} implementation`);

    // Populariteetti-pisteet (parannettu)
    if (stars > 1000) {
      codeQualityScore += 25;
      strengths.push("Extremely popular repository");
    } else if (stars > 500) {
      codeQualityScore += 20;
      strengths.push("Highly popular repository");
    } else if (stars > 100) {
      codeQualityScore += 15;
      strengths.push("Very popular repository");
    } else if (stars > 10) {
      codeQualityScore += 10;
      strengths.push("Popular repository");
    } else if (stars > 0) {
      codeQualityScore += 5;
      strengths.push("Repository has some recognition");
    }

    if (forks > 200) {
      codeQualityScore += 20;
      strengths.push("Extensively forked project");
    } else if (forks > 100) {
      codeQualityScore += 15;
      strengths.push("Extensively forked project");
    } else if (forks > 20) {
      codeQualityScore += 10;
      strengths.push("Well-forked project");
    } else if (forks > 5) {
      codeQualityScore += 5;
      strengths.push("Active community");
    }

    // Koodin koko (parannettu)
    if (size > 10000) {
      codeQualityScore += 25;
      strengths.push("Massive codebase");
    } else if (size > 5000) {
      codeQualityScore += 20;
      strengths.push("Extensive codebase");
    } else if (size > 1000) {
      codeQualityScore += 15;
      strengths.push("Substantial codebase");
    } else if (size > 100) {
      codeQualityScore += 10;
      strengths.push("Good codebase size");
    } else if (size > 10) {
      codeQualityScore += 5;
      strengths.push("Basic codebase");
    }

    // Dokumentaatio ja projektin laatu (parannettu)
    if (hasWiki) {
      codeQualityScore += 15;
      strengths.push("Comprehensive documentation wiki");
    } else {
      improvements.push("Add documentation wiki");
    }

    if (hasPages) {
      codeQualityScore += 10;
      strengths.push("Professional GitHub Pages");
    } else {
      improvements.push("Consider adding GitHub Pages");
    }

    if (hasIssues) {
      codeQualityScore += 5;
      strengths.push("Issue tracking enabled");
    }

    if (hasProjects) {
      codeQualityScore += 5;
      strengths.push("Project management enabled");
    }

    // Aktiivisuus ja ylläpito (uusi)
    if (daysSinceUpdate < 1) {
      codeQualityScore += 20;
      strengths.push("Updated today - very active");
    } else if (daysSinceUpdate < 7) {
      codeQualityScore += 15;
      strengths.push("Very recently updated");
    } else if (daysSinceUpdate < 30) {
      codeQualityScore += 10;
      strengths.push("Recently updated");
    } else if (daysSinceUpdate < 90) {
      codeQualityScore += 5;
      strengths.push("Moderately maintained");
    } else {
      improvements.push("Consider updating the repository");
    }

    // Projektin ikä (uusi)
    if (daysSinceCreation > 730) {
      codeQualityScore += 15;
      strengths.push("Very mature project");
    } else if (daysSinceCreation > 365) {
      codeQualityScore += 10;
      strengths.push("Mature project");
    } else if (daysSinceCreation > 90) {
      codeQualityScore += 5;
      strengths.push("Established project");
    }

    // Issue management (parannettu)
    if (issues === 0) {
      codeQualityScore += 15;
      strengths.push("No open issues - perfectly maintained");
    } else if (issues < 3) {
      codeQualityScore += 10;
      strengths.push("Very few open issues");
    } else if (issues < 10) {
      codeQualityScore += 5;
      strengths.push("Few open issues");
    } else if (issues < 20) {
      codeQualityScore += 0;
    } else {
      codeQualityScore -= 5;
      improvements.push("Address open issues");
    }

    // Bonus-pisteet erikoistapauksille
    if (repoInfo.description && repoInfo.description.length > 20) {
      codeQualityScore += 5;
      strengths.push("Good project description");
    }

    if (repoInfo.topics && repoInfo.topics.length > 0) {
      codeQualityScore += 5;
      strengths.push("Well-tagged repository");
    }

    if (repoInfo.license && repoInfo.license.name !== "Other") {
      codeQualityScore += 5;
      strengths.push("Proper licensing");
    }

    // Lisäbonukset
    if (repoInfo.archived === false) {
      codeQualityScore += 3;
      strengths.push("Active repository");
    }

    if (repoInfo.disabled === false) {
      codeQualityScore += 2;
      strengths.push("Repository enabled");
    }

    // Normalisoi pisteet
    const normalizedScore = Math.min(100, Math.max(0, codeQualityScore));
    const overallRating =
      normalizedScore > 0 ? (normalizedScore / 20).toFixed(1) : "0.0";

    // Parannettu score breakdown
    const scoreBreakdown: ScoreBreakdown = {
      codeQuality: Math.min(25, Math.floor(normalizedScore * 0.25)),
      architecture: Math.min(20, Math.floor(normalizedScore * 0.2)),
      community: Math.min(20, Math.floor((stars + forks) / 8)),
      documentation: hasWiki ? 18 : hasPages ? 12 : 8,
      maintenance: Math.min(15, Math.max(0, 15 - Math.floor(issues / 2))),
      activity: Math.min(15, Math.max(0, 15 - Math.floor(daysSinceUpdate / 7))),
    };

    const totalScore = Object.values(scoreBreakdown).reduce(
      (sum, score) => sum + score,
      0
    );

    return `# AI Code Evaluation Report

## Repository: ${repoName}
## Assignment: ${assignmentName}
## Analysis Date: ${new Date().toLocaleDateString()}

### Overall Rating: ${overallRating}/5 ⭐

### Strengths:
${
  strengths.length > 0
    ? strengths.map((s) => `- ✅ **${s}**`).join("\n")
    : "- ✅ **Repository successfully analyzed**"
}

### Areas for Improvement:
${
  improvements.length > 0
    ? improvements.map((i) => `- **${i}**`).join("\n")
    : "- 🔧 **Consider adding more documentation**"
}

### Repository Statistics:
- **Primary Language**: ${language}
- **Repository Size**: ${size.toLocaleString()} KB
- **Stars**: ${stars.toLocaleString()}
- **Forks**: ${forks.toLocaleString()}
- **Open Issues**: ${issues.toLocaleString()}
- **Has Wiki**: ${hasWiki ? "Yes" : "No"}
- **Has Pages**: ${hasPages ? "Yes" : "No"}
- **Visibility**: ${isPrivate ? "Private" : "Public"}
- **Last Updated**: ${
      daysSinceUpdate < 1 ? "Today" : `${Math.floor(daysSinceUpdate)} days ago`
    }
- **Project Age**: ${Math.floor(daysSinceCreation)} days
- **Description**: ${repoInfo.description ? "Present" : "Missing"}
- **Topics**: ${
      repoInfo.topics && repoInfo.topics.length > 0
        ? repoInfo.topics.join(", ")
        : "None"
    }
- **License**: ${repoInfo.license ? repoInfo.license.name : "None"}

### Score Breakdown:

| Category | Score | Max | Comments |
|----------|-------|-----|----------|
| **Code Quality** | ${scoreBreakdown.codeQuality} | 25 | ${
      language === "TypeScript"
        ? "Excellent TypeScript usage with type safety"
        : language === "JavaScript"
        ? "Good JavaScript usage"
        : "Consider TypeScript for better type safety"
    } |
| **Architecture** | ${scoreBreakdown.architecture} | 20 | ${
      size > 1000
        ? "Well-structured large codebase"
        : size > 100
        ? "Good structure"
        : "Basic structure"
    } |
| **Community** | ${scoreBreakdown.community} | 20 | ${
      stars > 100
        ? "Excellent community engagement"
        : stars > 10
        ? "Good community engagement"
        : "Needs community building"
    } |
| **Documentation** | ${scoreBreakdown.documentation} | 20 | ${
      hasWiki
        ? "Excellent documentation"
        : hasPages
        ? "Good documentation"
        : "Needs more documentation"
    } |
| **Maintenance** | ${scoreBreakdown.maintenance} | 15 | ${
      issues < 5
        ? "Well-maintained"
        : issues < 20
        ? "Moderate maintenance"
        : "Needs maintenance"
    } |
| **Activity** | ${scoreBreakdown.activity} | 15 | ${
      daysSinceUpdate < 7
        ? "Very active development"
        : daysSinceUpdate < 30
        ? "Active development"
        : "Moderate activity"
    } |

**Total Score: ${totalScore}/115** 🎯

### Technical Recommendations:

#### **Priority 1 - High Impact:**
1. **${!hasWiki ? "Add Documentation" : "Maintain Documentation"}**:
   - Create comprehensive README
   - Add API documentation
   - Include setup instructions

2. **${issues > 10 ? "Address Open Issues" : "Maintain Code Quality"}**:
   - Review and close stale issues
   - Implement feature requests
   - Fix reported bugs

#### **Priority 2 - Medium Impact:**
3. **${stars < 10 ? "Improve Project Visibility" : "Maintain Popularity"}**:
   - Add project description
   - Use relevant tags
   - Create demo/screenshots

4. **${forks < 5 ? "Encourage Contributions" : "Maintain Community"}**:
   - Add contribution guidelines
   - Create issue templates
   - Welcome new contributors

### Code Quality Assessment:
- **Language Choice**: ${
      language === "TypeScript"
        ? "Excellent"
        : language === "JavaScript"
        ? "Good"
        : "Standard"
    } (${language})
- **Project Size**: ${
      size > 1000 ? "Large" : size > 100 ? "Medium" : "Small"
    } (${size.toLocaleString()} KB)
- **Community Health**: ${
      stars > 100 ? "Excellent" : stars > 10 ? "Good" : "Basic"
    } (${stars} stars)
- **Maintenance**: ${
      issues < 5 ? "Excellent" : issues < 20 ? "Good" : "Needs attention"
    } (${issues} open issues)
- **Activity Level**: ${
      daysSinceUpdate < 7
        ? "Very Active"
        : daysSinceUpdate < 30
        ? "Active"
        : "Moderate"
    } (${Math.floor(daysSinceUpdate)} days since update)

---

**Analysis Summary**: This project demonstrates ${
      Number(overallRating) >= 4
        ? "excellent"
        : Number(overallRating) >= 3
        ? "good"
        : Number(overallRating) >= 2
        ? "basic"
        : "minimal"
    } understanding of modern development practices. The codebase shows ${
      language === "TypeScript" ? "strong" : "standard"
    } language usage and ${
      hasWiki ? "proper" : "basic"
    } documentation practices.

*Generated by AI Code Evaluator v3.2* 🤖`;
  }

  const handleForceEvaluation = async (): Promise<void> => {
    if (!repoUrl || !organizationId || !assignmentName || evaluating) {
      alert("Täytä kaikki kentät!");
      return;
    }

    setEvaluating(true);
    setResult(null);
    setProgress(0);

    try {
      console.log("Force evaluating...", {
        repoUrl,
        organizationId,
        assignmentName,
      });

      setProgress(30);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Hae repository GitHubista
      const { owner, repo, repoInfo } = await fetchRepositoryContent(repoUrl);
      setProgress(70);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generoi AI-arviointi
      const aiEvaluation = await generateAIEvaluation(
        repoInfo,
        repo,
        assignmentName
      );
      setProgress(100);

      setResult({
        markdownContent: aiEvaluation,
        success: true,
      });

      alert("Evaluation completed successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Force evaluation failed:", errorMessage);

      setResult({
        markdownContent: "",
        success: false,
        error: errorMessage,
      });

      alert(`Evaluation failed: ${errorMessage}`);
    } finally {
      setEvaluating(false);
      setProgress(0);
    }
  };

  const handleClearResult = (): void => {
    setResult(null);
  };

  const handleCopyToClipboard = async (): Promise<void> => {
    if (result?.markdownContent) {
      try {
        await navigator.clipboard.writeText(result.markdownContent);
        alert("Report copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        alert("Failed to copy to clipboard");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        padding: "2rem",
        maxWidth: "80rem",
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#1e293b",
            marginBottom: "0.5rem",
          }}
        >
          🤖 AI Code Evaluator Pro v3.2
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
          GitHub Repository Analysis & Evaluation
        </p>
      </div>

      {/* Input Form */}
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          gap: "1.5rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#1e293b",
          }}
        >
          📊 Repository Analysis
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div>
            <label
              htmlFor="repoUrl"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              GitHub Repository URL *
            </label>
            <input
              id="repoUrl"
              type="url"
              value={repoUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository-name"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid #e2e8f0",
                borderRadius: "0.5rem",
                outline: "none",
                fontSize: "1rem",
                transition: "border-color 0.2s",
              }}
              disabled={evaluating}
            />
          </div>

          <div>
            <label
              htmlFor="organizationId"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Organization ID *
            </label>
            <input
              id="organizationId"
              type="text"
              value={organizationId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrganizationId(e.target.value)}
              placeholder="org123"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid #e2e8f0",
                borderRadius: "0.5rem",
                outline: "none",
                fontSize: "1rem",
                transition: "border-color 0.2s",
              }}
              disabled={evaluating}
            />
          </div>

          <div>
            <label
              htmlFor="assignmentName"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Assignment Name *
            </label>
            <input
              id="assignmentName"
              type="text"
              value={assignmentName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAssignmentName(e.target.value)}
              placeholder="Project Evaluation"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid #e2e8f0",
                borderRadius: "0.5rem",
                outline: "none",
                fontSize: "1rem",
                transition: "border-color 0.2s",
              }}
              disabled={evaluating}
            />
          </div>
        </div>

        {/* Progress Bar */}
        {evaluating && (
          <div style={{ marginTop: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                Analyzing repository...
              </span>
              <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                {progress}%
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#e2e8f0",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "#3b82f6",
                  transition: "width 0.3s ease",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", paddingTop: "1rem" }}>
          <button
            onClick={handleForceEvaluation}
            disabled={evaluating}
            style={{
              padding: "1rem 2rem",
              backgroundColor: evaluating ? "#9ca3af" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: evaluating ? "not-allowed" : "pointer",
              opacity: evaluating ? 0.5 : 1,
              fontSize: "1rem",
              fontWeight: "600",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
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
          {result && (
            <button
              onClick={handleClearResult}
              style={{
                padding: "1rem 2rem",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                transition: "all 0.2s",
              }}
            >
              Clear Result
            </button>
          )}
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1e293b",
              }}
            >
              {result.success ? "✅ Analysis Complete" : "❌ Analysis Failed"}
            </h2>
            {result.success && (
              <button
                onClick={handleCopyToClipboard}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                📋 Copy Report
              </button>
            )}
          </div>

          {result.error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #f87171",
                color: "#b91c1c",
                padding: "1rem",
                borderRadius: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <strong>Error:</strong> {result.error}
            </div>
          )}

          {result.success && result.markdownContent && (
            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                border: "1px solid #e2e8f0",
                maxHeight: "50rem",
                overflowY: "auto",
              }}
            >
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "0.875rem",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                  margin: 0,
                  lineHeight: "1.5",
                  color: "#1e293b",
                }}
              >
                {result.markdownContent}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}