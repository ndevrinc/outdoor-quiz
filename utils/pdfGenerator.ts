import type { AssessmentResult } from "../types/assessment"

export const generateHTMLContent = (results: AssessmentResult, emailGateData: { email: string; website: string }) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adventure Commerce Readiness Assessment Results</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #ffffff;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 3px solid #fe1132;
        }
        
        .logo {
            font-size: 48px;
            margin-bottom: 20px;
        }
        
        .title {
            font-size: 32px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 18px;
            color: #6b7280;
            font-style: italic;
        }
        
        .company-info {
            background: #f9fafb;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 30px;
            border-left: 4px solid #fe1132;
        }
        
        .company-info h3 {
            color: #1f2937;
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .company-info p {
            margin: 5px 0;
            color: #4b5563;
        }
        
        .overall-score {
            text-align: center;
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            padding: 40px;
            border-radius: 6px;
            margin-bottom: 40px;
            border: 2px solid #e5e7eb;
        }
        
        .score-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        
        .score-number {
            font-size: 48px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .score-level {
            display: inline-block;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            ${getLevelStyling(results.level)}
        }
        
        .score-description {
            font-size: 16px;
            color: #4b5563;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .quick-tip {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 4px;
            padding: 20px;
            margin: 30px 0;
        }
        
        .quick-tip h4 {
            color: #dc2626;
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .quick-tip p {
            color: #7f1d1d;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #fe1132;
        }
        
        .category-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .category-name {
            display: flex;
            align-items: center;
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
        }
        
        .category-icon {
            font-size: 24px;
            margin-right: 10px;
        }
        
        .category-score {
            text-align: right;
        }
        
        .category-score-number {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
        }
        
        .category-percentage {
            font-size: 14px;
            color: #6b7280;
        }
        
        .progress-bar {
            width: 100%;
            height: 12px;
            background: #e5e7eb;
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 20px;
        }
        
        .progress-fill {
            height: 100%;
            background: #fe1132;
            transition: width 0.3s ease;
        }
        
        .recommendations {
            margin-top: 15px;
        }
        
        .recommendations h5 {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .recommendations ul {
            list-style: none;
            padding: 0;
        }
        
        .recommendations li {
            padding: 8px 0;
            padding-left: 20px;
            position: relative;
            color: #4b5563;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .recommendations li::before {
            content: "•";
            color: #fe1132;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        .action-plan {
            background: #f9fafb;
            border-radius: 6px;
            padding: 30px;
            margin: 30px 0;
            border: 1px solid #e5e7eb;
        }
        
        .action-plan h3 {
            font-size: 22px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 20px;
        }
        
        .action-plan h4 {
            font-size: 18px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 15px;
        }
        
        .action-plan ol {
            padding-left: 20px;
        }
        
        .action-plan li {
            margin-bottom: 10px;
            color: #4b5563;
            line-height: 1.6;
        }
        
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        
        .footer .tagline {
            font-weight: bold;
            color: #fe1132;
            margin-top: 10px;
        }
        
        .ndevr-branding {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        
        .ndevr-logo {
            max-width: 150px;
            height: auto;
            margin-bottom: 10px;
        }
        
        .ndevr-text {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 5px;
        }
        
        .ndevr-tagline {
            font-size: 11px;
            color: #9ca3af;
            font-style: italic;
        }
        
        @media print {
            body {
                padding: 20px;
            }
            
            .category-card {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🏔️</div>
        <h1 class="title">Adventure Commerce Readiness Assessment</h1>
        <p class="subtitle">Results Report</p>
    </div>
    
    <div class="company-info">
        <h3>Assessment Details</h3>
        <p><strong>Company Website:</strong> ${emailGateData.website}</p>
        <p><strong>Contact Email:</strong> ${emailGateData.email}</p>
        <p><strong>Assessment Date:</strong> ${new Date(results.completedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</p>
    </div>
    
    <div class="overall-score">
        <div class="score-icon">${results.levelIcon}</div>
        <div class="score-number">${results.overallScore}/60</div>
        <div class="score-level">${results.level}</div>
        <p class="score-description">${results.levelDescription}</p>
    </div>
    
    <div class="quick-tip">
        <h4>🎯 Quick Win Tip</h4>
        <p>${results.quickWinTip}</p>
    </div>
    
    <div class="section">
        <h2 class="section-title">Category Breakdown</h2>
        ${results.categoryScores
          .map(
            (category) => `
            <div class="category-card">
                <div class="category-header">
                    <div class="category-name">
                        <span class="category-icon">${getCategoryIcon(category.category)}</span>
                        ${category.category}
                    </div>
                    <div class="category-score">
                        <div class="category-score-number">${category.score}/${category.maxScore}</div>
                        <div class="category-percentage">${category.percentage}%</div>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${category.percentage}%"></div>
                </div>
                <div class="recommendations">
                    <h5>Priority Recommendations:</h5>
                    <ul>
                        ${category.recommendations
                          .slice(0, 5)
                          .map((rec) => `<li>${rec}</li>`)
                          .join("")}
                    </ul>
                </div>
            </div>
        `,
          )
          .join("")}
    </div>
    
    <div class="action-plan">
        <h3>Your Personalized Action Plan</h3>
        <h4>${getActionPlanFocus(results.level)}</h4>
        <ol>
            ${getActionPlanItems(results.level)
              .map((item) => `<li>${item}</li>`)
              .join("")}
        </ol>
    </div>
    
    <div class="footer">
        <p>This report was generated by the Adventure Commerce Readiness Assessment</p>
        <p class="tagline">"Build Adventure-Grade Commerce on Publisher-Grade Infrastructure"</p>
    </div>
    
    <div class="ndevr-branding">
        <img src="/images/ndevr-logo.png" alt="NDEVR Logo" class="ndevr-logo" />
        <p class="ndevr-text">Powered by NDEVR</p>
        <p class="ndevr-tagline">Digital Solutions for Adventure Commerce</p>
    </div>
</body>
</html>
  `

  return htmlContent
}

const getLevelStyling = (level: string): string => {
  switch (level) {
    case "Summit Ready":
      return "background: #f3f4f6; color: #1f2937; border: 2px solid #9ca3af;"
    case "Base Camp Strong":
      return "background: #f9fafb; color: #374151; border: 2px solid #d1d5db;"
    case "Trail Ready":
      return "background: #f9fafb; color: #4b5563; border: 2px solid #d1d5db;"
    case "Basecamp Basics":
      return "background: #fef2f2; color: #dc2626; border: 2px solid #fecaca;"
    default:
      return "background: #f9fafb; color: #4b5563; border: 2px solid #d1d5db;"
  }
}

const getCategoryIcon = (category: string): string => {
  switch (category) {
    case "Audience Experience":
      return "📱"
    case "Creator Experience":
      return "✏️"
    case "Developer Experience":
      return "⚙️"
    case "Business Impact":
      return "💰"
    default:
      return "📊"
  }
}

const getActionPlanFocus = (level: string): string => {
  switch (level) {
    case "Summit Ready":
      return "🎯 Advanced Optimization Focus"
    case "Base Camp Strong":
      return "⚡ Performance & Scale Focus"
    case "Trail Ready":
      return "🔧 Foundation Strengthening Focus"
    default:
      return "🚀 Platform Transformation Focus"
  }
}

const getActionPlanItems = (level: string): string[] => {
  switch (level) {
    case "Summit Ready":
      return [
        "Implement AI-powered personalization engines for enhanced customer experience",
        "Deploy advanced analytics and attribution modeling for better ROI tracking",
        "Accelerate international expansion with multi-currency capabilities",
        "Integrate emerging technologies (AR/VR) for immersive product experiences",
        "Optimize for voice commerce and next-generation interfaces",
      ]
    case "Base Camp Strong":
      return [
        "Implement advanced CDN and caching optimization for 40%+ performance improvement",
        "Set up content workflow automation to streamline publishing processes",
        "Create integration enhancement roadmap for better system connectivity",
        "Deploy advanced security and compliance measures for enterprise readiness",
        "Establish automated monitoring and alerting systems",
      ]
    case "Trail Ready":
      return [
        "Prioritize mobile experience optimization for better conversion rates",
        "Implement basic content management workflow improvements",
        "Conduct comprehensive performance audit and implement fixes",
        "Set up essential integrations for core business functions",
        "Establish proper development and staging environments",
      ]
    default:
      return [
        "Begin comprehensive platform migration planning and assessment",
        "Evaluate WordPress VIP and other enterprise solutions",
        "Conduct legacy system assessment and data migration planning",
        "Set up foundation infrastructure for scalable growth",
        "Establish basic security measures and backup procedures",
      ]
  }
}

// Single PDF function that opens print dialog
export const downloadPDF = (results: AssessmentResult, emailGateData: { email: string; website: string }) => {
  const htmlContent = generateHTMLContent(results, emailGateData)

  const newWindow = window.open("", "_blank")
  if (newWindow) {
    newWindow.document.write(htmlContent)
    newWindow.document.close()

    // Auto-trigger print dialog after content loads
    newWindow.onload = () => {
      setTimeout(() => {
        newWindow.print()
      }, 500)
    }
  }
}
