import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // List of old template company slugs to remove (but preserve soumith organization)
  const oldCompanySlugs = [
    'techcorp-solutions',
    'cloudhost-pro',
    'dataanalytics-inc',
    'securepay-systems',
    'devtools-platform',
  ]

  // Delete old template companies (but preserve soumith organization)
  for (const slug of oldCompanySlugs) {
    const existing = await prisma.company.findUnique({
      where: { slug },
    })
    if (existing) {
      // Double-check: don't delete if it contains "soumith" (case-insensitive)
      const nameLower = existing.name.toLowerCase()
      const slugLower = existing.slug.toLowerCase()
      if (!nameLower.includes('soumith') && !slugLower.includes('soumith')) {
        await prisma.company.delete({
          where: { slug },
        })
        console.log(`Deleted old company: ${existing.name}`)
      } else {
        console.log(`Preserved company: ${existing.name} (contains soumith)`)
      }
    }
  }

  // Create some sample companies for customers to browse
  const companies = [
    {
      name: 'NimbusCloud Hosting',
      slug: 'nimbuscloud-hosting',
      description: 'Scalable cloud hosting and infrastructure services.',
      website: 'https://nimbuscloud.example.com',
      companyData: {
        features: [
          {
            name: 'Auto-Scaling Servers',
            description: 'Automatically scales server resources based on traffic demand.',
          },
          {
            name: 'Global CDN',
            description: 'Delivers content quickly using a global network of edge locations.',
          },
          {
            name: '24/7 Monitoring',
            description: 'Real-time infrastructure monitoring with instant alerts.',
          },
        ],
        pricing: {
          tiers: [
            {
              name: 'Starter',
              price: '$9.99/mo',
              description: 'Basic cloud hosting for small projects.',
            },
            {
              name: 'Business',
              price: '$49.99/mo',
              description: 'High-performance hosting with scaling and monitoring.',
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              description: 'Dedicated infrastructure and premium support.',
            },
          ],
        },
        usage: {
          gettingStarted: 'Deploy your first cloud instance from the dashboard.',
          apiGuide: 'Use the NimbusCloud API to create and manage resources programmatically.',
          security: 'Enable firewall rules, two-factor authentication, and IAM roles.',
        },
        commonIssues: [
          {
            issue: 'Server not starting',
            solution: 'Check resource quota and ensure billing is active.',
          },
          {
            issue: 'Slow site performance',
            solution: 'Enable CDN and auto-scaling options.',
          },
        ],
      },
    },
    {
      name: 'Synapse Analytics',
      slug: 'synapse-analytics',
      description: 'Advanced analytics and business intelligence platform.',
      website: 'https://synapse.example.com',
      companyData: {
        features: [
          {
            name: 'Custom Dashboards',
            description: 'Build real-time dashboards tailored to your KPIs.',
          },
          {
            name: 'Predictive Modeling',
            description: 'AI-powered models for forecasting and decision making.',
          },
          {
            name: 'Data Integrations',
            description: 'Connect to SQL, NoSQL, cloud storage, and SaaS apps.',
          },
        ],
        pricing: {
          tiers: [
            {
              name: 'Core',
              price: '$29/mo',
              description: 'Dashboard creation and basic analytics.',
            },
            {
              name: 'Pro',
              price: '$99/mo',
              description: 'Predictive models, team access, and advanced integrations.',
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              description: 'Unlimited users and dedicated data pipelines.',
            },
          ],
        },
        usage: {
          dataSources: 'Connect databases and SaaS apps through the integrations panel.',
          dashboardSetup: 'Drag-and-drop widgets to build custom dashboards.',
          modelTraining: 'Use Synapse ML to train predictive models without coding.',
        },
        commonIssues: [
          {
            issue: 'Dashboard not updating',
            solution: 'Check if the data source sync schedule is active.',
          },
          {
            issue: 'Model training failed',
            solution: 'Inspect dataset for missing values or inconsistent formats.',
          },
        ],
      },
    },
    {
      name: 'ForgeDev Tools',
      slug: 'forgedev-tools',
      description: 'Developer productivity tools and automation utilities.',
      website: 'https://forgedev.example.com',
      companyData: {
        features: [
          {
            name: 'CI/CD Pipelines',
            description: 'Automated build and deployment pipelines.',
          },
          {
            name: 'Debugging Suite',
            description: 'Advanced debugging tools for backend and frontend apps.',
          },
          {
            name: 'Team Collaboration',
            description: 'Shared workspaces and code review automation.',
          },
        ],
        pricing: {
          tiers: [
            {
              name: 'Free',
              price: '$0',
              description: 'Basic tools and community support.',
            },
            {
              name: 'Pro',
              price: '$14/mo',
              description: 'CI/CD pipelines and cloud builds.',
            },
            {
              name: 'Teams',
              price: '$59/mo',
              description: 'Team collaboration and analytics.',
            },
          ],
        },
        usage: {
          pipelineSetup: 'Connect your repo and choose a deployment template.',
          debugTools: 'Install the ForgeDev CLI to enable local debugging.',
          teamAccess: 'Invite members and assign permissions in the workspace.',
        },
        commonIssues: [
          {
            issue: 'Pipeline stuck',
            solution: 'Check your YAML config for indentation errors.',
          },
          {
            issue: 'CLI not working',
            solution: 'Reinstall the CLI and verify PATH environment variables.',
          },
        ],
      },
    },
    {
      name: 'VaultPay Financial',
      slug: 'vaultpay-financial',
      description: 'Secure payment processing and digital financial services.',
      website: 'https://vaultpay.example.com',
      companyData: {
        features: [
          {
            name: 'Payment Gateway',
            description: 'Accept credit cards, ACH, and digital wallets.',
          },
          {
            name: 'Fraud Detection',
            description: 'AI-powered fraud scoring and transaction monitoring.',
          },
          {
            name: 'Financial API',
            description: 'REST APIs for payouts, billing, and reconciliation.',
          },
        ],
        pricing: {
          tiers: [
            {
              name: 'Standard',
              price: '2.9% + 30¢',
              description: 'Standard transaction processing fees.',
            },
            {
              name: 'High-Volume',
              price: 'Custom',
              description: 'Discounted rates for businesses processing >$250k/month.',
            },
          ],
        },
        usage: {
          apiSetup: 'Generate API keys from the VaultPay dashboard.',
          webhooks: 'Configure webhooks to receive payment events.',
          security: 'Enable multi-sign approval for financial operations.',
        },
        commonIssues: [
          {
            issue: 'Webhook not receiving',
            solution: 'Verify the endpoint URL and check your firewall rules.',
          },
          {
            issue: 'Payment declined',
            solution: 'Review fraud score or try an alternate payment method.',
          },
        ],
      },
    },
    {
      name: 'NeuraSoft Systems',
      slug: 'neurasoft-systems',
      description: 'Enterprise software platform specializing in automation and AI.',
      website: 'https://neurasoft.example.com',
      companyData: {
        features: [
          {
            name: 'Workflow Automation',
            description: 'Automate internal business workflows and approvals.',
          },
          {
            name: 'AI Assistants',
            description: 'Deploy intelligent assistants across departments.',
          },
          {
            name: 'Integrations Hub',
            description: 'Connect ERP, CRM, HR, and internal services.',
          },
        ],
        pricing: {
          tiers: [
            {
              name: 'Business',
              price: '$199/mo',
              description: 'Automation and integration features for small teams.',
            },
            {
              name: 'Corporate',
              price: '$499/mo',
              description: 'Advanced AI assistants and workflow orchestration.',
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              description: 'Full platform access with SLAs and dedicated support.',
            },
          ],
        },
        usage: {
          workflows: 'Use the workflow builder to automate internal processes.',
          assistants: 'Configure AI assistants to handle department-specific tasks.',
          integrations: 'Sync with internal apps using prebuilt connectors.',
        },
        commonIssues: [
          {
            issue: 'Workflow not triggering',
            solution: 'Ensure triggers are enabled and conditions are valid.',
          },
          {
            issue: 'Assistant giving incorrect responses',
            solution: 'Update training data or adjust knowledge base settings.',
          },
        ],
      },
    },
  ]

  for (const companyConfig of companies) {
    const existing = await prisma.company.findUnique({
      where: { slug: companyConfig.slug },
    })

    if (!existing) {
      const { companyData: data, ...companyInfo } = companyConfig
      const company = await prisma.company.create({
        data: {
          ...companyInfo,
          companyData: {
            create: {
              features: data.features,
              pricing: data.pricing,
              usage: data.usage,
              commonIssues: data.commonIssues,
            },
          },
        },
      })
      console.log(`Created company: ${company.name}`)
    } else {
      // Update existing company data
      const { companyData: data, ...companyInfo } = companyConfig
      await prisma.company.update({
        where: { slug: companyConfig.slug },
        data: {
          ...companyInfo,
          companyData: {
            upsert: {
              create: {
                features: data.features,
                pricing: data.pricing,
                usage: data.usage,
                commonIssues: data.commonIssues,
              },
              update: {
                features: data.features,
                pricing: data.pricing,
                usage: data.usage,
                commonIssues: data.commonIssues,
              },
            },
          },
        },
      })
      console.log(`Updated company: ${companyInfo.name}`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

