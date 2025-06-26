// Test data for the wizard flow

const testData = {
  // Step 1: Job Description
  jobDescription: `
VP of Engineering - TechCorp Inc.

About TechCorp:
TechCorp is a leading fintech company revolutionizing digital payments. We're looking for a VP of Engineering to lead our technical teams and drive innovation.

Responsibilities:
- Lead and scale engineering organization of 50+ engineers
- Define technical strategy and roadmap
- Partner with product and business stakeholders
- Drive engineering excellence and best practices
- Mentor and develop engineering leaders

Requirements:
- 10+ years of engineering experience
- 5+ years in engineering leadership roles
- Experience scaling teams from 20 to 100+ engineers
- Strong background in distributed systems
- Excellent communication and leadership skills

Location: San Francisco, CA (Hybrid)
`,

  // Step 2: Resume
  resume: `
John Smith
VP of Engineering | Technical Leader | Team Builder

EXPERIENCE

VP of Engineering - StartupXYZ (2020-Present)
- Scaled engineering team from 15 to 75 engineers
- Led migration to microservices architecture
- Improved deployment frequency by 300%
- Established engineering culture and best practices

Director of Engineering - BigTech Co (2017-2020)
- Managed 3 engineering teams (25 engineers)
- Delivered key platform initiatives
- Reduced technical debt by 40%

Senior Software Engineer - Various (2012-2017)
- Full-stack development
- Technical leadership roles

EDUCATION
MS Computer Science - Stanford University
BS Computer Science - UC Berkeley

SKILLS
Leadership, Distributed Systems, Cloud Architecture, Team Building
`,

  // Step 3: Writing Samples
  writingSamples: [
    {
      title: "Engineering Blog Post",
      content: `Building a Culture of Engineering Excellence

At StartupXYZ, we've grown from a small engineering team to over 75 engineers in just two years. Here's how we maintained our culture of excellence while scaling rapidly.

First, we established clear engineering principles that guide our decision-making. These aren't just words on a wall - they're actively used in design reviews and retrospectives.

Second, we invested heavily in developer experience. Fast CI/CD pipelines, comprehensive testing frameworks, and excellent tooling make our engineers more productive and happier.

Finally, we created growth paths for engineers that don't require moving into management. Our principal engineer track ensures technical leaders can continue to have massive impact while staying close to the code.

The result? We've improved our deployment frequency by 300% while maintaining industry-leading reliability metrics.`
    },
    {
      title: "Team Update Email",
      content: `Team,

I wanted to share some exciting updates from our Q3 planning session.

We've aligned on three key initiatives:
1. Platform modernization - Moving our monolith to microservices
2. Developer productivity - Cutting build times by 50%
3. Reliability improvements - Achieving 99.99% uptime

Each initiative has clear owners and success metrics. I'll be hosting office hours on Thursday to discuss how these changes will impact your teams.

Remember, our goal isn't just to ship features - it's to build a platform that will scale with our business for the next decade.

Looking forward to tackling these challenges together!

Best,
John`
    }
  ]
};

console.log("Test Data for VP Agent Demo Wizard:");
console.log("===================================\n");

console.log("1. Copy and paste this Job Description in Step 1:");
console.log(testData.jobDescription);
console.log("\n---\n");

console.log("2. Copy and paste this Resume in Step 2:");
console.log(testData.resume);
console.log("\n---\n");

console.log("3. Add these Writing Samples in Step 3:");
testData.writingSamples.forEach((sample, index) => {
  console.log(`\nSample ${index + 1} - ${sample.title}:`);
  console.log(sample.content);
});

console.log("\n\n4. Review the generated content in Step 4");
console.log("5. You can test the GitHub submission in Step 5 (it will save locally if not configured)"); 