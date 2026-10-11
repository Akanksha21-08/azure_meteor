/**
 * Azure Meteor Job Portal — Rich Seed Script
 * 3 Recruiters | 25 Candidates | 50 Jobs | 30 Applications
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const CandidateProfile = require('./models/CandidateProfile');
const RecruiterProfile = require('./models/RecruiterProfile');
const Job = require('./models/Job');
const Application = require('./models/Application');
const SavedJob = require('./models/SavedJob');
const Interview = require('./models/Interview');
const Notification = require('./models/Notification');
const Report = require('./models/Report');
const Message = require('./models/Message');

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const daysAgo = (n) => new Date(Date.now() - n * 86400000);
const daysAhead = (n) => new Date(Date.now() + n * 86400000);

const COVER_LETTERS = [
  "I'm thrilled to apply for this role. My background in full-stack development aligns perfectly with your tech stack.",
  "With 3+ years building production-grade React and Node.js apps, I can immediately add value to your engineering team.",
  "Your company mission resonates with my values. My ML and data pipeline experience will be a strong fit.",
  "I love building things that matter. My portfolio shares your product vision for UX and performance.",
  "Having worked in fast-paced startups, I thrive under pressure and ship quality code at pace.",
  "My cloud infrastructure and DevOps expertise would help your platform scale reliably as you grow.",
  "This role aligns with my 5-year goal. I've built cloud-native microservices on AWS and excited to bring that here.",
  "I lead cross-functional teams and write tests before code. My commitment to quality reduced bugs by 40% at my last job.",
  "My Go and Kubernetes experience, combined with distributed systems fundamentals, makes me ideal for this backend role.",
  "Clean architecture, typed code, and CI/CD discipline — these are non-negotiables I bring to every team I join.",
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobportal';
    await mongoose.connect(mongoUri);
    console.log('\n🌱 Connected to MongoDB — starting seed...\n');

    await Promise.all([
      User.deleteMany({}), CandidateProfile.deleteMany({}), RecruiterProfile.deleteMany({}),
      Job.deleteMany({}), Application.deleteMany({}), SavedJob.deleteMany({}),
      Interview.deleteMany({}), Notification.deleteMany({}),
      Report.deleteMany({}), Message.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data.\n');

    // ════════════════════════════════
    // ADMIN USER
    // ════════════════════════════════
    await User.create({ name: 'Admin', email: 'admin@example.com', password: 'password123', role: 'admin' });
    console.log('✅ Created admin user: admin@example.com / password123');

    // ════════════════════════════════
    // RECRUITERS
    // ════════════════════════════════
    const recruiterDefs = [
      { name:'Sarah Miller',   email:'recruiter@example.com', company:'TechCorp Innovations', industry:'Information Technology', size:'500-1000', loc:'San Francisco, CA', phone:'+1 (415) 019-2834', desc:'Global cloud software company powering next-gen enterprise solutions with AI-driven SaaS products.', web:'https://techcorp.example.com', cemail:'careers@techcorp.example.com' },
      { name:'James Rodriguez', email:'james@nexacloud.com',   company:'NexaCloud Systems',    industry:'Cloud Computing',        size:'100-500',  loc:'Austin, TX',         phone:'+1 (512) 883-4421', desc:'Cloud-native infrastructure and DevOps tooling startup backed by Series B, serving 2000+ enterprises.', web:'https://nexacloud.example.com', cemail:'jobs@nexacloud.example.com' },
      { name:'Priya Sharma',    email:'priya@aiwave.io',       company:'AIWave Labs',           industry:'Artificial Intelligence', size:'50-100',   loc:'Seattle, WA',        phone:'+1 (206) 774-9931', desc:'AI-first product company building LLM-powered automation for Fortune 500 clients.', web:'https://aiwave.example.com', cemail:'talent@aiwave.example.com' },
    ];
    const R = [];
    for (const d of recruiterDefs) {
      const u = await User.create({ name:d.name, email:d.email, password:'password123', role:'recruiter' });
      const p = await RecruiterProfile.create({ user:u._id, companyName:d.company, companyDescription:d.desc, industry:d.industry, companySize:d.size, website:d.web, location:d.loc, contactEmail:d.cemail, contactPhone:d.phone });
      R.push({ user:u, profile:p });
    }
    console.log(`✅ Created ${R.length} recruiters.`);

    // ════════════════════════════════
    // CANDIDATES
    // ════════════════════════════════
    const candidateDefs = [
      { name:'Alex Johnson',    email:'candidate@example.com',       loc:'New York, NY',        bio:'Full Stack Dev 4yr MERN. Scalable architectures.', skills:['React.js','Node.js','Express.js','MongoDB','TypeScript','AWS','Docker'],              school:'SUNY Stony Brook',  deg:'B.Sc. Computer Science',   company:'WebSphere Labs',     role:'Frontend Developer',     salary:120000 },
      { name:'Neha Kapoor',     email:'neha.kapoor@mail.com',        loc:'Bangalore, India',     bio:'Backend Go engineer. Kafka, gRPC, microservices.', skills:['Go','gRPC','Kafka','PostgreSQL','Kubernetes','Docker','Redis'],                       school:'IIT Bombay',         deg:'B.Tech Computer Eng.',     company:'InfraStack Inc.',     role:'Backend Engineer',       salary:95000  },
      { name:'Marcus Williams', email:'marcus.w@dev.io',             loc:'Atlanta, GA',           bio:'DevOps/Platform. CI/CD, Terraform, multi-cloud.',  skills:['AWS','Terraform','Kubernetes','Helm','GitHub Actions','Python','Bash'],             school:'Georgia Tech',       deg:'B.Sc. Computer Science',   company:'CloudForge',          role:'SRE',                    salary:130000 },
      { name:'Sakura Tanaka',   email:'sakura.t@engineer.jp',        loc:'Tokyo, Japan',          bio:'ML Eng 5yr NLP & CV. LLM production at scale.',    skills:['Python','PyTorch','TensorFlow','LangChain','FastAPI','HuggingFace','SageMaker'],    school:'Univ. of Tokyo',     deg:'M.Sc. AI',                 company:'NeuralPath AI',       role:'ML Engineer',            salary:140000 },
      { name:'Raj Patel',       email:'raj.patel@techstack.in',      loc:'Hyderabad, India',      bio:'Java Spring Boot, fintech APIs, SQL/NoSQL.',        skills:['Java','Spring Boot','Hibernate','PostgreSQL','Redis','RabbitMQ','Docker'],          school:'BITS Pilani',        deg:'B.E. Information Systems', company:'PaySecure Fintech',   role:'Backend Developer',      salary:90000  },
      { name:'Lena Fischer',    email:'lena.f@uxcraft.de',           loc:'Berlin, Germany',       bio:'Full-stack UX focus. React + Node + Postgres.',     skills:['React.js','Next.js','TypeScript','Node.js','PostgreSQL','Figma','Storybook'],       school:'TU Berlin',          deg:'M.Sc. HCI',                company:'DesignSystems GmbH',  role:'Frontend Engineer',      salary:100000 },
      { name:'Omar Khalid',     email:'omar.khalid@devops.ae',       loc:'Dubai, UAE',            bio:'Azure architect, event-driven systems.',            skills:['Azure','Terraform','Azure DevOps','Python','Docker','Service Bus','ARM'],           school:'AUS',                deg:'B.Sc. Computer Eng.',      company:'ADNOC Digital',       role:'Cloud Engineer',         salary:145000 },
      { name:'Priya Nair',      email:'priya.nair@code.in',          loc:'Mumbai, India',         bio:'Data Eng, Spark/Flink real-time pipelines.',        skills:['Python','Spark','Flink','Airflow','Delta Lake','Databricks','SQL'],                school:'IIT Madras',         deg:'M.Tech Data Science',      company:'DataStream Analytics',role:'Data Engineer',          salary:95000  },
      { name:'Chris Evans',     email:'chris.e@webdev.us',           loc:'Chicago, IL',           bio:'React/Vue. Animations, design systems, a11y.',      skills:['React.js','Vue.js','Svelte','JavaScript','CSS Animations','Framer Motion','WCAG'], school:'Univ. of Illinois',  deg:'B.Sc. Computer Science',   company:'CreativeFlow Agency', role:'Frontend Engineer',      salary:105000 },
      { name:'Amara Osei',      email:'amara.osei@fullstack.gh',     loc:'Accra, Ghana',          bio:'Full stack React+Django, African fintech.',          skills:['React.js','Django','Python','PostgreSQL','Celery','Redis','Nginx'],               school:'Univ. of Ghana',     deg:'B.Sc. Computer Science',   company:'HubTech Africa',      role:'Full Stack Developer',   salary:75000  },
      { name:'Sofia Rossi',     email:'sofia.r@security.it',         loc:'Milan, Italy',          bio:'Security backend. OAuth 2.0, OWASP, pen-testing.',  skills:['Python','Node.js','OAuth 2.0','JWT','OWASP','Burp Suite','PostgreSQL'],           school:'Politecnico di Milano',deg:'M.Sc. Cybersecurity',     company:'SecureNet Italia',    role:'AppSec Engineer',        salary:115000 },
      { name:'Ethan Park',      email:'ethan.park@ios.kr',           loc:'Seoul, South Korea',    bio:'iOS Swift 6yr. 1M+ App Store downloads.',           skills:['Swift','SwiftUI','Xcode','Combine','Core Data','ARKit','Firebase'],               school:'Seoul Natl. Univ.',  deg:'B.Sc. Software Eng.',      company:'KakaoTech',           role:'iOS Engineer',           salary:135000 },
      { name:'Fatima Al-Hassan',email:'fatima.h@backend.sa',         loc:'Riyadh, Saudi Arabia',  bio:'Python FastAPI, serverless, automated testing.',     skills:['Python','FastAPI','SQLAlchemy','Alembic','Pytest','Docker','AWS Lambda'],         school:'King Saud Univ.',    deg:'B.Sc. IT',                 company:'TawasolTech',         role:'Backend Developer',      salary:100000 },
      { name:'Lucas Mendes',    email:'lucas.m@fullstack.br',        loc:'São Paulo, Brazil',     bio:'Full stack fintech React+NestJS+Postgres.',          skills:['React.js','NestJS','TypeScript','PostgreSQL','Prisma','GraphQL','Docker'],        school:'USP São Paulo',      deg:'B.Sc. Computer Science',   company:'Nubank',              role:'Software Engineer',      salary:110000 },
      { name:'Yuna Kim',        email:'yuna.kim@react.dev',          loc:'Busan, South Korea',    bio:'React. Enterprise dashboards, real-time collab.',    skills:['React.js','Redux Toolkit','TypeScript','Tailwind CSS','Socket.io','Storybook'],   school:'POSTECH',            deg:'B.Sc. Computer Science',   company:'Coupang',             role:'Frontend Engineer',      salary:125000 },
      { name:'Benjamin Clark',  email:'ben.clark@scala.dev',         loc:'Seattle, WA',           bio:'Scala/Akka distributed systems, Kafka/Flink.',       skills:['Scala','Akka','Kafka','Spark','Java','Docker','MongoDB'],                        school:'Univ. of Washington', deg:'M.Sc. Distributed Computing',company:'Amazon',           role:'SDE II',                 salary:180000 },
      { name:'Aisha Mohammed',  email:'aisha.m@data.ng',             loc:'Lagos, Nigeria',        bio:'Data scientist, MLOps, retail/supply-chain ML.',     skills:['Python','Scikit-learn','XGBoost','MLflow','Pandas','Docker','Azure ML'],          school:'Univ. of Lagos',     deg:'B.Sc. Statistics',         company:'Jumia Africa',        role:'Data Scientist',         salary:85000  },
      { name:'Vikram Singh',    email:'vikram.s@devops.in',          loc:'Pune, India',           bio:'SRE/DevOps, observability, K8s platform eng.',       skills:['Kubernetes','Prometheus','Grafana','Terraform','Helm','Go','Python'],            school:'Pune University',    deg:'B.E. Electronics',         company:'Thoughtworks',        role:'Platform Engineer',      salary:95000  },
      { name:'Elena Volkova',   email:'elena.v@ai.ru',               loc:'Moscow, Russia',        bio:'Computer vision, YOLO, robotics, autonomous cars.',  skills:['Python','OpenCV','YOLO','PyTorch','CUDA','TensorRT','ROS2'],                      school:'MIPT',               deg:'M.Sc. Applied Math',       company:'Yandex SDG',          role:'CV Engineer',            salary:120000 },
      { name:'Tom Bradley',     email:'tom.b@mobile.uk',             loc:'London, UK',            bio:'Android Kotlin 7yr. Material design, perf opt.',     skills:['Kotlin','Jetpack Compose','Android SDK','Coroutines','Room','Retrofit','Firebase'],school:'Imperial College',   deg:'B.Sc. Computing',          company:'Revolut',             role:'Android Engineer',       salary:145000 },
      { name:'Chiara Bianchi',  email:'chiara.b@nextjs.dev',         loc:'Rome, Italy',           bio:'Next.js fullstack, SEO, headless CMS.',              skills:['Next.js','React.js','TypeScript','Prisma','PostgreSQL','Contentful','Vercel'],    school:'Sapienza Rome',      deg:'B.Sc. Computer Eng.',      company:'Vedolab Digital',     role:'Next.js Developer',      salary:100000 },
      { name:'Samuel Okonkwo',  email:'sam.okonkwo@blockchain.dev',  loc:'Abuja, Nigeria',        bio:'Blockchain, Solidity, DeFi, Solana smart contracts.', skills:['Solidity','Ethers.js','Hardhat','Rust','Anchor','React.js','IPFS'],             school:'Univ. of Abuja',     deg:'B.Sc. Computer Science',   company:'CoinBridge Africa',   role:'Smart Contract Dev',     salary:130000 },
      { name:'Hana Suzuki',     email:'hana.s@data.jp',              loc:'Osaka, Japan',          bio:'Analytics engineer. dbt, Snowflake, Metabase.',      skills:['SQL','dbt','Snowflake','Python','Airflow','Looker','Tableau'],                    school:'Osaka University',   deg:'B.Sc. Information Science',company:'Mercari Japan',       role:'Analytics Engineer',     salary:110000 },
      { name:'Diego Morales',   email:'diego.m@vue.mx',              loc:'Mexico City, Mexico',   bio:'Vue.js/Nuxt, bilingual portals, govt digital svcs.',  skills:['Vue.js','Nuxt.js','TypeScript','Pinia','Node.js','MySQL','TailwindCSS'],         school:'UNAM',               deg:'B.Sc. Computer Eng.',      company:'GovTech Mexico',      role:'Frontend Developer',     salary:80000  },
      { name:'Isabelle Dupont', email:'isabelle.d@cloud.fr',         loc:'Paris, France',         bio:'GCP architect. Streaming pipelines, BigQuery.',       skills:['GCP','Pub/Sub','BigQuery','Dataflow','Terraform','Python','Apache Beam'],         school:'École Polytechnique', deg:'M.Sc. Applied Math',      company:'BlaBlaCar',           role:'Data Platform Engineer', salary:130000 },
    ];
    const C = [];
    for (const d of candidateDefs) {
      const u = await User.create({ name:d.name, email:d.email, password:'password123', role:'candidate' });
      const p = await CandidateProfile.create({
        user:u._id, location:d.loc, bio:d.bio, skills:d.skills,
        education:[{ institution:d.school, degree:d.deg, fieldOfStudy:'', startYear:'2018', endYear:'2022' }],
        workExperience:[{ company:d.company, role:d.role, location:d.loc, startDate:'2021-06', endDate:'Present', description:'Delivered impactful engineering projects in a fast-paced environment.' }],
        expectedSalary:d.salary, preferredJobType:'Full Time', preferredLocation:'Remote',
        resumeUrl:'/uploads/sample-resume.pdf', resumeOriginalName:d.name.replace(/ /g,'_')+'_Resume.pdf',
      });
      C.push({ user:u, profile:p });
    }
    console.log(`✅ Created ${C.length} candidates.`);

    // ════════════════════════════════
    // JOBS  (50)
    // ════════════════════════════════
    const [tc, nc, aw] = R;
    const da = daysAhead;
    const jobDefs = [
      /* TechCorp (idx 0-15) */
      [tc,'Senior Full Stack MERN Developer','Lead our Web Applications squad. React, Node.js, Express, and MongoDB.',['React.js','Node.js','Express.js','MongoDB','TypeScript'],'3-5 years',120000,150000,'Remote','San Francisco, CA','Full Time',da(30),2],
      [tc,'Frontend React UI Engineer','Craft pixel-perfect responsive web experiences with deep React and modern CSS.',['React.js','TypeScript','CSS3','Redux','Storybook'],'1-3 years',90000,115000,'Hybrid','New York, NY','Full Time',da(15),3],
      [tc,'Backend Node.js API Specialist','Design microservices and RESTful APIs with MongoDB and JWT security.',['Node.js','Express.js','MongoDB','JWT','Redis'],'2-4 years',105000,130000,'Remote','Austin, TX','Contract',da(45),1],
      [tc,'React Native Mobile Developer','Cross-platform mobile apps for iOS and Android. Own the mobile release pipeline.',['React Native','Expo','TypeScript','Redux','Firebase'],'2-4 years',110000,135000,'Remote','Chicago, IL','Full Time',da(20),2],
      [tc,'Cloud Infrastructure Engineer (AWS)','Operate AWS platform for 10M+ users. Strong IaC background required.',['AWS','Terraform','CloudFormation','ECS','Lambda'],'3-6 years',130000,165000,'Remote','Seattle, WA','Full Time',da(25),1],
      [tc,'QA Automation Engineer','Automated test suites for web and API layers. CI/CD quality gates.',['Playwright','Cypress','Jest','Selenium','Python'],'2-4 years',85000,110000,'Hybrid','Boston, MA','Full Time',da(18),2],
      [tc,'Product Manager – Platform Growth','Own roadmap and ship features across design, engineering, and GTM.',['Product Roadmapping','Agile','JIRA','SQL','A/B Testing'],'4-7 years',140000,175000,'Hybrid','San Francisco, CA','Full Time',da(30),1],
      [tc,'DevOps / Platform Engineer','Kubernetes-based internal developer platform for 200+ engineers.',['Kubernetes','Helm','ArgoCD','Prometheus','Go'],'3-5 years',125000,155000,'Remote','Remote, USA','Full Time',da(22),2],
      [tc,'UI/UX Designer','User research, Figma prototypes, design system for enterprise SaaS.',['Figma','Prototyping','User Research','Design Systems','Accessibility'],'3-5 years',100000,130000,'Hybrid','New York, NY','Full Time',da(28),1],
      [tc,'Technical Writer (API & Dev Docs)','Document REST APIs, SDKs, and integration guides for developers.',['Technical Writing','Markdown','OpenAPI/Swagger','Git'],'2-4 years',75000,100000,'Remote','Remote, USA','Part Time',da(35),1],
      [tc,'GraphQL API Architect','Federated GraphQL schema governance across 12 product teams.',['GraphQL','Apollo Federation','Node.js','TypeScript','PostgreSQL'],'5-8 years',150000,190000,'Remote','San Francisco, CA','Full Time',da(14),1],
      [tc,'Security Engineer – AppSec','Lead security reviews, threat modelling, vulnerability management.',['OWASP Top 10','SAST/DAST','Penetration Testing','Python','AWS Security'],'4-7 years',145000,175000,'Remote','Remote, USA','Full Time',da(21),1],
      [tc,'Data Engineer – Real-Time Pipelines','Kafka, Spark Streaming, Delta Lake pipelines for analytics and ML.',['Apache Kafka','Spark','Python','Delta Lake','Airflow'],'3-5 years',120000,150000,'Remote','Chicago, IL','Full Time',da(40),2],
      [tc,'Embedded Systems Engineer','IoT edge firmware in C/C++ integrated with cloud platform.',['C','C++','FreeRTOS','MQTT','Bluetooth LE','Embedded Linux'],'3-6 years',115000,145000,'On-Site','San Jose, CA','Full Time',da(30),1],
      [tc,'Engineering Manager – Backend','Lead 8 backend engineers. Technical strategy, hiring, delivery.',['Team Leadership','System Design','Node.js','Agile','OKRs'],'7-10 years',175000,220000,'Hybrid','San Francisco, CA','Full Time',da(35),1],
      [tc,'Database Administrator (MongoDB & PostgreSQL)','Manage and tune production databases. Capacity planning and DR.',['MongoDB','PostgreSQL','Sharding','Query Optimisation','Backup & Recovery'],'4-7 years',120000,150000,'Hybrid','Dallas, TX','Full Time',da(28),1],
      /* NexaCloud (idx 16-28) */
      [nc,'Kubernetes Platform Engineer','Multi-tenant K8s SaaS across AWS and GCP. Helm and ArgoCD.',['Kubernetes','Helm','ArgoCD','AWS','GCP','Terraform','Go'],'3-6 years',135000,165000,'Remote','Austin, TX','Full Time',da(25),3],
      [nc,'Site Reliability Engineer (SRE)','SLOs, chaos engineering, automated remediation runbooks.',['SRE','Prometheus','Grafana','PagerDuty','Python','Go'],'4-7 years',140000,175000,'Remote','Remote, USA','Full Time',da(30),2],
      [nc,'Golang Backend Engineer','High-performance Go microservices for K8s orchestration engine.',['Go','gRPC','PostgreSQL','Kafka','Docker','Kubernetes'],'3-5 years',130000,160000,'Remote','Austin, TX','Full Time',da(20),4],
      [nc,'Cloud Networking Engineer','Multi-cloud VPCs, eBPF network policy, BGP routing.',['AWS VPC','GCP Networking','Istio','eBPF','BGP','Cilium'],'5-8 years',145000,185000,'Hybrid','Austin, TX','Full Time',da(35),1],
      [nc,'Terraform / IaC Engineer','Own Terraform provider ecosystem, reusable modules worldwide.',['Terraform','Terragrunt','Go','AWS','Azure','GCP','CI/CD'],'3-5 years',125000,155000,'Remote','Remote, USA','Full Time',da(15),2],
      [nc,'Solutions Architect (Enterprise)','Partner with Fortune 500 customers to architect NexaCloud deployments.',['Cloud Architecture','AWS/GCP','Kubernetes','Terraform','Pre-Sales'],'6-10 years',160000,200000,'Hybrid','New York, NY','Full Time',da(40),1],
      [nc,'Rust Systems Programmer','Performance-critical container runtime and network dataplane.',['Rust','Linux Kernel','eBPF','TCP/IP','C','Systems Programming'],'4-7 years',155000,195000,'Remote','Remote, USA','Full Time',da(28),2],
      [nc,'Technical Customer Success Engineer','Onboard enterprise customers, own escalations and retention.',['Kubernetes','Terraform','Linux','Customer Success','Python/Bash'],'3-5 years',100000,130000,'Hybrid','Austin, TX','Full Time',da(22),2],
      [nc,'Staff Engineer – Control Plane','Architect NexaCloud cluster lifecycle control plane.',['Go','Kubernetes Operator SDK','etcd','RBAC','CRDs','Distributed Systems'],'8-12 years',190000,240000,'Remote','Austin, TX','Full Time',da(50),1],
      [nc,'Developer Advocate – Cloud Native','Tech content, conference talks, open-source community.',['Technical Writing','Public Speaking','Kubernetes','Go or Python'],'3-6 years',115000,145000,'Remote','Remote, USA','Full Time',da(30),1],
      [nc,'Frontend Engineer – Admin Dashboard','React + TypeScript + WebSockets live cluster telemetry UI.',['React.js','TypeScript','WebSockets','D3.js','Tailwind CSS'],'2-4 years',105000,130000,'Remote','Remote, USA','Full Time',da(18),2],
      [nc,'Security Engineer – Cloud Hardening','CIS benchmarks, Falco, Trivy, OPA policy enforcement.',['Cloud Security','CIS Benchmarks','Falco','Trivy','OPA','Python'],'4-7 years',145000,180000,'Remote','Remote, USA','Full Time',da(25),1],
      [nc,'Data Platform Analyst','Usage metrics, churn signals, executive dashboards in BigQuery/Looker.',['SQL','BigQuery','Looker','Python','Tableau'],'2-4 years',90000,115000,'Hybrid','Austin, TX','Full Time',da(20),1],
      [nc,'Intern – Software Engineering (Summer 2027)','Real production projects alongside senior engineers.',['Go or Python','Basic Kubernetes','Git','Linux'],'0-1 years',40000,60000,'Hybrid','Austin, TX','Internship',da(60),5],
      /* AIWave Labs (idx 29-49) */
      [aw,'Machine Learning Engineer – LLM Products','Fine-tune and serve LLMs for enterprise automation.',['Python','PyTorch','HuggingFace','LangChain','vLLM','MLflow','CUDA'],'3-6 years',160000,200000,'Hybrid','Seattle, WA','Full Time',da(30),3],
      [aw,'AI Product Manager – Automation Suite','Own roadmap for no-code automation builder.',['Product Management','AI/ML Literacy','User Research','Agile','SQL'],'4-7 years',145000,185000,'Hybrid','Seattle, WA','Full Time',da(20),1],
      [aw,'NLP Research Engineer','Model research, evaluation frameworks, novel benchmarks.',['Python','PyTorch','NLP','Evaluation Metrics','RLHF'],'3-6 years',155000,195000,'Remote','Seattle, WA','Full Time',da(40),2],
      [aw,'MLOps Engineer','Training pipelines, model registries, A/B serving, drift monitoring.',['MLflow','Kubeflow','Python','Kubernetes','Feast','Seldon'],'3-5 years',140000,170000,'Remote','Remote, USA','Full Time',da(28),2],
      [aw,'Data Scientist – Predictive Analytics','Churn, lead scoring, anomaly detection with classical ML.',['Python','Scikit-learn','XGBoost','LightGBM','SQL','Pandas'],'2-5 years',120000,155000,'Hybrid','Seattle, WA','Full Time',da(22),3],
      [aw,'Computer Vision Engineer','Real-time CV pipelines for document intelligence and OCR.',['Python','OpenCV','YOLO','PyTorch','TensorRT','SageMaker'],'3-6 years',150000,185000,'Hybrid','Seattle, WA','Full Time',da(35),2],
      [aw,'Full Stack Engineer – AI Platform UI','React + FastAPI prompt playgrounds and workflow builders.',['React.js','TypeScript','FastAPI','Python','PostgreSQL','Redis'],'2-4 years',115000,145000,'Remote','Remote, USA','Full Time',da(18),3],
      [aw,'AI Ethics & Trust Engineer','Bias detection, hallucination monitoring, red-teaming.',['Python','LLM Evaluation','Bias Detection','RLHF','MLflow'],'3-6 years',145000,180000,'Hybrid','Seattle, WA','Full Time',da(45),1],
      [aw,'Data Annotation Lead','Lead global annotators for SFT and RLHF datasets.',['Data Annotation','Instruction Tuning','Python','Label Studio'],'2-4 years',80000,105000,'Remote','Remote, USA','Full Time',da(30),2],
      [aw,'Applied AI Researcher (PhD preferred)','Long-context reasoning, tool use, multi-modal research.',['Deep Learning','Research','PyTorch','Transformers','Python'],'4-8 years',200000,280000,'Hybrid','Seattle, WA','Full Time',da(60),2],
      [aw,'Enterprise Sales Engineer – AI Solutions','Technical pre-sales PoCs and RFPs for Fortune 500.',['Pre-Sales','AI/ML','Python (Demos)','Enterprise Sales','CRM'],'5-8 years',155000,200000,'Hybrid','New York, NY','Full Time',da(25),2],
      [aw,'Infrastructure Engineer – GPU Clusters','A100/H100 GPU cluster ops on AWS and on-prem.',['GPU Cluster','SLURM / Ray','Kubernetes','NCCL','InfiniBand','Linux'],'4-7 years',165000,205000,'On-Site','Seattle, WA','Full Time',da(35),2],
      [aw,'AI Integration Engineer','Connect AIWave APIs into enterprise ERPs and CRMs via middleware.',['Python','REST APIs','Zapier/n8n','Node.js','PostgreSQL','Docker'],'2-4 years',110000,140000,'Remote','Remote, USA','Full Time',da(22),3],
      [aw,'Prompt Engineer – Enterprise AI','Design and evaluate prompts for production LLM workflows.',['Prompt Engineering','Python','LLM Evaluation','LangChain','Documentation'],'1-3 years',95000,125000,'Remote','Remote, USA','Full Time',da(18),2],
      [aw,'AI Platform QA Engineer','End-to-end testing of ML model serving and API endpoints.',['Pytest','API Testing','Locust','Python','CI/CD','MLflow'],'2-4 years',90000,115000,'Remote','Remote, USA','Full Time',da(25),2],
    ];

    const J = [];
    for (const d of jobDefs) {
      const [rec,title,desc,skills,exp,sMin,sMax,wMode,loc,jType,deadline,openings] = d;
      const job = await Job.create({
        recruiter:rec.user._id, companyName:rec.profile.companyName, companyLogo:'',
        jobTitle:title, description:desc, requiredSkills:skills,
        experienceRequired:exp, salaryMin:sMin, salaryMax:sMax, salaryPeriod:'Yearly',
        location:loc, jobType:jType, workMode:wMode, educationRequirement:'Bachelor Degree or equivalent',
        openings, deadline, status:'active',
      });
      J.push(job);
    }
    console.log(`✅ Created ${J.length} jobs.`);

    // ════════════════════════════════
    // APPLICATIONS  (30)
    // ════════════════════════════════
    // Stage distribution: Applied×5, Under Review×5, Shortlisted×6, Interview Scheduled×5, Selected×5, Rejected×4
    const appDefs = [
      // [jobIdx, candIdx, status, daysAgoApplied]
      // ─── APPLIED ────────
      [0, 0,  'Applied',             2],
      [1, 8,  'Applied',             1],
      [4, 6,  'Applied',             3],
      [16,2,  'Applied',             1],
      [31,9,  'Applied',             2],
      // ─── UNDER REVIEW ───
      [2, 1,  'Under Review',        7],
      [5, 5,  'Under Review',        5],
      [12,7,  'Under Review',        6],
      [18,3,  'Under Review',        8],
      [34,17, 'Under Review',        4],
      // ─── SHORTLISTED ────
      [0, 4,  'Shortlisted',         12],
      [3, 10, 'Shortlisted',         10],
      [7, 2,  'Shortlisted',         9],
      [17,11, 'Shortlisted',         11],
      [32,20, 'Shortlisted',         8],
      [38,14, 'Shortlisted',         13],
      // ─── INTERVIEW SCHED ─
      [1, 5,  'Interview Scheduled', 18],
      [4, 15, 'Interview Scheduled', 15],
      [16,3,  'Interview Scheduled', 20],
      [30,8,  'Interview Scheduled', 14],
      [36,22, 'Interview Scheduled', 16],
      // ─── SELECTED ───────
      [6, 12, 'Selected',            30],
      [11,16, 'Selected',            25],
      [19,6,  'Selected',            28],
      [33,19, 'Selected',            22],
      [40,13, 'Selected',            35],
      // ─── REJECTED ───────
      [2, 21, 'Rejected',            20],
      [8, 23, 'Rejected',            18],
      [20,18, 'Rejected',            22],
      [37,24, 'Rejected',            30],
    ];

    const historyFor = (status, d) => {
      const h = { A:{ status:'Applied', updatedAt:daysAgo(d) } };
      const stages = {
        'Applied':             [h.A],
        'Under Review':        [h.A, { status:'Under Review',        updatedAt:daysAgo(d-2)  }],
        'Shortlisted':         [h.A, { status:'Under Review',        updatedAt:daysAgo(d-2)  }, { status:'Shortlisted',         updatedAt:daysAgo(d-5)  }],
        'Interview Scheduled': [h.A, { status:'Under Review',        updatedAt:daysAgo(d-3)  }, { status:'Shortlisted',         updatedAt:daysAgo(d-6)  }, { status:'Interview Scheduled', updatedAt:daysAgo(d-9)  }],
        'Selected':            [h.A, { status:'Under Review',        updatedAt:daysAgo(d-4)  }, { status:'Shortlisted',         updatedAt:daysAgo(d-8)  }, { status:'Interview Scheduled', updatedAt:daysAgo(d-13) }, { status:'Selected', updatedAt:daysAgo(d-18) }],
        'Rejected':            [h.A, { status:'Under Review',        updatedAt:daysAgo(d-4)  }, { status:'Rejected',            updatedAt:daysAgo(d-8)  }],
      };
      return stages[status] || [h.A];
    };

    const APPS = [];
    for (const [ji, ci, status, dAgo] of appDefs) {
      const job = J[ji]; const cand = C[ci];
      if (!job || !cand) { console.warn(`⚠ Skip app: job[${ji}] or cand[${ci}] missing`); continue; }
      const recruiterUser = R.find(r => r.user._id.toString() === job.recruiter.toString());
      const app = await Application.create({
        job:job._id, candidate:cand.user._id,
        recruiter: recruiterUser ? recruiterUser.user._id : R[0].user._id,
        resumeUrl: cand.profile.resumeUrl || '/uploads/sample-resume.pdf',
        coverLetter: rand(COVER_LETTERS),
        status, statusHistory: historyFor(status, dAgo), appliedAt: daysAgo(dAgo),
      });
      APPS.push(app);
    }
    console.log(`✅ Created ${APPS.length} applications.`);

    // ════════════════════════════════
    // INTERVIEWS
    // ════════════════════════════════
    const intApps = APPS.filter(a => a.status === 'Interview Scheduled');
    let iCount = 0;
    for (let i = 0; i < intApps.length; i++) {
      const a = intApps[i];
      const isOnline = i !== 3;
      await Interview.create({
        application:a._id, job:a.job, candidate:a.candidate, recruiter:a.recruiter,
        date: daysAhead(3 + i * 2).toISOString().split('T')[0],
        time: `${10 + i}:00 AM IST`, mode: isOnline ? 'Online' : 'Offline',
        meetingLink: isOnline ? `https://meet.google.com/${Math.random().toString(36).slice(2,8)}-${Math.random().toString(36).slice(2,8)}` : '',
        location: isOnline ? '' : '100 Innovation Blvd, Austin TX 78701',
        notes:'Prepare a system design problem and a short portfolio walkthrough. Bring relevant code samples.',
        status:'Scheduled',
      });
      iCount++;
    }
    console.log(`✅ Created ${iCount} interviews.`);

    // ════════════════════════════════
    // NOTIFICATIONS
    // ════════════════════════════════
    const MSGS = {
      'Under Review':        j => `Your application for "${j.jobTitle}" is now Under Review.`,
      'Shortlisted':         j => `🎉 You've been Shortlisted for "${j.jobTitle}"!`,
      'Interview Scheduled': j => `An interview has been scheduled for your "${j.jobTitle}" application.`,
      'Selected':            j => `🏆 Congratulations! You've been Selected for "${j.jobTitle}".`,
      'Rejected':            j => `Thank you for applying to "${j.jobTitle}". We've moved forward with other candidates.`,
    };
    const TITLES = {
      'Under Review': 'Application Under Review', 'Shortlisted': "You've Been Shortlisted! ⭐",
      'Interview Scheduled': 'Interview Scheduled 📅', 'Selected': 'Application Accepted! 🎉',
      'Rejected': 'Application Update',
    };
    let nCount = 0;
    for (const app of APPS) {
      if (app.status === 'Applied') continue;
      const job = J.find(j => j._id.toString() === app.job.toString());
      if (!job) continue;
      await Notification.create({
        recipient:app.candidate, sender:app.recruiter,
        type: app.status === 'Interview Scheduled' ? 'interview_scheduled' : 'status_updated',
        title: TITLES[app.status] || 'Application Update',
        message: MSGS[app.status]?.(job) || '',
        relatedJob:job._id, relatedApplication:app._id, read: Math.random() > 0.5,
      });
      nCount++;
    }
    console.log(`✅ Created ${nCount} notifications.`);

    // ════════════════════════════════
    // SAVED JOBS
    // ════════════════════════════════
    const mainCand = C[0];
    const saveIdxs = [1, 3, 5, 16, 30, 32];
    for (const idx of saveIdxs) {
      if (J[idx]) await SavedJob.create({ candidate:mainCand.user._id, job:J[idx]._id }).catch(()=>{});
    }
    console.log(`✅ Saved ${saveIdxs.length} jobs for candidate@example.com.`);

    // ════════════════════════════════
    // DONE
    // ════════════════════════════════
    console.log('\n══════════════════════════════════════════════════════');
    console.log('🎉  SEED COMPLETED SUCCESSFULLY!');
    console.log('══════════════════════════════════════════════════════');
    console.log('\n📊  SUMMARY');
    console.log(`  Recruiters   : ${R.length}  (TechCorp · NexaCloud · AIWave Labs)`);
    console.log(`  Candidates   : ${C.length}  (India, USA, Japan, EU, Africa, Korea...)`);
    console.log(`  Jobs         : ${J.length}  (Full-time, Contract, Internship, Part-time)`);
    console.log(`  Applications : ${APPS.length}  across all 6 Kanban pipeline stages`);
    console.log(`  Interviews   : ${iCount}`);
    console.log(`  Notifications: ${nCount}`);
    console.log('\n🔑  TEST ACCOUNTS');
    console.log('  ┌──────────────────────────────────────────────────┐');
    console.log('  │ ADMIN      admin@example.com     / password123   │');
    console.log('  │ RECRUITER  recruiter@example.com / password123   │');
    console.log('  │ RECRUITER  james@nexacloud.com   / password123   │');
    console.log('  │ RECRUITER  priya@aiwave.io       / password123   │');
    console.log('  │ CANDIDATE  candidate@example.com / password123   │');
    console.log('  └──────────────────────────────────────────────────┘\n');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seeding Error:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
};

seedDB();
