import { useState } from 'react'
import Layout from '../components/Layout'

const terms = [
  { term: 'AMI', full: 'Amazon Machine Image', def: 'A pre-configured template for launching EC2 instances. Contains the OS, application server, and apps.' },
  { term: 'ARN', full: 'Amazon Resource Name', def: 'A unique identifier for AWS resources in the format arn:partition:service:region:account-id:resource.' },
  { term: 'Auto Scaling', full: 'AWS Auto Scaling', def: 'Automatically adjusts the number of EC2 instances in response to demand. Ensures availability and cost efficiency.' },
  { term: 'AZ', full: 'Availability Zone', def: 'An isolated data center within an AWS Region. Each region has 2–6 AZs. Deploying across AZs = high availability.' },
  { term: 'Bastion Host', full: 'Bastion Host (Jump Server)', def: 'A hardened EC2 instance in a public subnet used to SSH into private instances securely.' },
  { term: 'CDN', full: 'Content Delivery Network', def: 'A globally distributed network for delivering content with low latency. CloudFront is AWS\'s CDN.' },
  { term: 'CIDR', full: 'Classless Inter-Domain Routing', def: 'A notation for specifying IP address ranges (e.g., 10.0.0.0/16 = 65,536 addresses).' },
  { term: 'CloudFormation', full: 'AWS CloudFormation', def: 'Infrastructure as Code (IaC) service. Define AWS resources in JSON/YAML templates.' },
  { term: 'CloudFront', full: 'Amazon CloudFront', def: 'AWS CDN service. Caches content at 400+ edge locations globally for low-latency delivery.' },
  { term: 'CloudTrail', full: 'AWS CloudTrail', def: 'Records API calls made to your AWS account. Used for auditing, compliance, and security.' },
  { term: 'CloudWatch', full: 'Amazon CloudWatch', def: 'Monitoring and observability service. Collects metrics, logs, and sets alarms on AWS resources.' },
  { term: 'CORS', full: 'Cross-Origin Resource Sharing', def: 'A browser security mechanism. Configure on S3/API Gateway to allow requests from other domains.' },
  { term: 'DynamoDB', full: 'Amazon DynamoDB', def: 'Fully managed NoSQL key-value and document database. Single-digit millisecond latency at any scale.' },
  { term: 'EBS', full: 'Elastic Block Store', def: 'Persistent block storage volumes for EC2. Think of it as a virtual hard drive. Stays in one AZ.' },
  { term: 'EC2', full: 'Elastic Compute Cloud', def: 'AWS\'s virtual machines service. Provides resizable compute capacity in the cloud.' },
  { term: 'ECR', full: 'Elastic Container Registry', def: 'Fully managed Docker container registry. Store, manage, and deploy container images.' },
  { term: 'ECS', full: 'Elastic Container Service', def: 'AWS container orchestration service. Runs Docker containers without managing servers (Fargate) or on EC2.' },
  { term: 'EFS', full: 'Elastic File System', def: 'Managed NFS file system. Can be mounted by multiple EC2 instances simultaneously across AZs.' },
  { term: 'EKS', full: 'Elastic Kubernetes Service', def: 'Managed Kubernetes service on AWS. Run containerized workloads without managing the control plane.' },
  { term: 'ELB', full: 'Elastic Load Balancing', def: 'Distributes incoming traffic across multiple targets. Types: ALB (layer 7), NLB (layer 4), CLB (legacy).' },
  { term: 'Fargate', full: 'AWS Fargate', def: 'Serverless compute for containers. Run ECS/EKS containers without managing EC2 instances.' },
  { term: 'GuardDuty', full: 'Amazon GuardDuty', def: 'Threat detection service that monitors for malicious activity using ML and threat intelligence.' },
  { term: 'IAM', full: 'Identity and Access Management', def: 'Manage who can do what in your AWS account. Core concepts: Users, Groups, Roles, Policies.' },
  { term: 'IGW', full: 'Internet Gateway', def: 'Allows resources in a VPC to communicate with the internet. Must attach to VPC and update route tables.' },
  { term: 'KMS', full: 'Key Management Service', def: 'Create and manage encryption keys. Integrated with most AWS services for data encryption.' },
  { term: 'Lambda', full: 'AWS Lambda', def: 'Serverless compute. Run code without provisioning servers. Triggered by events. Pay per invocation.' },
  { term: 'NACLs', full: 'Network Access Control Lists', def: 'Stateless subnet-level firewalls in a VPC. Allow/deny traffic in and out. Evaluated in rule order.' },
  { term: 'NAT Gateway', full: 'Network Address Translation Gateway', def: 'Allows private subnet instances to reach the internet without being publicly accessible.' },
  { term: 'RDS', full: 'Relational Database Service', def: 'Managed SQL database service. Supports MySQL, PostgreSQL, Oracle, SQL Server, MariaDB, Aurora.' },
  { term: 'Region', full: 'AWS Region', def: 'A geographic area with multiple AZs. Choose based on latency, compliance, and service availability.' },
  { term: 'Route 53', full: 'Amazon Route 53', def: 'AWS DNS service. Also handles domain registration, health checks, and traffic routing policies.' },
  { term: 'S3', full: 'Simple Storage Service', def: 'Object storage with unlimited capacity. Store and retrieve any amount of data. 11 9s durability.' },
  { term: 'S3 Glacier', full: 'Amazon S3 Glacier', def: 'Low-cost archival storage. Retrieval times from minutes (Instant) to hours (Flexible/Deep Archive).' },
  { term: 'Security Group', full: 'EC2 Security Group', def: 'Stateful instance-level firewall. Only allow rules (no deny). Changes apply immediately.' },
  { term: 'SNS', full: 'Simple Notification Service', def: 'Pub/sub messaging service. Send notifications to SQS, Lambda, HTTP endpoints, email, SMS.' },
  { term: 'SQS', full: 'Simple Queue Service', def: 'Fully managed message queuing. Decouple microservices. Standard (at-least-once) or FIFO (exactly-once).' },
  { term: 'SSM', full: 'Systems Manager', def: 'Ops tool for managing EC2 fleets at scale. Parameter Store, Session Manager, Patch Manager.' },
  { term: 'STS', full: 'Security Token Service', def: 'Issues temporary security credentials for cross-account access or federated identity.' },
  { term: 'Subnet', full: 'VPC Subnet', def: 'A range of IP addresses in a VPC. Public subnets route to IGW; private subnets don\'t.' },
  { term: 'VPC', full: 'Virtual Private Cloud', def: 'Logically isolated network in AWS. You control IP ranges, subnets, route tables, gateways.' },
  { term: 'VPC Peering', full: 'VPC Peering Connection', def: 'Private network connection between two VPCs. Traffic stays on AWS network. Non-transitive.' },
  { term: 'WAF', full: 'Web Application Firewall', def: 'Protects web apps from common exploits (SQLi, XSS). Deploy in front of ALB, CloudFront, API GW.' },
  { term: 'Aurora', full: 'Amazon Aurora', def: 'MySQL/PostgreSQL-compatible database built for the cloud. 5x faster than MySQL, 3x than PostgreSQL.' },
  { term: 'Bedrock', full: 'Amazon Bedrock', def: 'Fully managed service for building generative AI apps using foundation models from AWS and partners.' },
  { term: 'Direct Connect', full: 'AWS Direct Connect', def: 'Dedicated private network connection from on-premises to AWS. More reliable than VPN, higher bandwidth.' },
  { term: 'EventBridge', full: 'Amazon EventBridge', def: 'Serverless event bus. Connect AWS services, SaaS apps, and your own apps via events.' },
  { term: 'Kinesis', full: 'Amazon Kinesis', def: 'Real-time data streaming. Kinesis Data Streams (custom), Firehose (delivery), Analytics (SQL on stream).' },
  { term: 'SageMaker', full: 'Amazon SageMaker', def: 'Fully managed ML platform. Build, train, tune, and deploy machine learning models at scale.' },
  { term: 'Secrets Manager', full: 'AWS Secrets Manager', def: 'Store, rotate, and retrieve secrets (DB passwords, API keys). Integrates with RDS for auto-rotation.' },
  { term: 'Step Functions', full: 'AWS Step Functions', def: 'Visual workflow orchestration for distributed applications. Coordinate Lambda, ECS, and other services.' },
]

export default function Glossary() {
  const [search, setSearch] = useState('')
  const filtered = terms.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.full.toLowerCase().includes(search.toLowerCase()) ||
    t.def.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📖</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', marginBottom: '0.5rem' }}>AWS Glossary</h1>
          <p style={{ color: '#6b7280' }}>{terms.length} essential AWS terms, explained simply.</p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1rem' }}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search terms..."
            style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.875rem', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
            No terms found for "{search}"
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {filtered.map(t => (
            <div key={t.term} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.875rem', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.625rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 900, color: '#2563eb', fontSize: '0.95rem' }}>{t.term}</span>
                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>—</span>
                <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>{t.full}</span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{t.def}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem' }}>
          Showing {filtered.length} of {terms.length} terms
        </div>

      </div>
    </Layout>
  )
}
