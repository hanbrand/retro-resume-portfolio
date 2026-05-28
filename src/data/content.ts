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
    id: 'contact',
    title: 'Contact Me',
    icon: '/assets/icons/contact.webp',
    component: 'contact-window'
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

interface AppData {
  title: string;
  icon?: string;
  content: string;
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
          Tip: double-click <strong>My Resume</strong> for the full story, or check out
          <strong>My Projects</strong>. The <strong>Fun</strong> folder has dog photos &mdash;
          required viewing.
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
          <p class="resume-tagline">ML / AI Engineer &middot; Applied NLP, Computer Vision, Production ML Systems</p>
          <p class="resume-contact">
            <a href="https://www.thehanbrand.dev" target="_blank" rel="noopener">thehanbrand.dev</a>
            &nbsp;&middot;&nbsp; (626) 404-4082
            &nbsp;&middot;&nbsp; <a href="mailto:brandonh4n@gmail.com">brandonh4n@gmail.com</a>
            &nbsp;&middot;&nbsp; <a href="https://www.linkedin.com/in/brandonh4n" target="_blank" rel="noopener">LinkedIn</a>
            &nbsp;&middot;&nbsp; <a href="https://github.com/brandonh4n" target="_blank" rel="noopener">GitHub</a>
          </p>
        </div>

        <div class="resume-section">
          <h3>Education</h3>
          <div class="job">
            <h4>University of Southern California <span class="loc">Los Angeles, CA</span></h4>
            <p class="meta">Master of Science &middot; January 2024 &ndash; May 2026</p>
            <p class="muted">Coursework: Advanced Databases, Algorithms, Machine Learning, Deep Learning &amp; Optimization, Web Technologies</p>
          </div>
          <div class="job">
            <h4>University of California, Los Angeles <span class="loc">Los Angeles, CA</span></h4>
            <p class="meta">Bachelor of Science &middot; January 2017 &ndash; December 2019</p>
          </div>
        </div>

        <div class="resume-section">
          <h3>Technical Skills</h3>
          <ul class="skills">
            <li><strong>Languages:</strong> Python, Java, C++, C, JavaScript, TypeScript, SQL, Go</li>
            <li><strong>ML &amp; NLP:</strong> PyTorch, TensorFlow, Hugging Face Transformers, RoBERTa, scikit-learn</li>
            <li><strong>Data &amp; Evaluation:</strong> Pandas, NumPy, VADER, Model Evaluation</li>
            <li><strong>Engineering:</strong> Flask, FastAPI, Node.js, React, PostgreSQL, MySQL, MongoDB, Docker, AWS, Git</li>
          </ul>
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
              <li>Secured $1.2M in infrastructure funding for automation, imaging, and compute platforms through technical proposals and systems planning.</li>
              <li>Contributed to 5 peer-reviewed publications involving ML implementation, imaging pipelines, and research infrastructure.</li>
            </ul>
          </div>
        </div>

        <div class="resume-section">
          <h3>Projects</h3>
          <div class="job">
            <h4>Bias Induced News Generation with LLMs <span class="loc">PyTorch, Hugging Face, RoBERTa</span></h4>
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
              <li>Improved accuracy on informal finance text by 57% against baseline, benchmarked with MSE and MAE.</li>
              <li>Used SHAP to inspect predictions and surface finance-specific sentiment cues that standard language models miss.</li>
            </ul>
          </div>
          <div class="job">
            <h4>Weenix Operating System Kernel Development <span class="loc">C, x86 Assembly, GNU Make, QEMU</span></h4>
            <p class="meta">Software Engineer &middot; February 2025</p>
            <ul>
              <li>Engineered foundational system components for a 32-bit architecture.</li>
              <li>Developed process and thread life-cycle management, context switching, thread bootstrap, and scheduler queue primitives.</li>
              <li>Integrated software with emulated hardware (QEMU) using C and Assembly, navigating concurrency and physical memory allocation.</li>
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
            <p class="tech">PyTorch &middot; Hugging Face &middot; RoBERTa</p>
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

  'contact-window': {
    title: 'Contact Me',
    icon: '/assets/icons/contact.webp',
    content: `
      <div class="window-content-inner">
        <h2>Get in Touch</h2>
        <p>Best reached by email. Always happy to talk ML systems, NLP eval, or applied AI roles.</p>
        <ul class="contact-list">
          <li><strong>Email:</strong> <a href="mailto:brandonh4n@gmail.com">brandonh4n@gmail.com</a></li>
          <li><strong>Phone:</strong> <a href="tel:+16264044082">(626) 404-4082</a></li>
          <li><strong>Website:</strong> <a href="https://www.thehanbrand.dev" target="_blank" rel="noopener">thehanbrand.dev</a></li>
          <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/brandonh4n" target="_blank" rel="noopener">linkedin.com/in/brandonh4n</a></li>
          <li><strong>GitHub:</strong> <a href="https://github.com/brandonh4n" target="_blank" rel="noopener">github.com/brandonh4n</a></li>
        </ul>
        <hr/>
        <form class="contact-form" onsubmit="event.preventDefault(); window.location.href='mailto:brandonh4n@gmail.com?subject=' + encodeURIComponent('Hello from your XP site') + '&body=' + encodeURIComponent(this.message.value);">
          <input type="text" name="name" placeholder="Your Name" />
          <input type="email" name="email" placeholder="Your Email" />
          <textarea rows="4" name="message" placeholder="Message"></textarea>
          <button type="submit" class="xp-button">Send via Email</button>
        </form>
      </div>
    `
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
