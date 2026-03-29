import Layout from '../components/Layout'

const resources = [
  {
    category: '🎓 Official AWS',
    items: [
      { title: 'AWS Certification Official Page', url: 'https://aws.amazon.com/certification/', desc: 'All exam guides, scheduling, and official prep materials' },
      { title: 'AWS Skill Builder', url: 'https://skillbuilder.aws/', desc: 'Free and paid official courses from AWS' },
      { title: 'AWS Documentation', url: 'https://docs.aws.amazon.com/', desc: 'Complete service documentation — the ground truth' },
      { title: 'AWS Whitepapers', url: 'https://aws.amazon.com/whitepapers/', desc: 'Foundational architecture and security papers — exam favorites' },
      { title: 'AWS Well-Architected Framework', url: 'https://aws.amazon.com/architecture/well-architected/', desc: 'The 6 pillars that underpin most exam questions' },
    ],
  },
  {
    category: '📹 Video Courses',
    items: [
      { title: 'Stephane Maarek (Udemy)', url: 'https://www.udemy.com/user/stephane-maarek/', desc: 'Most popular AWS courses. SAA-C03 is the gold standard for beginners' },
      { title: 'Adrian Cantrill (learn.cantrill.io)', url: 'https://learn.cantrill.io/', desc: 'Deep dives into AWS architecture. Excellent for Associate & Pro levels' },
      { title: 'A Cloud Guru / Pluralsight', url: 'https://acloudguru.com/', desc: 'Broad coverage of all certs with hands-on labs' },
      { title: 'FreeCodeCamp AWS Playlist (YouTube)', url: 'https://www.youtube.com/@freecodecamp', desc: 'Free full-length courses for CLF-C02 and SAA-C03' },
    ],
  },
  {
    category: '📝 Practice & Study',
    items: [
      { title: 'TutorialsDojo', url: 'https://tutorialsdojo.com/', desc: 'High-quality practice exams and cheat sheets — very close to real exam style' },
      { title: 'Examtopics AWS', url: 'https://www.examtopics.com/exams/amazon/', desc: 'Community-sourced questions (use as supplement, not primary source)' },
      { title: 'AWS Flashcards (Anki)', url: 'https://ankiweb.net/shared/info/1806131571', desc: 'Spaced-repetition flashcards for AWS services and terms' },
      { title: 'Neal Davis Practice Tests', url: 'https://www.udemy.com/user/n-davis-5/', desc: 'Excellent timed practice exams on Udemy for multiple certs' },
    ],
  },
  {
    category: '🏗️ Hands-On Labs',
    items: [
      { title: 'AWS Free Tier', url: 'https://aws.amazon.com/free/', desc: 'Build real infrastructure for free. Hands-on = highest retention' },
      { title: 'Cloud Quest (AWS)', url: 'https://aws.amazon.com/training/digital/aws-cloud-quest/', desc: 'Gamified learning with real AWS labs. Great for Foundational level' },
      { title: 'Instruqt', url: 'https://play.instruqt.com/awspartner', desc: 'Browser-based AWS sandboxes — no account needed' },
    ],
  },
  {
    category: '📖 Cheat Sheets & References',
    items: [
      { title: 'TutorialsDojo Cheat Sheets', url: 'https://tutorialsdojo.com/aws-cheat-sheets/', desc: 'One-page service summaries — perfect for last-minute review' },
      { title: 'DigitalCloud Comparison Tables', url: 'https://digitalcloud.training/aws-cheat-sheets/', desc: 'Side-by-side comparisons of similar services (S3 vs EFS vs EBS, etc.)' },
      { title: 'AWS Icons & Architecture Diagrams', url: 'https://aws.amazon.com/architecture/icons/', desc: 'Official icon sets for architecture diagrams' },
    ],
  },
  {
    category: '💬 Communities',
    items: [
      { title: 'r/AWSCertifications', url: 'https://www.reddit.com/r/AWSCertifications/', desc: 'Active community with study tips, exam experiences, and advice' },
      { title: 'AWS Discord Communities', url: 'https://discord.gg/aws', desc: 'Real-time chat with other AWS learners and practitioners' },
      { title: 'Linux Academy / Cloud Communities', url: 'https://acloud.guru/forums', desc: 'Forum discussions for course-specific questions' },
    ],
  },
]

export default function Resources() {
  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📚</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', marginBottom: '0.5rem' }}>Study Resources</h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>Curated resources to help you pass your AWS certification exam.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {resources.map(section => (
            <div key={section.category}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>{section.category}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {section.items.map(item => (
                  <a
                    key={item.title}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.875rem', padding: '0.875rem 1.125rem', textDecoration: 'none', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#93c5fd')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                    <span style={{ color: '#93c5fd', fontSize: '1rem', flexShrink: 0 }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>💡</div>
          <p style={{ fontSize: '0.875rem', color: '#166534', fontWeight: 600, margin: 0 }}>
            Pro tip: Combine one video course + practice questions (us!) + one set of cheat sheets. That trio passes most exams.
          </p>
        </div>

      </div>
    </Layout>
  )
}
