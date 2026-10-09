/**
 * 12 Scenario-Based Questions for Module 2:
 * "Who Loves Unconditionally, Cares, and is True"
 *
 * Each question has 3 options providing points towards:
 * - unconditional (1-5)
 * - caring (1-5, where higher values reflect deeper emotional involvement / over-caring tendencies)
 * - trueness (1-5)
 */

export const traitQuestions = [
  {
    id: 't1',
    scenario: 'Your person forgets an important plan you made together...',
    options: [
      {
        text: 'I gently tease them, help rearrange it, and reassure them that mistakes happen.',
        points: { unconditional: 5, caring: 4, trueness: 5 }
      },
      {
        text: 'I feel slightly disappointed, take a little breath, and talk about how to prevent it next time.',
        points: { unconditional: 3, caring: 3, trueness: 4 }
      },
      {
        text: 'I instantly drop everything to fix the schedule myself so they do not feel guilty at all.',
        points: { unconditional: 4, caring: 5, trueness: 3 }
      }
    ]
  },
  {
    id: 't2',
    scenario: 'Your person makes a major mistake at work or school and comes home feeling devastated...',
    options: [
      {
        text: 'I give them space to decompress quietly first, then offer a calm listening ear without rushing advice.',
        points: { unconditional: 4, caring: 2, trueness: 4 }
      },
      {
        text: 'I make their favorite comfort tea/meal, sit beside them, and remind them of their inner strength.',
        points: { unconditional: 5, caring: 4, trueness: 5 }
      },
      {
        text: 'I stay up all night researching solutions and worry deeply about how it affects their future.',
        points: { unconditional: 4, caring: 5, trueness: 3 }
      }
    ]
  },
  {
    id: 't3',
    scenario: 'Your person asks for a completely solo weekend to rest and recharge away from everyone...',
    options: [
      {
        text: 'I happily support them! "Take all the quiet time you need, text me only if you want."',
        points: { unconditional: 5, caring: 2, trueness: 5 }
      },
      {
        text: 'I encourage them warmly, pack a little snack care kit, and check in just once gently.',
        points: { unconditional: 4, caring: 3, trueness: 4 }
      },
      {
        text: 'I agree, but find myself checking my phone frequently and wondering if they are okay.',
        points: { unconditional: 3, caring: 5, trueness: 3 }
      }
    ]
  },
  {
    id: 't4',
    scenario: 'An acquaintance whispers an unflattering rumor about your person...',
    options: [
      {
        text: 'I immediately shut down the gossip and defend them without hesitation.',
        points: { unconditional: 5, caring: 4, trueness: 5 }
      },
      {
        text: 'I ignore the gossip and come straight to my person to talk openly with full honesty.',
        points: { unconditional: 4, caring: 3, trueness: 5 }
      },
      {
        text: 'I get anxious and immediately investigate everything to shield my person from any harm.',
        points: { unconditional: 4, caring: 5, trueness: 4 }
      }
    ]
  },
  {
    id: 't5',
    scenario: 'Your person goes through a moody phase and is unusually irritable today...',
    options: [
      {
        text: 'I don’t take it personally. I stay patient, knowing everyone has stormy days.',
        points: { unconditional: 5, caring: 3, trueness: 4 }
      },
      {
        text: 'I kindly ask if there is anything behind the stress and offer a supportive hug.',
        points: { unconditional: 4, caring: 4, trueness: 5 }
      },
      {
        text: 'I scramble to cheer them up constantly, blaming myself if they remain upset.',
        points: { unconditional: 3, caring: 5, trueness: 3 }
      }
    ]
  },
  {
    id: 't6',
    scenario: 'You disagree strongly on an important decision for the future...',
    options: [
      {
        text: 'We lay out our views calmly, listen to understand each other, and find a fair middle ground.',
        points: { unconditional: 4, caring: 3, trueness: 5 }
      },
      {
        text: 'I voice my sincere feelings honestly while making sure they feel respected and loved throughout.',
        points: { unconditional: 5, caring: 4, trueness: 5 }
      },
      {
        text: 'I easily surrender my preference just to keep them happy and comfortable.',
        points: { unconditional: 4, caring: 5, trueness: 2 }
      }
    ]
  },
  {
    id: 't7',
    scenario: 'You promised you would attend an event with them, but you are unexpectedly exhausted...',
    options: [
      {
        text: 'I communicate honestly about my energy, keeping promises transparently and finding a win-win.',
        points: { unconditional: 4, caring: 3, trueness: 5 }
      },
      {
        text: 'I push through happily with a bright smile because seeing them have fun energizes me.',
        points: { unconditional: 5, caring: 4, trueness: 4 }
      },
      {
        text: 'I force myself to go no matter how depleted I am, ignoring my own health completely.',
        points: { unconditional: 3, caring: 5, trueness: 3 }
      }
    ]
  },
  {
    id: 't8',
    scenario: 'Your person takes up an unusual new hobby that takes up a lot of their free time...',
    options: [
      {
        text: 'I celebrate their curiosity and give them full room to explore their new passion.',
        points: { unconditional: 5, caring: 2, trueness: 4 }
      },
      {
        text: 'I cheer them on and ask them to teach me about it so we can bond over it too.',
        points: { unconditional: 4, caring: 4, trueness: 5 }
      },
      {
        text: 'I secretly feel a bit left out, so I reorganize my entire life to join them in it.',
        points: { unconditional: 3, caring: 5, trueness: 3 }
      }
    ]
  },
  {
    id: 't9',
    scenario: 'You notice your person looks slightly worried about something they haven’t mentioned yet...',
    options: [
      {
        text: 'I let them know my door is open whenever they are ready to talk, without prying.',
        points: { unconditional: 4, caring: 2, trueness: 4 }
      },
      {
        text: 'I bring them a warm drink and say, "I am right here with you whenever you need."',
        points: { unconditional: 5, caring: 4, trueness: 5 }
      },
      {
        text: 'I keep asking repeatedly because I cannot rest until I know exactly what is wrong.',
        points: { unconditional: 3, caring: 5, trueness: 3 }
      }
    ]
  },
  {
    id: 't10',
    scenario: 'Your person achieves a milestone you personally worked hard for but haven’t reached yet...',
    options: [
      {
        text: 'I am 100% thrilled for them! Their win feels like my win, pure celebration.',
        points: { unconditional: 5, caring: 4, trueness: 5 }
      },
      {
        text: 'I congratulate them genuinely, while being transparent about using it as positive inspiration.',
        points: { unconditional: 4, caring: 3, trueness: 5 }
      },
      {
        text: 'I go all out planning a grand party for them, completely forgetting my own goals.',
        points: { unconditional: 4, caring: 5, trueness: 3 }
      }
    ]
  },
  {
    id: 't11',
    scenario: 'Years pass and your person undergoes changes in taste, appearance, or style...',
    options: [
      {
        text: 'I fall in love with who they are evolving into; change is part of a lifelong journey.',
        points: { unconditional: 5, caring: 4, trueness: 5 }
      },
      {
        text: 'I appreciate learning their new facets while keeping our core values rooted.',
        points: { unconditional: 4, caring: 3, trueness: 5 }
      },
      {
        text: 'I adapt whatever I do to match their latest interests so we never drift apart.',
        points: { unconditional: 4, caring: 5, trueness: 3 }
      }
    ]
  },
  {
    id: 't12',
    scenario: 'What is your truest compass when navigating relationship challenges?',
    options: [
      {
        text: 'Unconditional acceptance: choosing warmth and grace even when things aren’t picture perfect.',
        points: { unconditional: 5, caring: 4, trueness: 4 }
      },
      {
        text: 'Steadfast loyalty & truth: keeping promises, honest transparency, and standing by their side.',
        points: { unconditional: 4, caring: 3, trueness: 5 }
      },
      {
        text: 'Devoted protective care: doing whatever it takes to ensure they feel cherished and sheltered.',
        points: { unconditional: 4, caring: 5, trueness: 3 }
      }
    ]
  }
];

export default traitQuestions;
