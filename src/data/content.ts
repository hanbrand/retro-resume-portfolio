import { mountMinesweeper } from '../ui/apps/minesweeper';
import { mountPaint } from '../ui/apps/paint';

export interface DesktopIcon {
  id: string;
  title: string;
  icon: string;
  component: string;
}

export const desktopIcons: DesktopIcon[] = [
  {
    id: 'about',
    title: 'About Me',
    icon: '/assets/icons/about.webp',
    component: 'about-window'
  },
  {
    id: 'resume',
    title: 'My Resume',
    icon: '/assets/icons/resume.webp',
    component: 'resume-window'
  },
  {
    id: 'publications',
    title: 'Publications',
    icon: '/assets/icons/publications.svg',
    component: 'publications-window'
  },
  {
    id: 'contact',
    title: 'Contact Me',
    icon: '/assets/icons/contact.webp',
    component: 'contact-window'
  },
  {
    id: 'paint',
    title: 'Paint',
    icon: '/assets/icons/paint.svg',
    component: 'paint-window'
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: '/assets/icons/minesweeper.svg',
    component: 'minesweeper-window'
  },
  {
    id: 'fun',
    title: 'Fun Surprise!',
    icon: '/assets/icons/fun.svg',
    component: 'fun-window'
  }
];

const dogPhotos = [
  '/assets/dogs/dog-1.jpeg',
  '/assets/dogs/dog-2.jpeg',
  '/assets/dogs/dog-3.jpeg',
  '/assets/dogs/dog-4.jpeg',
  '/assets/dogs/dog-5.jpeg',
  '/assets/dogs/dog-6.jpeg',
  '/assets/dogs/dog-7.jpeg'
];

const dogGallery = dogPhotos
  .map(
    (src, i) => `
        <div class="dog-tile" data-src="${src}" tabindex="0">
          <div class="dog-thumb"><img src="${src}" loading="lazy" alt="Dog photo ${i + 1}" /></div>
          <span>DSC_000${i + 1}.JPG</span>
        </div>`
  )
  .join('');

const publications = [
  {
    title: 'Optimization of a micro-scale air-liquid-interface model of human proximal airway epithelium for moderate throughput drug screening for SARS-CoV-2',
    venue: 'Respiratory Research',
    year: '2025',
    type: 'Journal article',
    url: 'https://link.springer.com/article/10.1186/s12931-025-03095-y'
  },
  {
    title: 'High Throughput Screening with a Primary Human Mucociliary Airway Model Identifies a Small Molecule with Anti-SARS-CoV-2 Activity',
    venue: 'bioRxiv',
    year: '2024',
    type: 'Preprint',
    url: 'https://www.biorxiv.org/content/10.1101/2024.05.09.593388v1'
  },
  {
    title: 'Antiviral drug screen identifies DNA-damage response inhibitor as potent blocker of SARS-CoV-2 replication',
    venue: 'Cell Reports',
    year: '2021',
    type: 'Journal article',
    url: 'https://www.cell.com/cell-reports/fulltext/S2211-1247(21)00254-0'
  },
  {
    title: 'Commercial immunoglobulin products contain cross-reactive but not neutralizing antibodies against SARS-CoV-2',
    venue: 'Journal of Allergy and Clinical Immunology',
    year: '2021',
    type: 'Journal article',
    url: 'https://www.jacionline.org/article/S0091-6749(20)31765-6/fulltext'
  },
  {
    title: 'An activation-based high throughput screen identifies caspase-10 inhibitors',
    venue: 'bioRxiv',
    year: '2024',
    type: 'Preprint',
    url: 'https://www.biorxiv.org/content/10.1101/2024.12.15.625925v1'
  }
];

const publicationShortcuts = publications
  .map(
    (publication, i) => `
        <a class="publication-shortcut" href="${publication.url}" target="_blank" rel="noopener" aria-label="Open ${publication.title}">
          <span class="publication-doc-icon" aria-hidden="true"></span>
          <span class="publication-copy">
            <span class="publication-title">${publication.title}</span>
            <span class="publication-meta">${publication.venue} &middot; ${publication.year} &middot; ${publication.type}</span>
            <span class="publication-file">Publication_${String(i + 1).padStart(2, '0')}.url</span>
          </span>
        </a>`
  )
  .join('');

export interface AppData {
  title: string;
  icon?: string;
  content: string;
  mount?: (root: HTMLElement) => void | (() => void);
}

export const apps: Record<string, AppData> = {
  'about-window': {
    title: 'About Me',
    icon: '/assets/icons/about.webp',
    content: `
      <div class="window-content-inner">
        <div class="about-hero">
          <img src="/assets/user/me.jpg" alt="Brandon Han" class="about-photo" />
          <div>
            <h2>Hi, I'm Brandon Han.</h2>
            <p><strong>ML / AI Engineer</strong> &mdash; Applied NLP, Computer Vision, and Production ML Systems.</p>
            <p>Based in Los Angeles, CA. M.S. in Computer Science from USC (May 2026), B.S. from UCLA.</p>
          </div>
        </div>
        <hr/>
        <p>
          I really enjoy taking chaotic data&mdash;like support tickets or stock market feeds&mdash;and building the pipelines that make it actually useful for a human or a model to act on.
          Recently, my focus has been split between applied AI&mdash;like auditing LLMs for political bias&mdash;and getting building out agent workflows and tools.
        </p>
        <p style="font-size: 12px; color: #555;">
          Tip: double-click <strong>My Resume</strong> for the full story, or open
          <strong>Contact Me</strong> to get in touch. The <strong>Fun</strong> folder has
          dog photos &mdash; required viewing.
        </p>
      </div>
    `
  },

  'resume-window': {
    title: 'Resume - Brandon Han',
    icon: '/assets/icons/resume.webp',
    content: `
      <div class="window-content-inner resume">
        <div class="resume-header">
          <h2>Brandon Han</h2>
          <p class="resume-tagline">ML / AI Engineer &middot; Machine Learning &middot; Applied NLP &middot; Agentic Workflows</p>
          <p class="resume-contact">
            <a href="https://www.thehanbrand.dev" target="_blank" rel="noopener">thehanbrand.dev</a>
            &nbsp;&middot;&nbsp; <a href="mailto:brandonh4n@gmail.com">brandonh4n@gmail.com</a>
            &nbsp;&middot;&nbsp; <a href="https://www.linkedin.com/in/brandonh4n" target="_blank" rel="noopener">LinkedIn</a>
            &nbsp;&middot;&nbsp; <a href="https://github.com/hanbrand" target="_blank" rel="noopener">GitHub</a>
          </p>
        </div>

        <div class="resume-section">
          <h3>Education</h3>
          <div class="job">
            <h4>University of Southern California <span class="loc">Los Angeles, CA</span></h4>
            <p class="meta">Master of Science, Computer Science &middot; January 2024 &ndash; May 2026</p>
            <p class="muted">Coursework: Advanced Databases, Algorithms, Machine Learning, Deep Learning &amp; Optimization, Web Technologies</p>
          </div>
          <div class="job">
            <h4>University of California, Los Angeles <span class="loc">Los Angeles, CA</span></h4>
            <p class="meta">Bachelor of Science, Biochemistry &middot; September 2017 &ndash; December 2019</p>
          </div>
        </div>

        <div class="resume-section">
          <h3>Technical Skills</h3>
          <ul class="skills">
            <li><strong>Languages:</strong> Python, Java, C++, C, JavaScript, TypeScript, SQL, Go</li>
            <li><strong>ML &amp; NLP:</strong> PyTorch, TensorFlow, Hugging Face Transformers, BERT, scikit-learn</li>
            <li><strong>Data &amp; Evaluation:</strong> Pandas, NumPy, VADER, Model Evaluation</li>
            <li><strong>Engineering:</strong> Flask, FastAPI, Node.js, React, PostgreSQL, MySQL, MongoDB, Docker, AWS, Git</li>
          </ul>
        </div>

        <div class="resume-section">
          <h3>Projects</h3>
          <div class="job">
            <h4>Bias Induced News Generation with LLMs <span class="loc">PyTorch, Hugging Face, BERT</span></h4>
            <p class="meta">Machine Learning Engineer &middot; May 2026</p>
            <ul>
              <li>Engineered an automated evaluation pipeline to expose and quantify political bias across multiple LLM architectures.</li>
              <li>Built a pipeline for the ingestion, cleaning, and labeling of multi-partisan news snippets for LLM evaluation.</li>
              <li>Processed 14,000 biased articles to automate the generation and scoring of 1,700 test cases.</li>
            </ul>
          </div>
          <div class="job">
            <h4>Stock Sentiment Tracker <span class="loc">Python, Hugging Face, Flask, SHAP</span></h4>
            <p class="meta">Machine Learning Engineer &middot; November 2025</p>
            <ul>
              <li>Fine-tuned FinBERT for informal finance text by relabeling StockEmotions with Twitter-RoBERTa and training on social-market language.</li>
              <li>Improved accuracy on informal finance text by 57% against baseline setup, then benchmarked using MSE and MAE.</li>
              <li>Implemented SHAP to inspect model predictions and identify finance-specific sentiment cues that were easy to miss in standard language models.</li>
            </ul>
          </div>
          <div class="job">
            <h4>Weenix Operating System Kernel Development <span class="loc">C, x86 Assembly, GNU Make, QEMU</span></h4>
            <p class="meta">Software Engineer &middot; February 2025</p>
            <ul>
              <li>Engineered foundational system components for a 32-bit architecture.</li>
              <li>Developed process and thread life-cycle management, context switching, thread bootstrap, and scheduler queue primitives.</li>
              <li>Integrated software with emulated hardware (QEMU) using C and Assembly, navigating complex system constraints, physical memory allocation, and concurrency.</li>
            </ul>
          </div>
        </div>

        <div class="resume-section">
          <h3>Experience</h3>
          <div class="job">
            <h4>Wasabi Cloud Technologies &mdash; AI Engineering Intern (Remote) <span class="loc">Boston, MA</span></h4>
            <p class="meta">June 2025 &ndash; August 2025</p>
            <ul>
              <li>Built a React dashboard that brought customer requests, upload failures, and deploy notes into one escalation timeline, reducing median incident handoff time by 23%.</li>
              <li>Created labeled datasets from historical support tickets, customer notes, and internal business text to improve AI model accuracy on company-specific language and recurring issue patterns.</li>
              <li>Developed a first-pass AI triage workflow that converted ticket text and error patterns into plain-language diagnostic notes for support teams.</li>
            </ul>
          </div>
          <div class="job">
            <h4>University of California, Los Angeles &mdash; Research Operations Manager <span class="loc">Los Angeles, CA</span></h4>
            <p class="meta">January 2019 &ndash; December 2023</p>
            <ul>
              <li>Led rollout of GPU-backed compute and multi-vendor lab systems, translating wet-lab constraints into implementation plans, integration tests, and researcher onboarding.</li>
              <li>Developed architecture and deployed automated workflows, imaging, and compute platforms through technical proposals and systems planning.</li>
              <li>Contributed to 5 peer-reviewed publications involving ML implementation, imaging pipelines, and research infrastructure.</li>
            </ul>
          </div>
        </div>

        <div class="resume-actions">
          <a href="/assets/resume/Brandon-Han-Resume-2026.pdf" target="_blank" rel="noopener" class="xp-button">Open PDF</a>
          <a href="/assets/resume/Brandon-Han-Resume-2026.pdf" download="Brandon-Han-Resume-2026.pdf" class="xp-button">Download PDF</a>
        </div>
      </div>
    `
  },

  'projects-window': {
    title: 'My Projects',
    icon: '/assets/icons/projects.webp',
    content: `
      <div class="window-content-inner">
        <div class="projects-grid">
          <div class="project-card">
            <div class="project-icon">&#128218;</div>
            <h4>Bias-Induced News Gen</h4>
            <p>LLM bias evaluation pipeline across multiple architectures. 14k articles &rarr; 1,700 scored test cases.</p>
            <p class="tech">PyTorch &middot; Hugging Face &middot; BERT</p>
          </div>
          <div class="project-card">
            <div class="project-icon">&#128200;</div>
            <h4>Stock Sentiment Tracker</h4>
            <p>FinBERT fine-tuned on relabeled StockEmotions. +57% accuracy on informal finance text, with SHAP explainability.</p>
            <p class="tech">Python &middot; Flask &middot; SHAP</p>
          </div>
          <div class="project-card">
            <div class="project-icon">&#128187;</div>
            <h4>Weenix OS Kernel</h4>
            <p>32-bit kernel built on QEMU: threads, scheduler, context switching, physical memory.</p>
            <p class="tech">C &middot; x86 ASM &middot; QEMU</p>
          </div>
          <div class="project-card">
            <div class="project-icon">&#128421;</div>
            <h4>Windows XP Portfolio</h4>
            <p>This very site. Vanilla TS + Vite recreating the XP shell, windowing, and start menu.</p>
            <p class="tech">TypeScript &middot; Vite</p>
          </div>
        </div>
      </div>
    `
  },

  'publications-window': {
    title: 'Publications',
    icon: '/assets/icons/publications.svg',
    content: `
      <div class="window-content-inner publications">
        <div class="explorer-menu">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Favorites</span>
          <span>Tools</span>
          <span>Help</span>
        </div>
        <div class="explorer-toolbar">
          <button type="button" class="explorer-nav" aria-label="Back">Back</button>
          <button type="button" class="explorer-nav" aria-label="Forward">Forward</button>
          <span class="explorer-separator"></span>
          <span class="explorer-tool">Search</span>
          <span class="explorer-tool">Folders</span>
          <span class="explorer-tool">Views</span>
        </div>
        <div class="explorer-address">
          <span>Address</span>
          <span class="explorer-address-field">C:\\Documents and Settings\\Brandon\\My Documents\\Publications</span>
        </div>
        <div class="publications-explorer">
          <div class="publication-sidebar">
            <div class="publication-panel">
              <h3>Publication Tasks</h3>
              <p>5 research links</p>
            </div>
            <div class="publication-panel">
              <h3>Details</h3>
              <p>Brandon Han</p>
              <p>Research publications</p>
            </div>
          </div>
          <div class="publication-list" aria-label="Publication links">
            ${publicationShortcuts}
          </div>
        </div>
        <div class="publication-status">5 objects</div>
      </div>
    `
  },

  'contact-window': {
    title: 'Contact Me',
    icon: '/assets/icons/contact.webp',
    content: `
      <div class="window-content-inner">
        <h2>Get in Touch</h2>
        <p>Best reached by email. Always happy to talk ML systems, NLP eval, or applied AI roles.</p>
        <ul class="contact-list">
          <li><strong>Email:</strong> <a href="mailto:brandonh4n@gmail.com">brandonh4n@gmail.com</a></li>
          <li><strong>Website:</strong> <a href="https://www.thehanbrand.dev" target="_blank" rel="noopener">thehanbrand.dev</a></li>
          <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/brandonh4n" target="_blank" rel="noopener">linkedin.com/in/brandonh4n</a></li>
          <li><strong>GitHub:</strong> <a href="https://github.com/hanbrand" target="_blank" rel="noopener">github.com/hanbrand</a></li>
        </ul>
        <hr/>
        <form class="contact-form" data-contact-form>
          <input type="text" name="name" placeholder="Your Name" autocomplete="name" />
          <input type="email" name="email" placeholder="Your Email" autocomplete="email" required />
          <textarea rows="4" name="message" placeholder="Message" required></textarea>
          <input type="text" name="company" class="contact-honeypot" tabindex="-1" autocomplete="off" />
          <button type="submit" class="xp-button" data-contact-submit>Send Message</button>
          <p class="contact-status" data-contact-status role="status" aria-live="polite"></p>
        </form>
      </div>
    `
  },

  'paint-window': {
    title: 'Paint',
    icon: '/assets/icons/paint.svg',
    content: '<div class="paint-app" data-paint-app></div>',
    mount: mountPaint
  },

  'minesweeper-window': {
    title: 'Minesweeper',
    icon: '/assets/icons/minesweeper.svg',
    content: '<div class="minesweeper-app" data-minesweeper-app></div>',
    mount: mountMinesweeper
  },

  'fun-window': {
    title: 'Fun - Dog Photos',
    icon: '/assets/icons/fun.svg',
    content: `
      <div class="window-content-inner fun">
        <div class="fun-toolbar">
          <span><strong>My Pictures &rsaquo; Dogs</strong></span>
          <span class="fun-count">${dogPhotos.length} items</span>
        </div>
        <p class="fun-blurb">
          A small folder of dog photos for whoever needs them today. Click any thumbnail to view it full size.
        </p>
        <div class="dog-grid">
          ${dogGallery}
        </div>
        <div class="dog-lightbox hidden" data-lightbox>
          <img alt="Selected dog" />
          <button class="xp-button lightbox-close" type="button">Close</button>
        </div>
      </div>
    `
  }
};
