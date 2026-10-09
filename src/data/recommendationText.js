/**
 * Recommendation text variants and rules pool for Module 3 Happiness Plan.
 * Rule tiers: low / medium / high with at least 3 variants per tier.
 * Tone: Warm, uplifting, deeply encouraging.
 */

export const summaryVariants = {
  highLoveHighKnow: [
    'You two share an electric harmony! With an extraordinary intuitive understanding and deep affection, you bring out the sweetest, most grounded sides in each other.',
    'A radiant synergy fills your connection. You not only cherish each other’s hearts, but you also notice the little nuances that make each of you shine.',
    'Your bond is full of both sparkle and substance. You have built a comforting sanctuary where both of you can be fully, joyfully yourselves.'
  ],
  highLoveModerateKnow: [
    'Your natural chemistry is undeniable and full of warmth! While you already share a great emotional spark, there are still wonderful surprises waiting to be uncovered.',
    'There is an abundance of genuine love and goodwill between you. Taking curious moments to learn each other’s smaller quirks will make your connection blossom even more.',
    'Your affection runs deep, like a steady flame. Every new thing you learn about one another adds another layer of joy to your story.'
  ],
  moderateLoveHighKnow: [
    'You understand each other with impressive clarity and respect. Your shared history and mutual attentiveness provide a rock-solid foundation for lasting happiness.',
    'You read each other like an open book, anchored by deep familiarity and care. Bringing in playful spontaneous moments will add even more magic.',
    'Your mutual insight is a true superpower. You know how the other ticks, creating an environment of profound psychological safety and ease.'
  ],
  growingBoth: [
    'Your relationship is an exciting blooming adventure with unlimited potential. You are discovering each other step by step, and the journey ahead is full of sweetness.',
    'You bring unique energies together that create fresh perspectives. With intentional curiosity and gentle listening, your connection will continue to flourish.',
    'Every great relationship is built on small everyday choices to show up. You have the raw ingredients for something truly special and heartwarming.'
  ]
};

export const dateIdeaCatalog = [
  // Low know score focus
  {
    condition: 'lowKnow',
    ideas: [
      {
        title: 'The "20 Sweet Questions" Cozy Night',
        icon: '🛋️',
        description: 'Brew warm tea or hot cocoa, put your phones on silent, and take turns asking each other childhood stories and dream aspirations you have never shared before.'
      },
      {
        title: 'Custom Pizza & Trivia Cook-Off',
        icon: '🍕',
        description: 'Make mini pizzas where each person decorates a slice representing the other person’s favorite flavors, followed by a lighthearted trivia game.'
      },
      {
        title: 'Memory Lane Photo Shuffle',
        icon: '📷',
        description: 'Pull out baby photos, favorite vacation memories, or memorable snapshots and narrate the behind-the-scenes stories to each other.'
      }
    ]
  },
  // High care / over-caring focus
  {
    condition: 'highCare',
    ideas: [
      {
        title: 'Home Spa & Relaxation Oasis',
        icon: '🧖',
        description: 'Light lavender candles, put on acoustic soothing tunes, and indulge in pampering foot baths or gentle head massages to unwind from overthinking.'
      },
      {
        title: 'Zero-Pressure Stargazing Picnic',
        icon: '✨',
        description: 'Spread a plush blanket outdoors or near a cozy window, sip warm cider, and let go of all checklists while gazing at the constellations.'
      },
      {
        title: 'Mindful Nature Stroll & Audio Detach',
        icon: '🌿',
        description: 'Take a slow walk in a botanical garden or scenic trail, admiring blossoms and breathing fresh air with nothing on your to-do list.'
      }
    ]
  },
  // High love + High know focus
  {
    condition: 'highBoth',
    ideas: [
      {
        title: 'Spontaneous Mystery Micro-Adventure',
        icon: '🗺️',
        description: 'Flip a coin at three street intersections and find a whimsical hidden cafe, dessert parlor, or quaint bookstore you’ve never visited.'
      },
      {
        title: 'Sunrise Breakfast & Polaroid Date',
        icon: '🌅',
        description: 'Wake up early to catch the golden hour sunrise with warm croissants, snapping candid instant photos to frame for your room.'
      },
      {
        title: 'Creative Pottery or Painting Workshop',
        icon: '🎨',
        description: 'Get your hands messy crafting matching clay mugs or painting silly portraits of each other to celebrate your electric chemistry.'
      }
    ]
  },
  // General / Balanced
  {
    condition: 'default',
    ideas: [
      {
        title: 'Sunset Rooftop / Balcony Chat',
        icon: '🌇',
        description: 'Watch the sunset with your favorite sweet snacks, talking about the highlight moments of your week without any interruptions.'
      },
      {
        title: 'Playful Board Game or Arcade Night',
        icon: '🎲',
        description: 'Pick a lighthearted collaborative or friendly competitive game, complete with popcorn and lots of goofy laughter.'
      },
      {
        title: 'DIY Dessert Tasting Flight',
        icon: '🧁',
        description: 'Pick up 3 different pastries or bake cookies together, rating them like Michelin star judges with funny commentary.'
      }
    ]
  }
];

export const smallGestures = {
  unconditionalHigh: [
    'Leave a sticky note where they will find it: "I love who you are today, tomorrow, and always."',
    'Offer an extra-long comforting embrace without asking for anything in return.',
    'Bring them their favorite beverage exactly the way they like it when they are deep in thought.'
  ],
  caringOver: [
    'Pour a warm bath or prepare their favorite soothing tea, and gently remind them: "You took care of everything today; now let me take care of you."',
    'Take over a recurring daily chore so they can have a guilt-free 30-minute nap or quiet time.',
    'Send an affectionate mid-day message telling them how much you admire their giving heart.'
  ],
  caringSpace: [
    'Offer an unprompted, warm check-in: "Thinking of you, no need to reply right now—just sending love!"',
    'Surprise them with a tiny thoughtful treat that shows you noticed something they mentioned days ago.',
    'Give them your undivided attention for 10 minutes without multitasking on your screen.'
  ],
  truenessHigh: [
    'Share a sincere, vulnerable appreciation of a promise they kept that made you feel safe.',
    'Plan a reliable, punctual date where every detail is taken care of just as promised.',
    'Look into their eyes and tell them: "You are the person I can always count on, and I treasure that."'
  ],
  balanced: [
    'Send a cute photo of a memory you shared together with a sweet "grateful for you" note.',
    'Cook or order their favorite comfort dinner on a random weekday just because.',
    'Give a genuine compliment about a personal quality or effort that others might overlook.'
  ]
};

export const growthTips = {
  overCaring: [
    'Remember that boundaries are an act of love. Practicing self-care refuels your spirit so you can love from abundance rather than exhaustion.',
    'Trust that your partner is strong and capable. Allowing them space to solve their own challenges honors their capability and frees up your mental energy.',
    'Check in with your own needs first before jumping in to fix things. Your peace and wellness matter just as much.'
  ],
  givesSpace: [
    'While honoring independence is wonderful, vocalizing spontaneous warmth and affection helps your partner feel deeply anchored and treasured.',
    'Try sharing small daily updates or passing thoughts; sharing little moments bridges emotional distance effortlessly.',
    'Do not hesitate to reach out first and initiate plans—it communicates intentional care that warms the heart.'
  ],
  lowerTrueness: [
    'Focus on emotional openness: sharing small honest feelings early prevents misunderstandings and builds rock-solid mutual trust.',
    'Keep small daily promises (like calling when you said you would); micro-consistencies weave the strongest safety net in love.',
    'Speak your authentic truth with kindness. True connection thrives when you feel safe being vulnerable without masks.'
  ],
  default: [
    'Celebrate each other’s little wins regularly. Mutual cheerleading keeps your relationship vibrant and joyful through all seasons.',
    'Schedule regular tech-free connection moments where you simply listen and connect without external distractions.',
    'Continue being curious about how the other person is evolving; you are both growing, and learning each other is a lifelong gift.'
  ]
};

export const default7DayChallenge = [
  { day: 1, title: 'Secret Sticky Note', desc: 'Hide a cute note with a genuine compliment somewhere they will discover it during the day.' },
  { day: 2, title: 'No-Distraction Talk', desc: 'Spend 15 uninterrupted minutes talking about your day with phones in another room.' },
  { day: 3, title: 'Comfort Beverage Delivery', desc: 'Prepare or fetch their go-to coffee, tea, or refreshing drink just the way they like it.' },
  { day: 4, title: 'Memory Recall', desc: 'Reminisce about the first time you laughed hysterically together or a favorite funny moment.' },
  { day: 5, title: 'The Errand Relief', desc: 'Take one small chore or errand off their shoulders before they even ask.' },
  { day: 6, title: 'Music Connection', desc: 'Share one song that reminds you of them or listen to a nostalgic track together.' },
  { day: 7, title: 'Heartfelt Hug & Gratitude', desc: 'Give a 20-second warm embrace and tell them one reason you feel lucky to have them in your life.' }
];

export default {
  summaryVariants,
  dateIdeaCatalog,
  smallGestures,
  growthTips,
  default7DayChallenge
};
