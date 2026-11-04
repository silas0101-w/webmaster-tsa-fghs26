export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export interface VideoSegment {
  timestamp: string
  label: string
}

export interface LessonVideo {
  id: string
  title: string
  duration: string
  instructorNote: string
  summary: string
  segments: VideoSegment[]
}

export interface Lesson {
  id: string
  title: string
  minutes: number
  xp: number
  summary: string
  video: LessonVideo
  body: { heading?: string; text: string }[]
  keyTakeaways: string[]
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
      'What AI actually is — and what it isn’t. From rule-based logic and statistical machine learning to deep neural networks, transformers, multimodal perception, and recommendation feeds, build the mental models that make every AI system click.',
    gradient: 'from-blue-500 via-indigo-500 to-purple-600',
    accent: '#4f46e5',
    badge: {
      id: 'badge-fundamentals',
      name: 'Neural Navigator',
      icon: '🧠',
      description: 'Completed all five AI Fundamentals lessons and passed the chapter knowledge check.',
    },
    lessons: [
      {
        id: 'what-is-ai',
        title: 'What Is AI, Really?',
        minutes: 11,
        xp: 60,
        summary:
          'Distinguish human intelligence from statistical pattern matching, compare explicit rule-based programming with learned models, and separate Narrow AI from science-fiction AGI.',
        video: {
          id: 'vid-what-is-ai',
          title: 'Field Video 1.1 — Pattern Prediction vs. Human Thought',
          duration: '10:45',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Walks through how modern AI predicts patterns from data without human awareness, compares IF/THEN code against learned spam filters, and explains why every tool in your pocket is Narrow AI.',
          segments: [
            { timestamp: '00:00', label: 'Pattern Prediction vs. Understanding' },
            { timestamp: '02:15', label: 'AI vs. Rule-Based Software' },
            { timestamp: '04:40', label: 'Narrow AI vs. General AI (AGI)' },
            { timestamp: '07:05', label: 'From Symbolic Logic to Modern Scale' },
            { timestamp: '08:55', label: 'Reading AI Headlines Critically' },
          ],
        },
        body: [
          {
            heading: 'Pattern prediction, not human understanding',
            text: 'Artificial Intelligence is software that performs tasks we used to think required human intelligence — recognizing faces, translating languages, summarizing articles, or navigating city streets. Here is the foundational secret: modern AI does not “know” or “understand” things the way you do. When you read the word “thunderstorm,” you recall the smell of rain, the flash of lightning, and the sound of thunder. When an AI processes “thunderstorm,” it maps a statistical cluster of numbers that frequently appear near words like “umbrella,” “barometer,” and “cumulonimbus.” It is an extraordinary engine for finding patterns in massive datasets and using those patterns to make high-probability predictions.',
          },
          {
            heading: 'AI vs. traditional rule-based software',
            text: 'For decades, most software followed explicit, deterministic rules written by human programmers: “IF a student’s score is 90 or above, THEN assign an A.” That works beautifully for calculators, tax forms, and traffic lights, where the rules are fixed and clear. But try writing explicit IF/THEN rules for recognizing a handwritten number “7” or spotting a golden retriever in a blurry backyard photo — the lighting, angle, and background change every single time. Machine learning flips the paradigm: instead of programmers writing the rules by hand, engineers feed the computer hundreds of thousands of labeled examples, and the system infers the statistical rules by itself.',
          },
          {
            heading: 'Narrow AI vs. Artificial General Intelligence (AGI)',
            text: 'Every AI system you have ever interacted with — ChatGPT, Siri, Spotify’s Discover Weekly, chess engines, or hospital X-ray scanners — is “Narrow AI.” Narrow AI can be superhuman at one bounded category of task while remaining completely helpless outside it. An AI that defeats the world champion at Go cannot play tic-tac-toe unless it is retrained, nor does it know what a board game is. “Artificial General Intelligence” (AGI) refers to a hypothetical system with human-like adaptability, common sense, and self-directed learning across any domain. AGI remains an open research question, not a product sitting on a server today.',
          },
          {
            heading: 'From symbolic logic to data-driven scale',
            text: 'Computer scientists coined the phrase “Artificial Intelligence” at a summer workshop at Dartmouth College in 1956. For the first several decades, researchers focused on “symbolic AI” (often called Good Old-Fashioned AI), trying to hand-code encyclopedias of logical rules and expert decision trees. Those systems were brittle: one unexpected real-world exception broke the chain. The modern AI wave took off when three ingredients converged in the 2010s: internet-scale datasets, graphics processing units (GPUs) capable of running billions of math operations in parallel, and multi-layered neural network architectures.',
          },
          {
            heading: 'Reading AI headlines with a critical eye',
            text: 'Because AI outputs look fluent and human-like, news stories often use anthropomorphic verbs like “thinks,” “believes,” “hallucinates,” or “wants.” Whenever you read a dramatic claim about a new model, ask three grounding questions: What exact inputs was this model trained on? What narrow prediction task is it optimizing? And where does its performance break down when tested outside its training distribution? Asking those three questions turns mystique into engineering.',
          },
        ],
        keyTakeaways: [
          'Modern AI operates through statistical pattern matching and probability, not conscious comprehension.',
          'Traditional software runs on human-written IF/THEN rules; machine learning infers patterns directly from examples.',
          'All deployed AI today is Narrow AI designed for bounded tasks, whereas AGI remains theoretical.',
        ],
      },
      {
        id: 'how-ml-works',
        title: 'How Machines Learn from Data',
        minutes: 13,
        xp: 70,
        summary:
          'Trace the training loop of prediction, loss calculation, and parameter adjustment, explore the three paradigms of machine learning, and see why generalization beats memorization.',
        video: {
          id: 'vid-how-ml-works',
          title: 'Field Video 1.2 — Inside the Machine Learning Loop',
          duration: '12:20',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Animates how a model starts with random guesses, measures error with a loss function, nudges billions of weights, and tests for overfitting vs. true generalization.',
          segments: [
            { timestamp: '00:00', label: 'The Core Loop: Guess, Measure, Adjust' },
            { timestamp: '02:35', label: 'Supervised, Unsupervised & Reinforcement Learning' },
            { timestamp: '05:20', label: 'Why Training Data Quality Is Everything' },
            { timestamp: '08:05', label: 'Overfitting vs. Generalization' },
            { timestamp: '10:15', label: 'Features & High-Dimensional Embeddings' },
          ],
        },
        body: [
          {
            heading: 'The core loop: predict, measure error, adjust',
            text: 'At the heart of machine learning is a remarkably simple feedback loop repeated millions or billions of times. When a model is first initialized, its internal settings — millions or billions of adjustable numbers called “weights” or “parameters” — are essentially random. You show the model an input (say, data about a house’s square footage and zip code) and ask it to predict the price. Its first guess is terrible. A mathematical formula called a “loss function” calculates the exact distance between the model’s guess and the true answer. Then an optimization algorithm (gradient descent) slightly nudges each weight in the direction that reduces that error on the next try.',
          },
          {
            heading: 'Three ways machines learn: supervised, unsupervised, and reinforcement',
            text: 'Machine learning generally falls into three training styles. In “supervised learning,” every training example comes with a human-verified answer key (emails labeled “spam” or “not spam,” skin lesions labeled “benign” or “malignant”). In “unsupervised/self-supervised learning,” the model explores unlabeled data to discover hidden structure or predicts masked-out pieces of the data itself — which is how large language models learn from raw text on the web. In “reinforcement learning,” an agent learns by trial and error inside an environment, receiving numerical rewards for good moves and penalties for mistakes, much like training a game-playing bot or a robotic arm.',
          },
          {
            heading: 'Training data is the ceiling of model quality',
            text: 'Computer scientists have an old saying: “Garbage in, garbage out.” A model can only learn patterns that exist in its training corpus. If you train an image classifier to recognize “dogs” using 50,000 sunny outdoor photos of golden retrievers, it may classify a pug on a couch as a cat — or worse, learn that “green grass in the background” is what makes an image a dog! In one famous medical study, an AI trained to detect pneumonia in chest X-rays actually learned to spot the metal token placed on portable X-ray machines used only in the intensive care unit. Data diversity, accurate labels, and careful auditing matter more than clever math.',
          },
          {
            heading: 'Overfitting vs. generalization',
            text: 'The ultimate goal of machine learning is “generalization”: performing accurately on brand-new examples the model has never seen before. If a model has too many parameters or trains for too long on a small dataset, it can “overfit” — memorizing the exact noise and quirks of its training examples instead of the underlying rule. It is like a student who memorizes the letter sequence “B, A, D, C” from last year’s practice sheet instead of learning how to solve the algebra equations. To catch overfitting, engineers always lock away a separate “test set” of data that the model is never allowed to see during training, using it as a final exam.',
          },
          {
            heading: 'Turning the world into coordinates (features and embeddings)',
            text: 'Because computers only perform arithmetic on numbers, every piece of data must be converted into numerical lists called “vectors” or “embeddings.” In an embedding space with hundreds of dimensions, concepts with similar meanings land at nearby coordinates: the vector for “kitten” sits close to “cat” and “puppy,” while “submarine” sits far away. Even relationships become geometric directions — the vector step from “Paris” to “France” mirrors the step from “Tokyo” to “Japan.”',
          },
        ],
        keyTakeaways: [
          'Models learn by making predictions, measuring error via a loss function, and iteratively updating internal weights.',
          'Supervised learning uses labeled answer keys, self-supervised learning predicts hidden parts of raw data, and reinforcement learning optimizes rewards.',
          'Overfitting happens when a model memorizes training data quirks rather than generalizing to unseen test examples.',
        ],
      },
      {
        id: 'neural-networks-and-llms',
        title: 'Inside Neural Networks & Language Models',
        minutes: 14,
        xp: 80,
        summary:
          'Look under the hood of deep learning, tokenization, the Transformer self-attention mechanism, next-token probabilities, and post-training alignment.',
        video: {
          id: 'vid-neural-networks-and-llms',
          title: 'Field Video 1.3 — Neurons, Tokens & Transformers Explained',
          duration: '13:50',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Visualizes how layers of artificial neurons extract features, how text is sliced into tokens, and how self-attention lets a Transformer weigh context across an entire page.',
          segments: [
            { timestamp: '00:00', label: 'Layers of Artificial Neurons' },
            { timestamp: '03:20', label: 'Tokens: How Models Read Text' },
            { timestamp: '06:15', label: 'Transformers & Self-Attention' },
            { timestamp: '09:45', label: 'Next-Token Probability & Temperature' },
            { timestamp: '11:55', label: 'Pre-Training vs. Alignment (RLHF)' },
          ],
        },
        body: [
          {
            heading: 'From simple math units to deep neural networks',
            text: 'An artificial neural network is loosely inspired by the biological brain, though built out of linear algebra rather than living cells. Each artificial “neuron” is a tiny mathematical function: it takes several numbers as input, multiplies each by a learned weight, adds them together, and passes the result to the next layer if it crosses a threshold. Why do we call it “deep learning”? Because these neurons are stacked into dozens or even hundreds of layers. Early layers detect simple patterns (like raw edges in a photo or basic word pairs), middle layers combine those into parts (ears, wheels, or grammatical clauses), and deep layers recognize complex concepts.',
          },
          {
            heading: 'Tokens: why language models don’t read letters or words',
            text: 'When you type a prompt into a Large Language Model (LLM), the model does not see individual characters or whole dictionary words. First, a “tokenizer” chops your text into chunks called tokens. Common short words like “apple” or “ the” are a single token, while longer or rarer words like “photosynthesis” or “unbelievable” get split into sub-word pieces (“un”, “believ”, “able”). Each token has a unique ID number in a vocabulary of roughly 50,000 to 200,000 entries. This is why LLMs sometimes struggle with counting letters in a word like “strawberry” — they never saw the individual letters unless they spell them out token by token!',
          },
          {
            heading: 'The Transformer and the magic of self-attention',
            text: 'Before 2017, language models read sentences strictly left-to-right, often forgetting the beginning of a paragraph by the time they reached the end. Everything changed with the “Transformer” architecture and its core mechanism: self-attention. Self-attention allows the model to look at every token in your prompt simultaneously and calculate“attention scores” between them. In the sentence “The trophy didn’t fit in the suitcase because it was too big,” self-attention connects the word “it” strongly to “trophy.” Change the last word to “small,” and the attention weights shift “it” to “suitcase.”',
          },
          {
            heading: 'Next-token prediction and temperature',
            text: 'At its core, an LLM does one job repeatedly: given a sequence of tokens so far, assign a probability to every possible next token in its vocabulary. For “The capital of France is ___,” the token “Paris” might get a 96% probability. A setting called “temperature” controls how the model picks from that menu. At temperature 0, it always picks the single highest-probability token, making outputs predictable and consistent. At higher temperatures, it occasionally picks slightly less likely tokens, making the writing more varied and creative — but also more prone to drifting off track.',
          },
          {
            heading: 'From raw base model to helpful assistant',
            text: 'Training an LLM happens in stages. First comes “pre-training”: reading trillions of words from books, articles, and code to build a base model that can predict text. A raw base model, however, isn’t a polite tutor — if you ask it “What is 2+2?”, it might continue with more test questions (“What is 3+3? What is 4+4?”) because it has seen worksheets on the internet! In the second stage, engineers use Supervised Fine-Tuning (SFT) and Reinforcement Learning from Human Feedback (RLHF), where human reviewers rate model responses for helpfulness, honesty, and safety, teaching the model to follow instructions and refuse harmful requests.',
          },
        ],
        keyTakeaways: [
          'Deep learning stacks layers of simple mathematical units so higher layers can represent increasingly abstract concepts.',
          'LLMs process sub-word chunks called tokens and use Transformer self-attention to connect context across long passages.',
          'Pre-training teaches a base model statistical language patterns; fine-tuning and RLHF shape it into an instruction-following assistant.',
        ],
      },
      {
        id: 'computer-vision-and-multimodal',
        title: 'How AI Sees, Hears, and Generates Media',
        minutes: 12,
        xp: 70,
        summary:
          'Explore how computer vision interprets pixel grids, how audio models process waveforms, how diffusion models sculpt images from static noise, and how multimodal systems connect sight, sound, and text.',
        video: {
          id: 'vid-computer-vision-and-multimodal',
          title: 'Field Video 1.4 — Pixels, Waveforms & Diffusion Models',
          duration: '11:30',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Demonstrates how a camera photo looks like a spreadsheet of RGB numbers to a computer, how diffusion models turn random static into crisp artwork, and where visual AI gets fooled.',
          segments: [
            { timestamp: '00:00', label: 'Pixels as Grids of Numbers' },
            { timestamp: '02:20', label: 'Speech Recognition & Audio Waveforms' },
            { timestamp: '04:50', label: 'Diffusion: Sculpting Images from Noise' },
            { timestamp: '07:30', label: 'Multimodal Models: Sight, Sound & Text' },
            { timestamp: '09:35', label: 'Where Machine Perception Breaks Down' },
          ],
        },
        body: [
          {
            heading: 'How a computer sees a photograph',
            text: 'When you look at a photograph of a bicycle, you immediately see two wheels, handlebars, and a frame. To a computer, that same photo is just a giant grid of millions of numbers — each pixel represented by three values between 0 and 255 for Red, Green, and Blue (RGB) intensity. Computer vision models slide small mathematical filters across that grid to detect where numbers change sharply (indicating an edge or shadow), then combine edges into textures, textures into wheel spokes, and parts into a full object classification.',
          },
          {
            heading: 'Audio, spectrograms, and voice synthesis',
            text: 'Sound is a continuous wave of air pressure. To make audio understandable to a neural network, engineers slice sound recordings into tiny milliseconds and convert them into a “spectrogram” — a visual heat map showing which pitch frequencies are loud or quiet at each moment. Speech-to-text models translate those frequency patterns into text tokens, while modern text-to-speech and voice-cloning systems run the process in reverse, predicting the exact waveform pitch, cadence, and breathing pauses that match a speaker’s style.',
          },
          {
            heading: 'Diffusion models: sculpting images out of static noise',
            text: 'How do image and video generators create a brand-new picture from a sentence like “an astronaut painting a watercolor on Mars”? Most modern visual generators use a technique called “diffusion.” During training, engineers take millions of real captioned images and gradually add random television-like static noise to them until nothing is left but pure snow. The neural network is trained to reverse that process: given a noisy image and a text caption, predict how to subtract a tiny layer of noise to reveal structure underneath. When you prompt an image generator, it starts with a canvas of 100% random static and denoises it across 20 to 50 steps until a coherent image emerges.',
          },
          {
            heading: 'Multimodal models: bridging text, sight, and sound',
            text: 'Early AI systems lived in separate silos: one model handled text, another classified images, and a third transcribed audio. Today’s “multimodal” models map text tokens, image patches, and audio segments into a single shared mathematical space. Because the concept of a “right triangle” points to the same region whether it arrives as a written equation, a hand-drawn notebook sketch, or a spoken question, a multimodal model can inspect a photo of your geometry diagram and walk you through the proof.',
          },
          {
            heading: 'Where machine perception breaks down',
            text: 'Because vision and audio models rely on statistical surface patterns rather than physical understanding of the 3D world, they have surprising blind spots. They can miscount fingers or gear teeth, misread handwritten labels when rotated at an unusual angle, or be tricked by “adversarial examples” — subtle pixel patterns invisible to the human eye that cause a classifier to label a stop sign as a speed-limit sign. Never assume that because a vision model recognizes a complex diagram, it sees the physical world with human common sense.',
          },
        ],
        keyTakeaways: [
          'Computer vision and audio models translate RGB pixel grids and frequency spectrograms into mathematical feature maps.',
          'Diffusion models generate images by iteratively removing random static noise guided by a text prompt.',
          'Multimodal models connect text, images, and audio in a shared representation space, but still lack grounded physical common sense.',
        ],
      },
      {
        id: 'ai-in-daily-life',
        title: 'AI in Your Daily Life & Invisible Systems',
        minutes: 10,
        xp: 60,
        summary:
          'Spot the predictive, ranking, and generative AI systems running quietly inside your phone, social feeds, maps, and inbox — and understand what they optimize for.',
        video: {
          id: 'vid-ai-in-daily-life',
          title: 'Field Video 1.5 — Auditing the Algorithms Around You',
          duration: '09:55',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Traces a typical high school morning to reveal the dozen AI models working behind the scenes, explaining how recommendation feeds optimize for engagement and how to stay in control.',
          segments: [
            { timestamp: '00:00', label: 'The Invisible AI Stack in Your Pocket' },
            { timestamp: '02:05', label: 'How Recommendation Feeds Rank Content' },
            { timestamp: '04:15', label: 'Engagement Optimization vs. Wellbeing' },
            { timestamp: '06:10', label: 'Predictive vs. Generative Systems' },
            { timestamp: '08:00', label: 'Filter Bubbles & Intentional Habits' },
          ],
        },
        body: [
          {
            heading: 'The invisible AI stack in your pocket',
            text: 'Long before you open a chatbot, you interact with dozens of specialized AI models every morning. When you glance at your phone to unlock it, a 3D depth-mapping neural network verifies your face even if you put on glasses. When you snap a photo in a dim hallway, computational photography models merge multiple exposures and reduce grain in milliseconds. Your keyboard predicts your next word, your email inbox filters out phishing attempts, and your maps app predicts traffic slowdowns thirty minutes before you reach the highway.',
          },
          {
            heading: 'How recommendation engines rank your feed',
            text: 'Every time you open TikTok, YouTube, Instagram, or Spotify, a recommendation algorithm faces a massive sorting problem: out of millions of posts or songs, which five should appear on your screen right now? To decide, the system tracks micro-signals: did you watch the video all the way through, pause on a comment, rewatch a clip, share it with a friend, or scroll past in half a second? It combines your history with “collaborative filtering” — finding millions of other users with similar viewing habits and recommending what kept them watching.',
          },
          {
            heading: 'What the algorithm optimizes for vs. what you care about',
            text: 'Every machine learning model is steered by an objective function — the score it tries to maximize. For most commercial social feeds, that objective is “engagement” or “session watch time,” not accuracy, nuance, or your personal wellbeing. Content that sparks strong emotion, outrage, or curiosity gaps naturally keeps people glued to the screen longer, so the ranking model promotes it. Recognizing that the feed is an optimization engine — not a neutral window on reality — lets you decide when to step off.',
          },
          {
            heading: 'Predictive vs. generative AI in everyday apps',
            text: 'It helps to sort everyday AI into two buckets. “Predictive/discriminative AI” classifies, scores, or ranks existing items: is this credit card swipe fraudulent, which song fits this playlist, or does this X-ray show a fracture? “Generative AI” synthesizes brand-new artifacts: drafting an email, translating a voice note, generating an illustration, or writing Python code. Most modern apps blend both — using predictive models to search and rank information, and generative models to summarize or compose.',
          },
          {
            heading: 'Feedback loops and taking back the steering wheel',
            text: 'Because recommendation models learn continuously from your behavior, you and the algorithm form a feedback loop. Click on three conspiracy videos or rage-bait posts out of curiosity, and the model concludes you want fifty more, creating a “filter bubble” where a fringe topic looks like everyone’s main conversation. You can actively curate your algorithmic environment by resetting watch history, using “Not Interested” controls, searching intentionally instead of auto-scrolling, and seeking out varied sources.',
          },
        ],
        keyTakeaways: [
          'Specialized AI models power everyday tools including biometric unlock, computational photography, spam filtering, and GPS routing.',
          'Recommendation algorithms optimize for watch time and engagement signals rather than truth or user wellbeing.',
          'Distinguishing predictive AI (ranking/classifying) from generative AI (creating new text/media) helps you choose the right tool and scrutiny level.',
        ],
      },
    ],
    quiz: [
      {
        question: 'What makes machine learning fundamentally different from traditional rule-based programming?',
        options: [
          'It runs only on quantum computers',
          'The system infers statistical patterns from examples instead of following hand-coded IF/THEN rules',
          'It never makes prediction errors once deployed',
          'It understands human emotions and conscious intent',
        ],
        answer: 1,
        explanation:
          'In machine learning, engineers supply data and a training loop so the model learns statistical weights from examples rather than relying solely on hand-written IF/THEN logic.',
      },
      {
        question: 'A model that achieves 99% accuracy on its training data but fails badly on unseen test examples is…',
        options: ['Generalized', 'Overfit', 'Multimodal', 'Tokenized'],
        answer: 1,
        explanation:
          'Overfitting occurs when a model memorizes the specific quirks and noise of its training set instead of learning generalizable patterns.',
      },
      {
        question: 'How does a Transformer language model figure out what a pronoun like “it” refers to in a long sentence?',
        options: [
          'It asks a human moderator in real time',
          'It uses self-attention to weigh relationships between all tokens in the context simultaneously',
          'It deletes all adjectives and adverbs first',
          'It looks up the sentence in a fixed grammar rulebook',
        ],
        answer: 1,
        explanation:
          'The Transformer’s self-attention mechanism computes attention scores across tokens so the model can connect related concepts regardless of distance.',
      },
      {
        question: 'Why do social media recommendation algorithms often surface sensational or emotionally charged posts?',
        options: [
          'Engineers manually pick every video on your screen',
          'They are typically trained to maximize watch time and engagement signals rather than factual balance',
          'They can only process short videos',
          'They alphabetical-sort posts by creator name',
        ],
        answer: 1,
        explanation:
          'Recommendation engines optimize for engagement metrics like watch duration, shares, and completion rates, which sensational content often triggers.',
      },
    ],
  },
  {
    id: 'tools',
    index: '02',
    title: 'Tools & Techniques',
    tagline: 'Put AI to work.',
    description:
      'Hands-on academic workflows: structured prompt engineering, Socratic study routines, task decomposition for coding and complex projects, hallucination detection, source verification, and building a personal study system where AI amplifies your thinking instead of replacing it.',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    accent: '#0d9488',
    badge: {
      id: 'badge-tools',
      name: 'Prompt Pilot',
      icon: '🛠️',
      description: 'Completed all five Tools & Techniques lessons and passed the chapter knowledge check.',
    },
    lessons: [
      {
        id: 'prompting',
        title: 'The Art & Engineering of Prompting',
        minutes: 12,
        xp: 70,
        summary:
          'Master the CLEAR prompting framework, compare zero-shot vs. few-shot examples, calibrate audience depth, and design prompts that sharpen your thinking.',
        video: {
          id: 'vid-prompting',
          title: 'Field Video 2.1 — Structured Prompting with the CLEAR Framework',
          duration: '11:40',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Shows live side-by-side comparisons of vague prompts vs. CLEAR prompts, demonstrates few-shot formatting examples, and explains how to iterate when an initial response misses the mark.',
          segments: [
            { timestamp: '00:00', label: 'Why Vague Prompts Produce Generic Output' },
            { timestamp: '02:20', label: 'The CLEAR Framework Step-by-Step' },
            { timestamp: '05:00', label: 'Zero-Shot vs. Few-Shot Examples' },
            { timestamp: '07:25', label: 'Role Assignment & Constraint Calibration' },
            { timestamp: '09:35', label: 'Prompts That Teach vs. Prompts That Cheat' },
          ],
        },
        body: [
          {
            heading: 'Why vague prompts produce generic answers',
            text: 'Remember from Chapter 01 that a language model predicts the most statistically likely continuation of your text. If you type a vague five-word prompt like “Help me with cellular respiration,” the model has no idea whether you are a middle schooler, an AP Biology student, or a biochemistry researcher, nor whether you want a practice quiz, an analogy, or a diagram breakdown. So it defaults to the safest average of the internet: a bland, encyclopedia-style wall of text. Specific constraints narrow the probability space to exactly what you need.',
          },
          {
            heading: 'The CLEAR framework in action',
            text: 'Use the CLEAR checklist to build high-precision prompts. Context: state who you are and what you are working on (“I am a 10th-grade student preparing for a unit exam on the French Revolution”). Limits: set boundaries on length, tone, and scope (“Keep explanations under 150 words per concept and do not give me the answers before I try”). Examples: show the exact format or style you want. Ask: state the concrete task clearly. Review: treat the first output as a draft — push back, ask follow-up questions, and refine.',
          },
          {
            heading: 'Zero-shot vs. few-shot prompting',
            text: 'Asking an AI to perform a task with instructions alone is called “zero-shot prompting.” Often, however, showing is ten times clearer than telling. In “few-shot prompting,” you paste one to three concrete examples of the input-output pattern you want before asking the model to continue. For instance, if you are making study flashcards that pair a historical event with its cause and long-term consequence, giving two completed sample cards locks in the exact depth, vocabulary level, and formatting far better than a paragraph of instructions.',
          },
          {
            heading: 'Role assignment and constraint calibration',
            text: 'You can steer how a model frames information by assigning an explicit perspective and constraint rule: “Act as a rigorous AP Chemistry lab partner who checks my stoichiometry setup for unit conversion mistakes” or “Act as a skeptical Constitutional convention delegate debating the Federalist Papers.” Combining a clear role with negative constraints (“Do not write the paragraph for me; only ask questions about my thesis statement”) prevents the AI from taking over work you need to do yourself.',
          },
          {
            heading: 'Prompts that teach vs. prompts that replace thinking',
            text: 'Every time you open an AI tool for schoolwork, your prompt chooses between two paths. “Write my 500-word analysis of Macbeth Act 3” produces a finished text file while leaving your own brain unchanged — and violates academic integrity. “Quiz me on the dramatic irony in Macbeth Act 3 one question at a time, wait for my response, and critique my textual evidence” uses the exact same model to build durable skill. The tool is identical; the prompt determines who does the learning.',
          },
        ],
        keyTakeaways: [
          'Vague prompts cause language models to default to generic, average prose; specific constraints narrow the probability distribution.',
          'The CLEAR framework (Context, Limits, Examples, Ask, Review) turns underspecified requests into reliable study interactions.',
          'Few-shot prompting (providing 1–3 sample outputs) is the fastest way to control format, tone, and rigor.',
        ],
      },
      {
        id: 'study-workflows',
        title: 'AI as a Socratic Study Partner',
        minutes: 13,
        xp: 75,
        summary:
          'Turn cognitive science principles like active recall and elaboration into four repeatable AI study workflows: Socratic tutoring, the explainer ladder, editorial critique, and diagnostic testing.',
        video: {
          id: 'vid-study-workflows',
          title: 'Field Video 2.2 — Active Recall & Socratic Tutoring Workflows',
          duration: '12:35',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Demonstrates four proven study workflows live: setting up a Socratic tutor that waits for your answer, climbing the explainer ladder, getting editorial critique without ghostwriting, and running diagnostic quizzes.',
          segments: [
            { timestamp: '00:00', label: 'The Cognitive Science of Active Recall' },
            { timestamp: '02:30', label: 'Workflow 1: The Socratic Tutor' },
            { timestamp: '05:10', label: 'Workflow 2: The Explainer Ladder' },
            { timestamp: '07:45', label: 'Workflow 3: Editor Critique Without Rewriting' },
            { timestamp: '10:15', label: 'Workflow 4: Diagnostic Practice Tests' },
          ],
        },
        body: [
          {
            heading: 'Why active recall beats passive reading every time',
            text: 'Decades of cognitive psychology research show a consistent trap called the “illusion of competence”: when you read a smooth, well-organized summary or watch someone else solve a problem, your brain feels like it understands the material. Yet when you sit down with a blank test paper, the steps vanish. Real memory is built through “retrieval practice” (pulling answers out of your own head) and “desirable difficulty” (wrestling with a problem before seeing the solution). A good AI study workflow forces you to generate the answers first.',
          },
          {
            heading: 'Workflow 1: The Socratic tutor',
            text: 'Instead of asking AI to solve a physics or calculus problem, use this prompt template: “I am trying to solve [problem]. Here is my first step: [your attempt]. Do not give me the final answer or solve the whole problem. Tell me if my first step is on track, and ask me one guiding question to help me figure out the next step myself.” By instructing the model to ask one question at a time and wait, you transform a passive answer machine into an interactive coach.',
          },
          {
            heading: 'Workflow 2: The explainer ladder',
            text: 'When you hit a dense textbook paragraph that refuses to click, climb the explainer ladder. Ask the model to explain the concept at three progressive levels: first using an everyday real-world analogy, second at a standard high-school honors level, and third at a college/AP technical level including the exact terminology and edge cases. Once you read all three, close the window and try explaining the concept back in your own words — then ask the AI to spot any gaps in your explanation (the Feynman technique).',
          },
          {
            heading: 'Workflow 3: The editor loop (critique without rewriting)',
            text: 'When working on an essay or lab report, always write your own rough draft first so the ideas, structure, and voice belong to you. If your teacher permits AI feedback, paste your paragraph with strict guardrails: “Act as a writing tutor. Do NOT rewrite my sentences or generate replacement text. Instead, point out three places where my argument lacks specific evidence, where my transition between ideas is abrupt, or where my wording is ambiguous.” You remain the sole author while getting instant diagnostic feedback.',
          },
          {
            heading: 'Workflow 4: Diagnostic practice tests and error logs',
            text: 'Paste your own class notes or syllabus learning objectives and ask for a mixed-format practice check: “Create 5 multiple-choice questions that test common misconceptions and 2 short-answer scenario questions based on these notes. Ask them one by one and wait for my answers.” At the end of the session, ask the AI to summarize which sub-topics you missed so you know exactly which pages of your notebook to review before exam day.',
          },
        ],
        keyTakeaways: [
          'Reading fluent AI summaries creates an illusion of competence; active retrieval and struggling with problems build lasting memory.',
          'The Socratic Tutor and Feynman explanation prompts keep you in the driver’s seat by making the AI ask questions and critique your reasoning.',
          'Using strict negative constraints (“Do not rewrite my draft”) lets you receive editorial feedback while preserving 100% authorship.',
        ],
      },
      {
        id: 'iterative-reasoning-and-projects',
        title: 'Decomposition, Coding & Complex Problem Solving',
        minutes: 13,
        xp: 75,
        summary:
          'Break multi-step projects into manageable milestones, use step-by-step reasoning for STEM and logic tasks, debug code without blind copy-pasting, and stress-test your arguments.',
        video: {
          id: 'vid-iterative-reasoning-and-projects',
          title: 'Field Video 2.3 — Task Decomposition & Debugging Workflows',
          duration: '12:15',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Walks through breaking a complex science or coding project into small verifiable milestones, prompting for step-by-step reasoning, and using AI as a devil’s advocate to strengthen a thesis.',
          segments: [
            { timestamp: '00:00', label: 'Task Decomposition: Breaking Down Big Goals' },
            { timestamp: '02:35', label: 'Step-by-Step Reasoning (Chain of Thought)' },
            { timestamp: '05:10', label: 'Learning to Code & Debug Without Blind Copying' },
            { timestamp: '07:50', label: 'Managing Context Windows & Drift' },
            { timestamp: '10:05', label: 'Stress-Testing Arguments with a Devil’s Advocate' },
          ],
        },
        body: [
          {
            heading: 'Task decomposition: why mega-prompts fail',
            text: 'When students tackle a big project — like designing a science fair experiment, planning a history research paper, or building a web app — a common mistake is typing one giant request and hoping for a finished blueprint. Mega-prompts produce shallow, generic results because too many decisions are bundled together. Instead, use “task decomposition”: break the project into small, sequential stages (1. narrow the research question, 2. identify variables and controls, 3. outline data collection, 4. critique potential confounding factors) and review each stage critically before moving to the next.',
          },
          {
            heading: 'Step-by-step reasoning (Chain of Thought)',
            text: 'Because language models generate responses token by token, jumping straight to a final answer on a multi-step math, logic, or chemistry problem often leads to arithmetic or reasoning slips. Prompting a model to “work through this step-by-step, stating the principle used at each stage before calculating” gives the model intermediate workspace tokens and — even more importantly — lets you inspect the exact line where a calculation or assumption went wrong.',
          },
          {
            heading: 'Using AI for coding and debugging without losing comprehension',
            text: 'AI coding assistants can generate functions in seconds, which creates a dangerous trap for computer science students: pasting code that runs today but that you cannot debug or explain tomorrow. Follow the “Explain-Then-Write” rule: when you hit a compiler error or bug, paste the error message and ask, “Explain why this error occurs and what concept I should check, without writing the fixed code yet.” When learning a new library, ask for a minimal 5-line example with line-by-line comments, then write your own implementation from scratch.',
          },
          {
            heading: 'Managing context windows and conversation drift',
            text: 'Every AI model has a “context window” — a limit on how much text from the current conversation it can hold in working memory at once. Even within that limit, very long back-and-forth chats suffer from “context drift”: earlier constraints get diluted by dozens of later messages, or the model gets stuck repeating an earlier mistake. When a conversation becomes muddled or you switch to a new phase of a project, summarize the key decisions you have verified so far and start a clean thread.',
          },
          {
            heading: 'Stress-testing your arguments with a devil’s advocate',
            text: 'Before finalizing a debate case, history thesis, or lab conclusion, use AI to steelman the opposing view: “Here is my thesis and my three main pieces of evidence. Act as a well-informed critic. What is the strongest counter-argument to my claim? Which piece of my evidence is weakest, and what confounding variable did I overlook?” Answering tough objections in practice makes your final work far more resilient.',
          },
        ],
        keyTakeaways: [
          'Decomposing complex projects into small, reviewable milestones yields much deeper work than single mega-prompts.',
          'In coding and STEM, ask AI to explain error messages and underlying principles rather than pasting unverified solutions.',
          'Start a fresh chat with a concise summary whenever a long thread suffers from context drift.',
        ],
      },
      {
        id: 'verify',
        title: 'Hallucinations, Citations & Source Verification',
        minutes: 12,
        xp: 70,
        summary:
          'Understand why statistical models fabricate fluent falsehoods, spot invented citations in seconds, practice lateral reading, and run a five-step verification protocol.',
        video: {
          id: 'vid-verify',
          title: 'Field Video 2.4 — Spotting Hallucinations & Fake Citations',
          duration: '11:10',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Dissects real examples of plausible-sounding AI hallucinations and fabricated academic citations, demonstrating how to cross-check claims using lateral reading and primary sources.',
          segments: [
            { timestamp: '00:00', label: 'Why Fluency Is Not Accuracy' },
            { timestamp: '02:20', label: 'The Anatomy of a Fabricated Citation' },
            { timestamp: '04:45', label: 'Lateral Reading & Primary Sources' },
            { timestamp: '07:10', label: 'Prompting to Surface Uncertainty' },
            { timestamp: '09:15', label: 'The 5-Step Student Verification Protocol' },
          ],
        },
        body: [
          {
            heading: 'Why models hallucinate: fluency is not truth',
            text: 'An AI “hallucination” happens when a model outputs a confident, grammatically flawless statement that is factually wrong or completely invented. Why does this happen? Because a language model is not a verified database looking up rows in a table; it is a probabilistic generator assembling tokens that sound like an authoritative answer. Humans often use tone and confidence as shortcuts for trustworthiness. With AI, tone and accuracy are completely decoupled: a model uses the exact same polished academic style when stating a Nobel Prize-winning fact as when inventing a nonexistent battle in 1814.',
          },
          {
            heading: 'The anatomy of a fake citation',
            text: 'One of the most common — and dangerous — hallucinations is the fabricated bibliography entry. Ask an ungrounded language model for five scholarly sources on a niche topic, and it will frequently combine a real researcher’s name, a real academic journal title (like Nature or The American Historical Review), a plausible-sounding article title, and a realistic page range — for an article that was never written! Never copy a citation from an AI chat into a paper without opening the actual source yourself and reading the passage.',
          },
          {
            heading: 'Lateral reading and primary source triangulation',
            text: 'Professional fact-checkers use a habit called “lateral reading.” Instead of staying inside the AI conversation and asking the chatbot “Are you sure that’s true?” (to which a model will often apologize and invent a second hallucination, or stubbornly defend the first), open a new tab and leave the chat completely. Verify dates, statistics, quotes, and scientific claims against primary sources, textbooks, library databases, or established reference works.',
          },
          {
            heading: 'Prompting to surface uncertainty and blind spots',
            text: 'By default, instruction-tuned models aim to sound helpful and decisive, which can hide ambiguity or scholarly debate. You can force a model to surface weak points by asking: “Which specific claims in your previous answer are you least confident about and why?”, “What would a domain expert double-check in this summary?”, or “Are there competing interpretations of this historical event?” Asking explicitly for uncertainty helps you target your fact-checking.',
          },
          {
            heading: 'A five-step verification protocol for students',
            text: 'Before any fact, quote, formula, or citation enters your notebook or assignment, run this five-step check: (1) Flag every specific claim (names, dates, numbers, quotes, cause-and-effect assertions). (2) Locate the primary or authoritative external source outside the AI tool. (3) Confirm the source actually exists and says what was claimed in context. (4) Check whether key nuance or counter-evidence was omitted. (5) Cite the verified primary source directly in your work.',
          },
        ],
        keyTakeaways: [
          'AI models separate fluency from factual accuracy — confident prose can mask completely invented dates, quotes, and citations.',
          'Never verify an AI claim by asking the same chatbot “Are you sure?”; practice lateral reading in independent, authoritative sources.',
          'Always open and read any cited article or book yourself before including it in a bibliography.',
        ],
      },
      {
        id: 'personal-ai-workflow',
        title: 'Building Your Personal Academic Workflow',
        minutes: 11,
        xp: 65,
        summary:
          'Design a sustainable, high-integrity personal system for deciding when to use AI, when to work unplugged, how to log your prompts, and how to prevent skill atrophy.',
        video: {
          id: 'vid-personal-ai-workflow',
          title: 'Field Video 2.5 — Designing Your Personal Study System',
          duration: '10:20',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Shows how to map school tasks onto an AI decision matrix, keep a transparent prompt log for teachers, and protect core human skills from cognitive offloading.',
          segments: [
            { timestamp: '00:00', label: 'The Task Decision Matrix: AI vs. Unplugged' },
            { timestamp: '02:10', label: 'Building a Reusable Prompt Notebook' },
            { timestamp: '04:20', label: 'Keeping a Research & Prompt Log' },
            { timestamp: '06:25', label: 'Guarding Against Cognitive Offloading' },
            { timestamp: '08:30', label: 'Your Pre-Submission Ownership Checklist' },
          ],
        },
        body: [
          {
            heading: 'Mapping tasks: where AI helps vs. where you work unplugged',
            text: 'The strongest students do not use AI for everything, nor do they ignore it completely. Instead, they use a deliberate decision matrix. High-value AI tasks include generating practice quizzes from your notes, brainstorming counter-arguments after you have drafted a thesis, explaining a confusing textbook diagram at three levels, or spotting syntax bugs. Tasks that should begin unplugged include initial reading comprehension, freewriting your first thoughts, working through problem sets on scratch paper, and crafting your own prose.',
          },
          {
            heading: 'Building a reusable personal prompt notebook',
            text: 'Rather than reinventing prompts from scratch at 10 p.m. before a test, keep a small section in your notebook for your five most effective study templates: a Socratic problem-solving prompt, an AP/Honors concept-ladder prompt, a vocabulary scenario generator, a thesis devil’s advocate prompt, and a rubric self-check prompt. Refining your own templates over a semester makes every study session faster and more focused.',
          },
          {
            heading: 'Keeping a transparent research and prompt log',
            text: 'Whenever a class allows AI assistance for brainstorming, outlining, or editing, keep a brief “AI Interaction Log” at the bottom of your working document or notes. Record the tool used, the key prompts you entered, how you verified the output, and what you changed in your own draft. Working in a document with version history enabled alongside a prompt log makes disclosing your process effortless and proves your authorship beyond doubt.',
          },
          {
            heading: 'Avoiding cognitive offloading and skill atrophy',
            text: 'If you drove a golf cart for every lap of track practice, your lap times would look fast in practice, but your legs would grow weaker for race day. Cognitive scientists call over-reliance on automated tools “cognitive offloading.” If you let AI summarize every chapter you are assigned to read, your reading stamina for long, complex passages will atrophy. Practice regular “unplugged reps” — reading dense texts, outlining on paper, and solving problems with no digital assistance — so your foundational muscles stay strong.',
          },
          {
            heading: 'Your pre-submission ownership check',
            text: 'Before turning in any assignment where AI played a supporting role, pause for a sixty-second ownership audit: Did I check the teacher’s syllabus policy for this specific task? Can I define every word and explain every step in this submission out loud without notes? Have I verified every external fact and citation in a primary source? And have I included a clear disclosure note if AI was used at any stage?',
          },
        ],
        keyTakeaways: [
          'Start creative, analytical, and problem-solving work unplugged first so your own ideas set the direction before bringing in AI.',
          'Maintain version history and a brief prompt log whenever AI is permitted on an assignment.',
          'Protect your reading stamina, writing voice, and problem-solving endurance by scheduling regular unplugged study reps.',
        ],
      },
    ],
    quiz: [
      {
        question: 'Which study workflow best applies cognitive science to build durable memory for an upcoming exam?',
        options: [
          'Asking AI to summarize the textbook chapter into three bullet points and reading them twice',
          'Having AI quiz you one question at a time on your notes, attempting each answer yourself first, and reviewing your mistakes',
          'Asking AI to write a full sample essay so you can memorize it word-for-word',
          'Copy-pasting homework questions into a chatbot to finish the worksheet faster',
        ],
        answer: 1,
        explanation:
          'Active recall (generating answers from memory) and feedback on errors wire knowledge far more effectively than passive reading.',
      },
      {
        question: 'In prompt engineering, what is “few-shot prompting”?',
        options: [
          'Sending the same vague question to three different chatbots at once',
          'Providing 1 to 3 concrete input-output examples inside your prompt so the model matches your desired format and depth',
          'Limiting your prompt to fewer than five words',
          'Refreshing the browser window when an answer is slow',
        ],
        answer: 1,
        explanation:
          'Few-shot prompting demonstrates the exact structure, tone, and rigor you want by giving the model concrete examples to follow.',
      },
      {
        question: 'An AI gives you a scholarly citation with a real author’s name and a real journal title. What is the safest verification step?',
        options: [
          'Ask the same AI chatbot, “Is this citation real?”',
          'Trust it because the formatting matches MLA style',
          'Leave the chat (lateral reading) to locate and open the actual article in a library database or primary source',
          'Change the publication year by one year just in case',
        ],
        answer: 2,
        explanation:
          'Language models frequently assemble plausible-looking but nonexistent citations; always verify the actual source outside the chatbot.',
      },
      {
        question: 'What is “cognitive offloading,” and why is it a risk for students using AI?',
        options: [
          'Backing up your study notes to cloud storage',
          'Outsourcing mental effort (like reading dense texts or drafting arguments) to AI so often that your own core skills weaken',
          'Closing unused browser tabs to save battery life',
          'Using a Socratic tutor prompt to check your algebra steps',
        ],
        answer: 1,
        explanation:
          'Relying on AI to do the heavy cognitive lifting prevents the mental struggle required to build reading stamina, writing voice, and problem-solving skill.',
      },
    ],
  },
  {
    id: 'ethics',
    index: '03',
    title: 'Ethics & Responsibility',
    tagline: 'Use it right.',
    description:
      'Academic integrity and authorship, algorithmic bias and fairness, personal data privacy and intellectual property, deepfakes and synthetic misinformation, and the environmental and labor footprint of global AI systems.',
    gradient: 'from-orange-400 via-rose-500 to-pink-600',
    accent: '#e11d48',
    badge: {
      id: 'badge-ethics',
      name: 'Ethics Guardian',
      icon: '⚖️',
      description: 'Completed all five Ethics & Responsibility lessons and passed the chapter knowledge check.',
    },
    lessons: [
      {
        id: 'academic-integrity',
        title: 'Academic Integrity, Authorship & Disclosure',
        minutes: 12,
        xp: 70,
        summary:
          'Understand why submitting AI-generated work misrepresents your learning, apply the teacher conversation test, navigate classroom policies, and write transparent AI disclosures.',
        video: {
          id: 'vid-academic-integrity',
          title: 'Field Video 3.1 — Authorship, Integrity & Transparent Disclosure',
          duration: '11:25',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Explains the ethical foundation of academic authorship, walks through the “Defend Every Sentence” test, and provides real templates for citing permitted AI use in schoolwork.',
          segments: [
            { timestamp: '00:00', label: 'What Authorship Really Means' },
            { timestamp: '02:20', label: 'The Conversation Test: Defending Your Work' },
            { timestamp: '04:45', label: 'Navigating Different Classroom Policies' },
            { timestamp: '07:15', label: 'How to Disclose & Cite AI Properly' },
            { timestamp: '09:25', label: 'AI Detectors & Protecting Your Process' },
          ],
        },
        body: [
          {
            heading: 'Why authorship matters in the AI era',
            text: 'When a teacher assigns an essay, lab analysis, or coding project, the product itself is not what the school needs — the school does not have a shortage of five-paragraph essays on The Great Gatsby. The assignment exists to measure and develop changes in your own brain. Submitting AI-generated writing, code, or artwork under your name is academic dishonesty (plagiarism / unauthorized assistance), even though no single human wrote the text, because you are claiming credit for thinking you did not perform.',
          },
          {
            heading: 'The conversation test: can you defend every line?',
            text: 'Here is the clearest practical boundary for any assignment: ask yourself, “If my teacher sat down with me right now, pointed to any sentence, vocabulary word, equation, or line of code in my submission, and asked me to explain why I chose it and how it works, could I explain it effortlessly?” If a tool generated phrasing or logic you cannot explain on the spot, you are turning in work you do not own.',
          },
          {
            heading: 'Navigating the spectrum of classroom AI policies',
            text: 'Even within the same high school, AI rules rightly vary by course and assignment goal. In an introductory composition unit focused on building sentence fluency, AI tools may be completely prohibited. In a research seminar, AI might be permitted for brainstorming research questions or checking grammar with disclosure, while prohibited for drafting paragraphs. In a computer science elective, AI might be encouraged for generating test cases. Never guess — a ten-second question to your teacher before starting saves your academic record.',
          },
          {
            heading: 'How to write a clear AI disclosure and citation',
            text: 'When your instructor allows AI assistance, transparency builds trust. Style guides like MLA, APA, and Chicago now include formats for citing generative AI, and most teachers appreciate a brief “AI Disclosure Note” at the end of an assignment. State the tool and version, the exact stage where it was used, the prompt entered, and how you verified and wrote the final work yourself (for example: “I used Claude to generate five practice counter-arguments to my thesis during outlining; all research, source verification, and drafting are my own”).',
          },
          {
            heading: 'AI detectors, false positives, and protecting your process',
            text: 'Automated “AI detection” software is notoriously unreliable — it can miss edited AI text while falsely flagging earnest human writing, especially structured prose or essays by non-native English speakers. Because statistical detectors are imperfect, the best way to protect yourself is to work inside a document editor that records version history (such as Google Docs or Git commits), save your handwritten or typed outlines, and communicate openly with your teacher.',
          },
        ],
        keyTakeaways: [
          'Submitting AI-generated work as your own misrepresents your learning and violates academic integrity, even if no human wrote it.',
          'Apply the Conversation Test: you must be able to explain and defend every sentence, equation, or line of code you submit.',
          'When AI use is permitted, disclose the tool, prompt, and workflow transparently and keep version history of your drafts.',
        ],
      },
      {
        id: 'bias-fairness',
        title: 'Algorithmic Bias, Fairness & Representation',
        minutes: 13,
        xp: 75,
        summary:
          'Examine how historical and sampling biases enter training datasets, study real-world cases in hiring, healthcare, and vision, and learn how to act as a critical quality filter.',
        video: {
          id: 'vid-bias-fairness',
          title: 'Field Video 3.2 — How Human Bias Enters Mathematical Models',
          duration: '12:40',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Investigates why mathematical models are not automatically neutral, walking through documented case studies in resume screening, facial recognition, and healthcare risk algorithms.',
          segments: [
            { timestamp: '00:00', label: 'The Myth of Mathematical Neutrality' },
            { timestamp: '02:35', label: 'Case Studies: Hiring & Facial Recognition' },
            { timestamp: '05:15', label: 'Proxy Variables & Healthcare Disparities' },
            { timestamp: '07:50', label: 'Stereotyping in Generative Text & Images' },
            { timestamp: '10:15', label: 'Auditing Models & Being the Quality Filter' },
          ],
        },
        body: [
          {
            heading: 'The myth of mathematical neutrality',
            text: 'It is easy to assume that because computers run on equations rather than personal feelings, their decisions must be objective and fair. In reality, machine learning models are mirrors held up to their training data. Because training corpora are scraped from human history, news archives, court records, and internet forums, they inevitably absorb human prejudices, historical inequalities, and representation gaps. Left unchecked, an algorithm does not erase bias — it automates and scales it behind a veneer of math.',
          },
          {
            heading: 'Real-world case studies in algorithmic bias',
            text: 'Documented cases show how training data gaps cause real-world harm. A major tech company built an experimental resume-screening AI trained on ten years of past hiring decisions; because the industry had historically hired mostly men for software roles, the model taught itself to penalize resumes containing the word “women’s” (as in “women’s chess club captain”). Landmark MIT Media Lab research (Gender Shades) showed that commercial facial-recognition systems had error rates below 1% for lighter-skinned men but up to 34% for darker-skinned women because training datasets were overwhelmingly pale and male.',
          },
          {
            heading: 'Proxy variables and healthcare disparities',
            text: 'Even when engineers remove sensitive labels like race or gender from a dataset, models can latch onto “proxy variables.” In one widely studied hospital algorithm used to refer high-risk patients to extra care programs, designers used “past healthcare spending” as a proxy for how sick a patient was. Because systemic barriers meant Black patients had less money spent on their care historically than equally sick white patients, the algorithm falsely concluded Black patients were healthier and recommended them for extra care far less often.',
          },
          {
            heading: 'Stereotyping and cultural flattening in generative AI',
            text: 'Generative text and image models exhibit bias too. Prompt an image generator for “a CEO,” “a nurse,” or “a family dinner,” and the unsteered defaults often reflect narrow demographic stereotypes or Western-centric norms. Language models trained mostly on standard American or British English can also misinterpret or penalize regional dialects, African American Vernacular English (AAVE), or multilingual phrasing.',
          },
          {
            heading: 'Being the human quality filter and demanding audits',
            text: 'Both engineers and everyday users share responsibility for fairness. Engineers use “dataset balancing,” subgroup accuracy audits, red-teaming, and transparent “Model Cards” that publish where a system performs poorly. As a student and user, your job is to be the critical quality filter: when AI summarizes history, literature, or social issues, always ask whose perspective is centered, whose voice is missing, and whether stereotypes are being repeated as neutral facts.',
          },
        ],
        keyTakeaways: [
          'Algorithms are not automatically neutral; they inherit historical prejudices and sampling gaps present in their training data.',
          'Even without explicit demographic labels, models can perpetuate inequality through proxy variables like zip codes or past spending.',
          'Critical users actively question whose perspective an AI output centers and what voices or contexts are missing.',
        ],
      },
      {
        id: 'privacy-and-data-rights',
        title: 'Privacy, Data Rights & Digital Footprints',
        minutes: 12,
        xp: 70,
        summary:
          'Trace what happens to data typed into cloud AI tools, memorize the red-line list of private information, explore copyright and consent debates, and practice data minimization.',
        video: {
          id: 'vid-privacy-and-data-rights',
          title: 'Field Video 3.3 — Protecting Privacy & Creative Rights in AI',
          duration: '11:15',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Traces how prompts travel to remote servers, outlines the strict red-line list of personal information never to share, and examines the debate over training models on artists’ and writers’ work.',
          segments: [
            { timestamp: '00:00', label: 'Where Your Prompts Actually Go' },
            { timestamp: '02:20', label: 'The Red-Line List: What Never to Paste' },
            { timestamp: '04:40', label: 'Protecting Classmates’ Consent & Privacy' },
            { timestamp: '07:00', label: 'Copyright, Creative Labor & IP' },
            { timestamp: '09:10', label: 'Practical Data Minimization Habits' },
          ],
        },
        body: [
          {
            heading: 'What actually happens when you type into a chatbot',
            text: 'Because an AI chat window looks like a private notepad on your screen, it is tempting to treat it like a locked diary. In most consumer AI apps, however, every prompt and file you upload is transmitted to remote cloud servers, logged for safety monitoring, potentially read by human contractors reviewing conversations for quality, and — unless you explicitly opt out or use an enterprise/school-protected account — often recycled into training data for future model versions.',
          },
          {
            heading: 'The red-line list: information that never belongs in a prompt',
            text: 'Treat public AI chatbots like a crowded coffee shop whiteboard. Never paste Personally Identifiable Information (PII) or sensitive secrets into a prompt: full names paired with home addresses or phone numbers, passwords or API keys, Social Security or student ID numbers, bank or financial details, private medical or mental health records, or confidential family matters. Once sensitive text is ingested into a training pipeline or server log, you cannot reliably delete individual memories from a neural network’s weights.',
          },
          {
            heading: 'Respecting other people’s privacy and consent',
            text: 'Privacy ethics extend beyond your own data to the people around you. Uploading a photo of a classmate, a voice recording of a teacher, a screenshot of a private group chat, or a peer’s draft essay into a commercial AI tool without their explicit permission strips them of control over their own digital footprint. Before uploading any document or media file, ask: “Do I have the right and consent to hand every person mentioned in this file over to a third-party server?”',
          },
          {
            heading: 'Copyright, creative labor, and intellectual property',
            text: 'Where did the trillions of words, paintings, photographs, songs, and code repositories used to train frontier AI models come from? Most were scraped from the public internet without asking individual authors, journalists, illustrators, or musicians for permission or offering compensation. Courts, lawmakers, and creators around the world are actively debating where “fair use” ends and copyright infringement begins — especially when an AI tool is prompted to mimic a living artist’s signature style to compete with them in the marketplace.',
          },
          {
            heading: 'Practical data minimization habits',
            text: 'You can use AI tools effectively while protecting privacy through two habits. First, inspect your account settings in any AI tool you use and turn off “Use my chats to train models” (data-sharing opt-out). Second, practice “data minimization” (anonymization): if you want feedback on a rough draft of a personal college essay or club budget, replace real names, school names, locations, and specific identifying figures with generic placeholders before pasting.',
          },
        ],
        keyTakeaways: [
          'Prompts sent to consumer AI tools are processed on remote servers, may be reviewed by humans, and are often used for future training.',
          'Never paste personal identifiers, passwords, medical details, or another person’s private photos, voice, or writing into a chatbot.',
          'Use training opt-out settings and strip identifying details (data minimization) before sharing drafts.',
        ],
      },
      {
        id: 'deepfakes-and-misinformation',
        title: 'Synthetic Media, Deepfakes & Information Integrity',
        minutes: 13,
        xp: 75,
        summary:
          'Understand how synthetic voice clones and video deepfakes are generated, why non-consensual synthetic media causes severe harm, and how to verify digital media before sharing.',
        video: {
          id: 'vid-deepfakes-and-misinformation',
          title: 'Field Video 3.4 — Deepfakes, Provenance & Media Verification',
          duration: '12:05',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Examines how audio and video synthesis affect public trust, explains the legal and personal harms of deepfakes, and teaches forensic and provenance techniques for verifying digital media.',
          segments: [
            { timestamp: '00:00', label: 'Voice Clones & Video Deepfakes Explained' },
            { timestamp: '02:30', label: 'The Harm & Illegality of Non-Consensual Deepfakes' },
            { timestamp: '05:05', label: 'Synthetic Disinformation & the Liar’s Dividend' },
            { timestamp: '07:45', label: 'Forensic Clues & Cryptographic Provenance (C2PA)' },
            { timestamp: '10:00', label: 'The SIFT Civic Verification Habit' },
          ],
        },
        body: [
          {
            heading: 'When seeing and hearing are no longer automatic proof',
            text: 'For over a century, photographs, audio recordings, and video clips served as society’s baseline evidence that an event actually happened. Generative AI has broken that assumption. Modern voice-synthesis models can clone a person’s timbre and cadence from as little as three to ten seconds of public audio, and diffusion video models can fabricate realistic clips or alter a speaker’s lip movements to match a script they never spoke.',
          },
          {
            heading: 'The real harm of non-consensual deepfakes',
            text: 'Creating, requesting, or forwarding fabricated images, audio, or video of real people — such as classmates, teachers, or community members — saying or doing things they never did is not a harmless joke. Non-consensual synthetic media inflicts severe emotional, reputational, and psychological harm, violates school codes of conduct, and is increasingly a criminal and civil offense under state and federal laws. Ethical digital citizenship starts with a zero-tolerance rule: never fabricate media of real people without consent, and never amplify it if someone else does.',
          },
          {
            heading: 'Synthetic disinformation and the “Liar’s Dividend”',
            text: 'In civic life, cheap generative media creates two twin dangers. The first is flooding social feeds with fabricated crisis photos, fake political audio leaks, or networks of AI-written bot accounts that manufacture the illusion of public consensus. The second danger, coined by legal scholars Bobby Chesney and Danielle Citron, is the “Liar’s Dividend”: as the public becomes aware that anything can be faked, bad actors caught on real video or audio can simply claim, “That’s just an AI deepfake!” — eroding accountability for real misconduct.',
          },
          {
            heading: 'Forensic clues and cryptographic provenance (C2PA)',
            text: 'While visual glitches in synthetic media are shrinking, careful observers still check for inconsistencies: unnatural lighting reflections, garbled background text on signs, jewelry or glasses that morph between frames, or audio with flat breathing cadence. Because visual inspection alone will not scale forever, camera manufacturers, newsrooms, and AI labs are building cryptographic provenance standards like C2PA (Content Credentials) and invisible watermarks (like SynthID) that attach a tamper-evident digital signature recording whether an image was captured by a physical camera lens or generated by a model.',
          },
          {
            heading: 'The civic habit: pause before you amplify',
            text: 'Viral misinformation relies on speed and emotional hijacking — getting you to hit “share” or forward a clip to a group chat within three seconds of feeling shocked, angry, or amused. Whenever you encounter a dramatic photo, voice clip, or screenshot with no clear origin, practice the SIFT habit: Stop, Investigate the source, Find trusted coverage from established newsrooms, and Trace the media back to its original context before passing it along.',
          },
        ],
        keyTakeaways: [
          'Modern voice cloning and video diffusion mean audio and visual clips require the same source verification as written claims.',
          'Creating or sharing non-consensual deepfakes of classmates, teachers, or others causes serious harm and carries legal consequences.',
          'Use the SIFT protocol (Stop, Investigate source, Find trusted coverage, Trace original context) before sharing dramatic media.',
        ],
      },
      {
        id: 'big-picture',
        title: 'Energy, Labor & the Future of Human Agency',
        minutes: 11,
        xp: 65,
        summary:
          'Look at the physical infrastructure of data centers, electricity and water footprints, the global human workforce behind dataset labeling, and why human judgment remains irreplaceable.',
        video: {
          id: 'vid-big-picture',
          title: 'Field Video 3.5 — The Physical Footprint & Future of AI',
          duration: '10:30',
          instructorNote:
            'Video Placeholder — This companion video teaches the exact same concepts, examples, and diagrams as the written lesson below.',
          summary:
            'Pulls back the curtain on the cloud: exploring the electricity and water required by GPU data centers, the unseen human workers who label data, and how to keep humans in control.',
          segments: [
            { timestamp: '00:00', label: 'The Physical Footprint: Power, Cooling & Hardware' },
            { timestamp: '02:15', label: 'Proportionate Computing: Right-Sizing Your Tools' },
            { timestamp: '04:30', label: 'The Invisible Human Labor Behind AI' },
            { timestamp: '06:45', label: 'How Jobs & Human Skills Are Evolving' },
            { timestamp: '08:40', label: 'Human-in-the-Loop Accountability' },
          ],
        },
        body: [
          {
            heading: 'The cloud is made of concrete, silicon, electricity, and water',
            text: 'We talk about “the cloud” as if AI floats weightlessly in the sky. In reality, every prompt runs inside warehouse-sized data centers packed with tens of thousands of high-wattage GPUs. Training a single frontier model requires gigawatt-hours of electricity, and running billions of daily user queries (inference) consumes even more energy over time. Because those chips generate intense heat, data centers also circulate millions of gallons of fresh water for evaporative cooling, while the hardware itself depends on mined minerals like cobalt, lithium, and silicon.',
          },
          {
            heading: 'Proportionate computing: choosing the right tool for the job',
            text: 'While engineers work to design more energy-efficient chips, smaller specialized models, and renewable-powered data centers, everyday users can practice “proportionate computing.” Using a massive frontier generative model to calculate 18 × 24, look up today’s weather, or find a website URL uses orders of magnitude more energy than a built-in calculator or a standard search query. Reach for large generative models when a task genuinely benefits from synthesis, tutoring, or complex reasoning.',
          },
          {
            heading: 'The unseen human workforce behind “autonomous” AI',
            text: 'Behind every seemingly effortless AI system stands a vast, often invisible global workforce. Millions of data annotators and contractors around the world draw bounding boxes around street signs for self-driving cars, transcribe audio clips, grade chatbot answers for RLHF, and review toxic or violent content so safety filters learn what to block. Remembering that AI is built on human labor — from the writers whose books trained the model to the annotators who labeled the safety data — grounds how we evaluate the industry.',
          },
          {
            heading: 'How jobs and human skills are evolving',
            text: 'Throughout history, major technologies have reshaped what human skills are scarce and valuable. As AI makes generating average first drafts, boilerplate code, and routine summaries cheap and instant, the value of passive synthesis drops — while the value of deep domain expertise, original framing, critical verification, ethical judgment, and human empathy rises. The people who thrive will not be those who let AI think for them, but those who combine strong foundational knowledge with sharp tool literacy.',
          },
          {
            heading: 'Keeping humans in the loop and accountable',
            text: 'Every lesson in this field guide leads to one closing principle: a software model cannot bear moral or legal responsibility. A hospital algorithm cannot take the Hippocratic oath; a courtroom risk score cannot serve a sentence; a chatbot cannot stand behind a school newspaper article. In medicine, law, aviation, journalism, and your own education, AI should remain an advisor and an instrument — with an informed, skeptical, accountable human always in command.',
          },
        ],
        keyTakeaways: [
          'Cloud AI has a substantial physical footprint in electricity, cooling water, and hardware minerals; use proportionate tools for simple lookups.',
          'Modern AI systems rely on millions of unseen human data labelers, safety moderators, and content creators.',
          'Software cannot be held morally accountable — humans must remain in the loop, in the know, and responsible for every high-stakes decision.',
        ],
      },
    ],
    quiz: [
      {
        question: 'What is the “Conversation Test” for academic integrity when submitting schoolwork?',
        options: [
          'Checking whether your essay passes an online AI detector with a low score',
          'Being able to explain and defend every sentence, concept, equation, or line of code in a live conversation with your teacher',
          'Asking a friend if the essay sounds like something a high schooler would write',
          'Replacing every fifth word with a synonym from a thesaurus',
        ],
        answer: 1,
        explanation:
          'True authorship means you understand and own every part of your submission well enough to explain and defend it on the spot.',
      },
      {
        question: 'Why did an experimental hiring algorithm penalize resumes containing the word “women’s,” even though programmers didn’t write a rule to do so?',
        options: [
          'The computer suffered a hardware glitch',
          'It was trained on ten years of historical resumes from a male-dominated workforce and learned existing human hiring bias from the data',
          'It sorted resumes by word length',
          'Algorithms only work on numbers, not words',
        ],
        answer: 1,
        explanation:
          'Machine learning models mirror the historical patterns and prejudices embedded in their training datasets.',
      },
      {
        question: 'Which of the following is safe and ethical to paste into a public consumer AI chatbot?',
        options: [
          'A classmate’s draft essay and full name without their permission',
          'Your home address, student ID, and medical excuse note',
          'An anonymized paragraph of your own writing with personal names removed, when AI feedback is permitted by your teacher',
          'A private group chat screenshot involving friends at school',
        ],
        answer: 2,
        explanation:
          'Never upload PII or other people’s work/media without consent; anonymizing your own permitted work practices safe data minimization.',
      },
      {
        question: 'What is the “Liar’s Dividend” created by the rise of deepfakes and synthetic media?',
        options: [
          'A cash reward paid to people who spot fake images online',
          'When people caught on authentic video or audio doing something wrong falsely claim the real recording is an AI deepfake to escape accountability',
          'The electricity cost of running an image generator',
          'A copyright license for digital artists',
        ],
        answer: 1,
        explanation:
          'Not only do deepfakes make fake events look real, they also allow bad actors to dismiss genuine video or audio evidence as “AI-generated.”',
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
