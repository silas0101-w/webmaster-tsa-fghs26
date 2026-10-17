export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export interface Lesson {
  id: string
  title: string
  minutes: number
  xp: number
  body: { heading?: string; text: string }[]
}

export interface Module {
  id: string
  index: string
  title: string
  tagline: string
  description: string
  gradient: string
  accent: string
  badge: { id: string; name: string; icon: string; description: string }
  lessons: Lesson[]
  quiz: QuizQuestion[]
}

export const modules: Module[] = [
  {
    id: 'fundamentals',
    index: '01',
    title: 'AI Fundamentals',
    tagline: 'Understand the machine.',
    description:
      'What AI actually is — and what it isn’t. From machine learning to neural networks to large language models, build the mental models that make everything else click.',
    gradient: 'from-blue-500 via-indigo-500 to-purple-600',
    accent: '#4f46e5',
    badge: {
      id: 'badge-fundamentals',
      name: 'Neural Navigator',
      icon: '🧠',
      description: 'Completed the AI Fundamentals module and passed the final quiz.',
    },
    lessons: [
      {
        id: 'what-is-ai',
        title: 'What Is AI, Really?',
        minutes: 6,
        xp: 50,
        body: [
          {
            text: 'Artificial Intelligence is software that performs tasks we used to think required human intelligence — recognizing faces, translating languages, writing essays, driving cars. But here’s the secret: modern AI doesn’t “think” the way you do. It finds patterns in enormous amounts of data and uses those patterns to make predictions.',
          },
          {
            heading: 'AI vs. traditional software',
            text: 'Traditional software follows explicit rules written by programmers: “IF the user clicks this, THEN do that.” AI flips this around. Instead of writing rules, engineers show the system millions of examples, and the system learns the rules by itself. A spam filter isn’t told what spam looks like — it learns from millions of emails labeled “spam” or “not spam.”',
          },
          {
            heading: 'Narrow vs. general AI',
            text: 'Every AI you’ve ever used — ChatGPT, Siri, Netflix recommendations — is “narrow AI”: excellent at one type of task, helpless outside it. “Artificial General Intelligence” (AGI), a system with human-like flexibility across all tasks, remains a research goal, not a reality. When headlines scare or hype you, ask: is this narrow AI doing a narrow job very well? Almost always, yes.',
          },
        ],
      },
      {
        id: 'how-ml-works',
        title: 'How Machines Learn',
        minutes: 8,
        xp: 60,
        body: [
          {
            text: 'Machine learning is the engine under modern AI. The core loop is surprisingly simple: make a prediction, check how wrong it was, adjust, repeat — millions or billions of times. Each adjustment nudges the model’s internal numbers (called parameters) toward better answers.',
          },
          {
            heading: 'Training data is everything',
            text: 'A model is only as good as its data. Train an image classifier mostly on pictures of golden retrievers labeled “dog,” and it may fail on chihuahuas. This is why data quality, diversity, and labeling matter more than fancy algorithms — and why bias in data becomes bias in AI.',
          },
          {
            heading: 'Neural networks',
            text: 'Neural networks are loosely inspired by the brain: layers of simple math units, each passing signals to the next layer. “Deep learning” just means many layers. A large language model like GPT is a deep neural network trained on vast text collections to predict the next word — and from that one simple task, startling abilities emerge.',
          },
          {
            heading: 'Overfitting and generalization',
            text: 'A good model generalizes — it performs well on new data it has never seen. A model that memorizes its training data but fails on new examples is “overfit,” like a student who memorized the practice test but can’t handle new questions.',
          },
        ],
      },
      {
        id: 'ai-in-daily-life',
        title: 'AI in Your Daily Life',
        minutes: 5,
        xp: 40,
        body: [
          {
            text: 'You already use AI dozens of times a day. Your phone unlocks with your face. TikTok and YouTube rank what you watch. Autocorrect predicts your next word. Maps reroutes you around traffic. Spam filters guard your inbox. Recommendation engines choose what appears in every feed you scroll.',
          },
          {
            heading: 'Why it matters to notice',
            text: 'Recognizing AI around you is the first step to using it deliberately instead of being used by it. Recommendation algorithms are optimized for watch time, not your wellbeing. Once you see the pattern, you can choose when to ride the algorithm and when to step off.',
          },
          {
            heading: 'Generative AI',
            text: 'The newest wave — generative AI — doesn’t just classify or recommend; it creates: text, images, music, code. That creative power is what makes tools like ChatGPT, Claude, and image generators so useful for learning… and so easy to misuse. The next two modules cover exactly that.',
          },
        ],
      },
    ],
    quiz: [
      {
        question: 'What makes machine learning different from traditional programming?',
        options: [
          'It uses faster computers',
          'The system learns rules from data instead of being given explicit rules',
          'It doesn’t require any data',
          'It always works without errors',
        ],
        answer: 1,
        explanation:
          'In ML, engineers provide examples and the system learns the rules itself, rather than following hand-written IF/THEN logic.',
      },
      {
        question: 'ChatGPT and Siri are examples of…',
        options: ['Artificial General Intelligence', 'Narrow AI', 'Conscious machines', 'Simple calculators'],
        answer: 1,
        explanation: 'All current AI is narrow AI — powerful within a specific domain, unable to generalize like a human.',
      },
      {
        question: 'A model that memorizes training data but fails on new data is…',
        options: ['Generalized', 'Overfit', 'Deep', 'Trained'],
        answer: 1,
        explanation: 'Overfitting means the model learned the training examples by heart instead of learning general patterns.',
      },
      {
        question: 'Why does training data quality matter so much?',
        options: [
          'It doesn’t — algorithms matter more',
          'Biased or narrow data produces biased or unreliable models',
          'It only affects the cost of training',
          'Data is deleted after training anyway',
        ],
        answer: 1,
        explanation: 'Models mirror their data. Gaps and bias in data become gaps and bias in the AI’s behavior.',
      },
    ],
  },
  {
    id: 'tools',
    index: '02',
    title: 'Tools & Techniques',
    tagline: 'Put AI to work.',
    description:
      'Hands-on skills: prompting like a pro, using AI as a study partner, fact-checking outputs, and building an academic workflow where AI amplifies your thinking instead of replacing it.',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    accent: '#0d9488',
    badge: {
      id: 'badge-tools',
      name: 'Prompt Pilot',
      icon: '🛠️',
      description: 'Completed the Tools & Techniques module and passed the final quiz.',
    },
    lessons: [
      {
        id: 'prompting',
        title: 'The Art of Prompting',
        minutes: 8,
        xp: 60,
        body: [
          {
            text: 'A prompt is how you talk to a generative AI — and the quality of what you get out depends heavily on what you put in. Vague prompts get vague answers. Specific, structured prompts get useful ones.',
          },
          {
            heading: 'The CLEAR framework',
            text: 'Context: tell the AI who you are and what you’re doing (“I’m a 10th grader studying for a biology test”). Limits: set boundaries (“explain in 200 words, no jargon”). Examples: show what good looks like (“format it like this: …”). Ask: state the exact task. Review: iterate — ask follow-ups, request revisions, push back.',
          },
          {
            heading: 'Prompts that teach vs. prompts that cheat',
            text: '“Write my essay about Macbeth” gets you a product — and nothing in your brain. “Quiz me on Macbeth Act 3, one question at a time, and explain my mistakes” builds skill. Same tool, completely different outcome. The prompt you choose is the choice.',
          },
        ],
      },
      {
        id: 'study-workflows',
        title: 'AI as a Study Partner',
        minutes: 7,
        xp: 60,
        body: [
          {
            text: 'Used well, AI is the most patient tutor you’ll ever have — it never gets tired of your questions. Here are workflows that actually improve learning.',
          },
          {
            heading: 'The Socratic tutor',
            text: 'Prompt: “Don’t give me the answer. Ask me guiding questions to help me solve this myself.” Research on learning shows that generating answers yourself (retrieval practice) builds memory far better than reading answers.',
          },
          {
            heading: 'The feedback loop',
            text: 'Draft your essay yourself first. Then ask AI: “Point out weak arguments and unclear sentences in my paragraph — don’t rewrite them.” You stay the author; AI becomes your editor.',
          },
          {
            heading: 'The explainer ladder',
            text: 'Stuck on a concept? Ask for explanations at increasing levels: “Explain photosynthesis like I’m 10… now like I’m in AP Bio… now give me the chemical equations.” Layered explanations build real understanding.',
          },
          {
            heading: 'The practice-test generator',
            text: 'Paste your notes and ask for 10 practice questions, then answer them without looking. AI-generated flashcards, quizzes, and worked examples turn passive review into active recall.',
          },
        ],
      },
      {
        id: 'verify',
        title: 'Trust, but Verify',
        minutes: 6,
        xp: 50,
        body: [
          {
            text: 'AI models hallucinate — they generate confident, fluent, completely wrong answers. They invent citations, mangle dates, and state fiction as fact. Fluency is not accuracy.',
          },
          {
            heading: 'The verification habit',
            text: 'For anything that matters — a fact in an essay, a statistic, a historical claim — check it against a primary or authoritative source. If AI gives you a citation, open it. Fake references are one of the most common hallucinations.',
          },
          {
            heading: 'Ask for uncertainty',
            text: 'Prompts like “What parts of your answer are you least confident about?” or “What would a critic say about this?” surface weak points. AI won’t volunteer doubt unless you ask.',
          },
          {
            heading: 'Cross-check tools',
            text: 'Compare answers across two different AI tools, and against a textbook or trusted site. Converging answers raise confidence; diverging answers tell you exactly where to dig deeper.',
          },
        ],
      },
    ],
    quiz: [
      {
        question: 'Which prompt is most likely to actually help you learn?',
        options: [
          '“Write my history essay for me.”',
          '“Quiz me on the causes of WWI, one question at a time, and explain my wrong answers.”',
          '“Summarize chapter 4 in one sentence.”',
          '“What’s on the test tomorrow?”',
        ],
        answer: 1,
        explanation: 'Active recall — generating answers yourself — builds memory. Having AI do the work builds nothing.',
      },
      {
        question: 'What is an AI “hallucination”?',
        options: [
          'When the AI refuses to answer',
          'A confident, fluent, but factually wrong answer',
          'A slow response',
          'A biased training dataset',
        ],
        answer: 1,
        explanation: 'Hallucinations are plausible-sounding fabrications — fake citations and wrong dates are classic examples.',
      },
      {
        question: 'In the CLEAR prompting framework, “Context” means…',
        options: [
          'Copy-pasting your whole assignment',
          'Telling the AI who you are and what situation you’re in',
          'Giving the AI your login',
          'Using long words',
        ],
        answer: 1,
        explanation: 'Context (“I’m a 9th grader studying cell biology”) lets the AI calibrate depth, tone, and examples.',
      },
      {
        question: 'AI gives you a perfect-looking citation for your paper. You should…',
        options: [
          'Use it — AI citations are always real',
          'Open and verify the source before citing it',
          'Delete it — citations don’t matter',
          'Ask a friend if it looks okay',
        ],
        answer: 1,
        explanation: 'Invented references are one of the most common hallucinations. Always verify before citing.',
      },
    ],
  },
  {
    id: 'ethics',
    index: '03',
    title: 'Ethics & Responsibility',
    tagline: 'Use it right.',
    description:
      'Academic integrity, bias and fairness, privacy, and the environmental footprint of AI. Learn the rules — written and unwritten — of being a responsible AI user.',
    gradient: 'from-orange-400 via-rose-500 to-pink-600',
    accent: '#e11d48',
    badge: {
      id: 'badge-ethics',
      name: 'Ethics Guardian',
      icon: '⚖️',
      description: 'Completed the Ethics & Responsibility module and passed the final quiz.',
    },
    lessons: [
      {
        id: 'academic-integrity',
        title: 'Academic Integrity in the AI Era',
        minutes: 7,
        xp: 60,
        body: [
          {
            text: 'Schools draw the line in different places, but the principle is universal: work you submit should represent your own learning. Submitting AI-generated work as your own is plagiarism — even if no human wrote it, you didn’t either.',
          },
          {
            heading: 'A practical rule of thumb',
            text: 'Ask: “Could I defend every sentence of this in a conversation with my teacher?” If AI wrote it and you can’t explain it, you’re not turning in your work — you’re laundering someone else’s (or something else’s).',
          },
          {
            heading: 'Disclosure builds trust',
            text: 'When allowed, cite AI use like any other source: “I used ChatGPT to brainstorm the outline; the research and writing are my own.” Many teachers respect transparent, permitted AI use — and punish hidden use far more harshly.',
          },
          {
            heading: 'Know your school’s policy',
            text: 'AI policies vary by class and teacher. When in doubt, ask before you use. “Is AI allowed for brainstorming on this assignment?” is a 10-second question that can save your academic record.',
          },
        ],
      },
      {
        id: 'bias-fairness',
        title: 'Bias, Fairness & Privacy',
        minutes: 7,
        xp: 60,
        body: [
          {
            text: 'AI learns from human data — and human data contains human prejudice. Hiring algorithms have downgraded résumés with women’s names; facial recognition has higher error rates for darker skin tones; language models can repeat stereotypes from their training text.',
          },
          {
            heading: 'You are the quality filter',
            text: 'When AI gives you an answer about people, cultures, or history, ask: whose perspective is this? What might be missing? Critical thinking about outputs isn’t optional — it’s the job.',
          },
          {
            heading: 'Your data is the price',
            text: 'Everything you type into an AI tool may be stored, reviewed, or used for training. Never paste personal information — yours or anyone else’s — into an AI chat: no addresses, passwords, health details, or a classmate’s private business.',
          },
          {
            heading: 'Deepfakes and misinformation',
            text: 'AI can now fabricate realistic images, audio, and video of real people. Creating or spreading deepfakes of classmates isn’t a prank — in many places it’s illegal, and everywhere it’s harmful. Verify before you share; never fabricate.',
          },
        ],
      },
      {
        id: 'big-picture',
        title: 'The Bigger Picture',
        minutes: 5,
        xp: 40,
        body: [
          {
            text: 'AI doesn’t run on magic — it runs on data centers that consume significant electricity and water. Training a single large model can emit as much carbon as several cars over their lifetimes. Your usage choices, multiplied by billions of users, matter.',
          },
          {
            heading: 'Jobs and skills',
            text: 'AI will reshape the job market in your working lifetime. The students who thrive won’t be those who avoid AI or those who let it think for them — they’ll be the ones who use AI to think better: more creatively, more critically, faster.',
          },
          {
            heading: 'The human stays in charge',
            text: 'Every principle in this module comes down to one idea: AI is a tool, and you are accountable for how you use it. Keep humans — starting with yourself — in the loop, in the know, and in control.',
          },
        ],
      },
    ],
    quiz: [
      {
        question: 'You submit an AI-written essay as your own work. This is…',
        options: [
          'Fine, since no human wrote it',
          'Plagiarism / a violation of academic integrity',
          'Only wrong if you get caught',
          'OK if you changed a few words',
        ],
        answer: 1,
        explanation: 'Submitting work you didn’t produce — human or AI — misrepresents your learning. That’s plagiarism.',
      },
      {
        question: 'Why can AI systems be biased?',
        options: [
          'Programmers add bias intentionally',
          'They learn from human data that contains human prejudice',
          'Bias is impossible in math',
          'Only old AI was biased',
        ],
        answer: 1,
        explanation: 'Models mirror their training data. Biased data in, biased outputs out.',
      },
      {
        question: 'Which of these is safe to paste into an AI chatbot?',
        options: [
          'Your home address',
          'A classmate’s medical issue',
          'A generic question about photosynthesis',
          'Your passwords',
        ],
        answer: 2,
        explanation: 'Never share personal data — yours or others’. Generic academic questions contain nothing private.',
      },
      {
        question: 'A friend shares a realistic AI-generated video of a teacher saying something they never said. You should…',
        options: [
          'Repost it — it’s funny',
          'Make one of a classmate in response',
          'Not share it, and tell them it’s harmful and possibly illegal',
          'Share it only in private chats',
        ],
        answer: 2,
        explanation: 'Deepfakes of real people cause real harm and are increasingly illegal. Don’t create or spread them.',
      },
    ],
  },
]

export const XP_PER_LEVEL = 300

export function levelForXp(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const intoLevel = xp % XP_PER_LEVEL
  return { level, intoLevel, progress: intoLevel / XP_PER_LEVEL }
}
